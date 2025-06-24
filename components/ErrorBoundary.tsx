// components/ErrorBoundary.tsx
"use client";

import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className='p-4 bg-red-100 text-red-800 rounded'>
      <p>Error: {error.message}</p>
    </div>
  );
}

export function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ReactErrorBoundary FallbackComponent={ErrorFallback}>
      {children}
    </ReactErrorBoundary>
  );
}


