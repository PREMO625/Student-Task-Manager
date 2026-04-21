'use client';

import { AuthProvider } from '@/hooks/useAuth';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'toast-custom',
          duration: 3000,
          style: {
            background: '#1a1f35',
            color: '#e8ecf4',
            border: '1px solid rgba(139, 149, 176, 0.12)',
            borderRadius: '12px',
          },
          success: {
            iconTheme: { primary: '#34d399', secondary: '#0a0e1a' },
          },
          error: {
            iconTheme: { primary: '#fb7185', secondary: '#0a0e1a' },
          },
        }}
      />
    </AuthProvider>
  );
}
