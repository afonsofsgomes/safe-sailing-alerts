
import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { AlertWidget } from '@/components/AlertWidget';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Copy, Check, Code2 } from 'lucide-react';
import { useAppStore } from '@/lib/store';

function Embed() {
  const { toast } = useToast();
  const fetchData = useAppStore((state) => state.fetchData);
  const [copied, setCopied] = useState(false);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const hostUrl = window.location.origin;
  
  const iframeCode = `<iframe src="${hostUrl}/embed" width="100%" height="150" style="border:none;overflow:hidden;" title="Weather Alert Widget"></iframe>`;
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopied(true);
        toast({
          title: "Copied!",
          description: "The code has been copied to your clipboard.",
        });
        
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        toast({
          title: "Failed to copy",
          description: "Please try again or copy manually.",
          variant: "destructive",
        });
      });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 pt-24 pb-12 px-6 max-w-7xl mx-auto w-full">
        <div className="mb-10 animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-900">Embed Widget</h1>
          <p className="mt-2 text-gray-600">
            Add the weather alert widget to your website by embedding the code below.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6 bg-white p-6 rounded-xl shadow-sm border animate-fade-in">
            <Tabs defaultValue="iframe">
              <TabsList>
                <TabsTrigger value="iframe">
                  <Code2 className="h-4 w-4 mr-2" />
                  iFrame Embed
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="iframe" className="mt-4">
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Copy and paste this code into your website's HTML where you want the widget to appear:
                  </p>
                  
                  <div className="relative">
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-md text-sm overflow-x-auto">
                      <code>{iframeCode}</code>
                    </pre>
                    
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="absolute top-2 right-2 h-8 w-8 p-0"
                      onClick={() => copyToClipboard(iframeCode)}
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-md">
                    <h3 className="font-medium text-amber-800">Important Note</h3>
                    <p className="mt-1 text-sm text-amber-700">
                      The widget will only display alerts when there are active disruptions. If there are no upcoming disruptions, the widget will be hidden.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-xl font-semibold">Widget Preview</h3>
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <AlertWidget standalone={true} />
            </div>
            <p className="text-sm text-muted-foreground">
              This is how your alert widget will appear on your website.
              To customize the appearance, go to the Admin page.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Embed;
