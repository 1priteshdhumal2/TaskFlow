import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="app-container">
        <header className="app-header">
          <h1>TaskFlow Monorepo Scaffold</h1>
          <span className="badge">Phase 1 Scaffolding</span>
        </header>
        <main className="app-main">
          <div className="status-card">
            <h2>System Status</h2>
            <div className="status-list">
              <div className="status-item">
                <span className="dot active"></span>
                <span>Frontend: React + Vite + SWC (Running)</span>
              </div>
              <div className="status-item">
                <span className="dot active"></span>
                <span>Backend: Express + Node.js (Ready)</span>
              </div>
              <div className="status-item">
                <span className="dot active"></span>
                <span>Workspaces: Configured</span>
              </div>
            </div>
            <p className="hint">
              This frontend has TanStack Query and Axios pre-installed. Edit files under{' '}
              <code>src/features/</code> to begin implementing features.
            </p>
          </div>
        </main>
      </div>
    </QueryClientProvider>
  );
}
