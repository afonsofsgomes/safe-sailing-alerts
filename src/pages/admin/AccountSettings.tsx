
import { useAuth } from '@/lib/auth';
import { Navigate } from 'react-router-dom';
import { AccountSettings } from '@/components/auth/AccountSettings';

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

  return <AccountSettings />;
}
