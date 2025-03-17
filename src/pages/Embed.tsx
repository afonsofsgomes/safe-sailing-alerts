
import { useState } from 'react';
import { Header } from '@/components/Header';
import { AlertWidget } from '@/components/AlertWidget';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Copy, Check, Code } from 'lucide-react';

const Embed = () => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  // Generate embed code
  const generateEmbedCode = () => {
    const scriptUrl = window.location.origin + '/widget.js';
    return `<!-- SafeSailing Weather Alert Widget -->
<div id="safesailing-alert-widget"></div>
<script src="${scriptUrl}" defer></script>`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateEmbedCode());
    setCopied(true);
    
    toast({
      title: "Copied!",
      description: "Widget code copied to clipboard",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 pt-24 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10 animate-fade-in">
            <h1 className="text-3xl font-bold text-gray-900">Embed Widget</h1>
            <p className="mt-2 text-gray-600">
              Add the alert widget to your website with this simple code snippet.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div className="bg-white p-6 rounded-xl shadow-sm border animate-fade-in">
              <h2 className="text-xl font-semibold mb-4">Widget Preview</h2>
              <AlertWidget standalone />
              <p className="text-sm text-muted-foreground mt-4">
                This widget will automatically display on your website when there are active disruptions.
              </p>
            </div>
            
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Embed Code</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    className="flex items-center gap-1"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        <span>Copy</span>
                      </>
                    )}
                  </Button>
                </div>
                
                <Textarea
                  value={generateEmbedCode()}
                  readOnly
                  rows={5}
                  className="font-mono text-sm"
                />
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
                <div className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-sea-500" />
                  <h2 className="text-xl font-semibold">Integration Steps</h2>
                </div>
                
                <ol className="space-y-3 text-gray-700 list-decimal ml-5">
                  <li>Copy the embed code above.</li>
                  <li>Paste it into your website's HTML where you want the widget to appear.</li>
                  <li>The widget will automatically display when there are active disruptions.</li>
                  <li>Configure and manage alerts from the Admin panel.</li>
                </ol>
                
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg mt-4">
                  <p className="text-sm text-amber-800">
                    <strong>Note:</strong> The widget will only appear when there are active disruptions
                    scheduled in the admin panel. If there are no active disruptions, the widget will
                    not be visible on your website.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Embed;
