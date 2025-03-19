
import { useAuth } from '@/lib/auth';
import { Navigate } from 'react-router-dom';
import { LoginForm } from '@/components/auth/LoginForm';

export function AuthPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (user) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">SeaYou Madeira</h1>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <LoginForm onSuccess={() => {}} onRegisterClick={() => {}} />
        </div>
      </div>
    </div>
  );
}
