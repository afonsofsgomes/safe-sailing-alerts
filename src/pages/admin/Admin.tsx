
import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, ShieldAlert, BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { AuthModal } from '@/components/auth/AuthModal';
import { useAppStore } from '@/lib/store';
import { AlertCalendar } from '@/components/alert-calendar';
import { WidgetSettings } from './WidgetSettings';
import { Link } from 'react-router-dom';

const Admin = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const fetchData = useAppStore((state) => state.fetchData);
  
  useEffect(() => {
    fetchData();
  }, [fetchData, user]);

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 pt-24 pb-12 px-6 max-w-7xl mx-auto w-full">
        <div className="mb-10 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Alert Management</h1>
              <p className="mt-2 text-gray-600">
                Manage weather-related disruptions and customize your alert widget.
              </p>
            </div>
            
            <Link to="/admin/analytics">
              <Button className="flex items-center gap-2">
                <BarChart2 className="h-4 w-4" />
                View Analytics
              </Button>
            </Link>
          </div>
          
          {!user && (
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-3">
              <ShieldAlert className="h-5 w-5 text-amber-600" />
              <div>
                <p className="text-amber-800">Sign in to save your changes</p>
                <p className="text-sm text-amber-700">
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-amber-600" 
                    onClick={() => setAuthModalOpen(true)}
                  >
                    Click here to sign in
                  </Button> 
                  {" "}or create an account to save your widget settings and disruptions.
                </p>
              </div>
            </div>
          )}
        </div>
        
        <Tabs defaultValue="calendar" className="w-full animate-fade-in">
          <TabsList className="mb-8">
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="settings">Widget Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="calendar" className="space-y-6">
            <AlertCalendar />
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-8">
            <WidgetSettings />
          </TabsContent>
        </Tabs>
      </main>
      
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />
    </div>
  );
};

export default Admin;
