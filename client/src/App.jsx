import { useState, useCallback } from 'react';
import TelemetryHeader from './components/TelemetryHeader';
import SampleBar from './components/SampleBar';
import SourceInspector from './components/SourceInspector';
import TriagePanel from './components/TriagePanel';
import WebhookPanel from './components/WebhookPanel';
import { PRESETS } from './data/presets';

function App() {
  // Core state
  const [triageResult, setTriageResult] = useState(null);
  const [inputText, setInputText] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDispatching, setIsDispatching] = useState(false);
  const [viewMode, setViewMode] = useState('visual');

  // Webhook
  const [webhookUrl, setWebhookUrl] = useState('https://httpbin.org/post');
  const [webhookLogs, setWebhookLogs] = useState([]);

  // Session metrics
  const [sessionMetrics, setSessionMetrics] = useState({
    documentsProcessed: 0,
    autoApprovalRate: 0,
    avgLatencyMs: 0,
    totalTokenCost: 0,
  });
  const [systemStatus, setSystemStatus] = useState('demo');

  // Track auto-approval stats for computing rate
  const [approvalStats, setApprovalStats] = useState({ total: 0, approved: 0, totalLatency: 0 });

  // Load a preset: fill text area and auto-run
  const handleLoadPreset = useCallback((presetId) => {
    const preset = PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    // Replace \\n with actual newlines
    setInputText(preset.sampleText.replace(/\\n/g, '\n'));
    setUploadedFile(null);
    setPreviewUrl(null);

    // Auto-run with preset
    handleRunTriage(presetId);
  }, []);

  // Run AI triage
  const handleRunTriage = useCallback(async (presetId) => {
    setIsProcessing(true);
    setTriageResult(null);

    try {
      const formData = new FormData();

      if (presetId) {
        formData.append('presetId', presetId);
      } else if (uploadedFile) {
        formData.append('file', uploadedFile);
      } else if (inputText?.trim()) {
        formData.append('text', inputText.trim());
      } else {
        setIsProcessing(false);
        return;
      }

      const res = await fetch('/api/triage', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setTriageResult(data);
        setSystemStatus(data.mode === 'gemini' ? 'connected' : 'demo');

        // Update session metrics
        setApprovalStats((prev) => {
          const newTotal = prev.total + 1;
          const newApproved = prev.approved + (data.triage.autoApproved ? 1 : 0);
          const newTotalLatency = prev.totalLatency + (data.latencyMs || 0);

          setSessionMetrics({
            documentsProcessed: newTotal,
            autoApprovalRate: Math.round((newApproved / newTotal) * 100),
            avgLatencyMs: Math.round(newTotalLatency / newTotal),
            totalTokenCost:
              sessionMetrics.totalTokenCost + (data.tokenUsage?.estimatedCost || 0),
          });

          return { total: newTotal, approved: newApproved, totalLatency: newTotalLatency };
        });
      }
    } catch (err) {
      console.error('Triage error:', err);
    } finally {
      setIsProcessing(false);
    }
  }, [uploadedFile, inputText, sessionMetrics.totalTokenCost]);

  // Update a field value
  const handleFieldUpdate = useCallback((key, newValue) => {
    setTriageResult((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        triage: {
          ...prev.triage,
          fields: prev.triage.fields.map((f) =>
            f.key === key ? { ...f, value: newValue } : f
          ),
        },
      };
    });
  }, []);

  // Dispatch webhook
  const handleDispatchWebhook = useCallback(async () => {
    if (!triageResult) return;
    setIsDispatching(true);

    try {
      const res = await fetch('/api/dispatch-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUrl: webhookUrl || undefined,
          payload: triageResult,
        }),
      });

      const data = await res.json();

      setWebhookLogs((prev) => [data, ...prev]);
    } catch (err) {
      console.error('Dispatch error:', err);
      setWebhookLogs((prev) => [
        {
          success: false,
          statusCode: 0,
          statusText: 'Network Error',
          responseTimeMs: 0,
          timestamp: new Date().toISOString(),
          responseBody: { error: err.message },
        },
        ...prev,
      ]);
    } finally {
      setIsDispatching(false);
    }
  }, [triageResult, webhookUrl]);

  return (
    <div className="h-screen flex flex-col bg-[#0a0a0f] overflow-hidden">
      <TelemetryHeader systemStatus={systemStatus} metrics={sessionMetrics} />
      <SampleBar onLoadPreset={handleLoadPreset} isProcessing={isProcessing} />

      <main className="flex-1 flex overflow-hidden">
        <SourceInspector
          inputText={inputText}
          setInputText={setInputText}
          uploadedFile={uploadedFile}
          setUploadedFile={setUploadedFile}
          previewUrl={previewUrl}
          setPreviewUrl={setPreviewUrl}
          onRunTriage={() => handleRunTriage(null)}
          isProcessing={isProcessing}
        />
        <TriagePanel
          triageResult={triageResult}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onFieldUpdate={handleFieldUpdate}
        />
      </main>

      <WebhookPanel
        webhookUrl={webhookUrl}
        setWebhookUrl={setWebhookUrl}
        triageResult={triageResult}
        webhookLogs={webhookLogs}
        onDispatch={handleDispatchWebhook}
        isDispatching={isDispatching}
      />
    </div>
  );
}

export default App;
