
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultView?: 'login' | 'register';
}

export function AuthModal({ isOpen, onClose, defaultView = 'login' }: AuthModalProps) {
  const [view, setView] = useState<'login' | 'register'>(defaultView);

  const handleSuccess = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] font-sans">
        {view === 'login' ? (
          <LoginForm 
            onSuccess={handleSuccess} 
            onRegisterClick={() => setView('register')} 
          />
        ) : (
          <RegisterForm 
            onSuccess={() => setView('login')} 
            onLoginClick={() => setView('login')} 
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
