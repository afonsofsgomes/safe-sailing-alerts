
import { useState, useRef } from 'react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Copy, Check, Code, ExternalLink } from 'lucide-react';
import { AlertWidget } from '@/components/AlertWidget';

const EmbedGenerator = () => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const iframeCodeRef = useRef<HTMLInputElement>(null);
  const scriptCodeRef = useRef<HTMLInputElement>(null);

  const baseUrl = window.location.origin;
  const iframeCode = `<iframe src="${baseUrl}/embed" style="width:100%; height:auto; border:none; overflow:hidden;" scrolling="no"></iframe>`;
  const scriptCode = `<script src="${baseUrl}/embed.js" async></script>`;

  const copyToClipboard = (text: string, type: 'iframe' | 'script') => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      toast({
        title: "Code copied!",
        description: `The ${type} embed code has been copied to your clipboard.`,
      });
      
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 pt-24 pb-12 px-6 max-w-7xl mx-auto w-full">
        <div className="mb-10 animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-900">Embed Widget</h1>
          <p className="mt-2 text-gray-600">
            Generate code to embed your alert widget on any website.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6 animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle>Embed Code Generator</CardTitle>
                <CardDescription>
                  Copy the code and paste it into your website to display the alert widget.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="iframe" className="w-full">
                  <TabsList className="mb-4 grid grid-cols-2">
                    <TabsTrigger value="iframe">IFrame Embed</TabsTrigger>
                    <TabsTrigger value="script">Script Embed</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="iframe">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="iframe-code">IFrame Embed Code</Label>
                        <div className="flex">
                          <Input
                            ref={iframeCodeRef}
                            id="iframe-code"
                            readOnly
                            value={iframeCode}
                            className="font-mono text-sm pr-12"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-4 hover:bg-transparent"
                            onClick={() => copyToClipboard(iframeCode, 'iframe')}
                          >
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      
                      <div className="pt-2">
                        <p className="text-sm text-muted-foreground">
                          Add this code to any HTML page where you want the alert to appear.
                          The iframe will automatically adjust to show only the alert.
                        </p>
                      </div>
                      
                      <Button
                        className="w-full mt-2"
                        onClick={() => copyToClipboard(iframeCode, 'iframe')}
                      >
                        Copy Embed Code
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="script">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="script-code">Script Embed Code</Label>
                        <div className="flex">
                          <Input
                            ref={scriptCodeRef}
                            id="script-code"
                            readOnly
                            value={scriptCode}
                            className="font-mono text-sm pr-12"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-4 hover:bg-transparent"
                            onClick={() => copyToClipboard(scriptCode, 'script')}
                          >
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      
                      <div className="pt-2">
                        <p className="text-sm text-muted-foreground">
                          Add this script tag to your website's header or body.
                          The alert will be automatically injected and styled to match your site.
                        </p>
                        <p className="text-sm text-amber-600 mt-2">
                          Note: Script embedding is coming soon. Use the iframe method for now.
                        </p>
                      </div>
                      
                      <Button
                        className="w-full mt-2"
                        onClick={() => copyToClipboard(scriptCode, 'script')}
                      >
                        Copy Embed Code
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
                
                <div className="mt-6 pt-6 border-t">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-medium">Test the Embed</h3>
                    <Button variant="outline" size="sm" asChild>
                      <a href="/embed" target="_blank" className="flex items-center gap-2">
                        <ExternalLink className="h-4 w-4" />
                        View Standalone
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-xl font-semibold">Widget Preview</h3>
            <div className="bg-white p-6 rounded-xl shadow-sm border overflow-hidden">
              <AlertWidget standalone={true} />
            </div>
            <p className="text-sm text-muted-foreground">
              This is a preview of how your alert widget will appear when embedded.
              Changes made in the Widget Settings will be reflected here.
            </p>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Implementation Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium">Responsive Sizing</h4>
                  <p className="text-sm text-muted-foreground">
                    The widget will automatically adjust to fit the container where you place it.
                    For best results, place it in a full-width container.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">Positioning</h4>
                  <p className="text-sm text-muted-foreground">
                    Consider adding this alert at the top of your page where visitors will see it immediately.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmbedGenerator;
