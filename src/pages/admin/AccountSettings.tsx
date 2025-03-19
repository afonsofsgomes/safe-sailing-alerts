
import { useAuth } from '@/lib/auth';
import { Navigate } from 'react-router-dom';
import { AccountSettings } from '@/components/auth/AccountSettings';
import { Header } from '@/components/Header';

export function AccountSettingsPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="pt-20 flex-1">
        <AccountSettings />
      </main>
    </div>
  );
}
