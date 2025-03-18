
import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { fetchSocialMediaSettings, updateSocialMediaSettings } from '@/lib/services';
import { SocialMediaSettings as SocialMediaSettingsType } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Facebook, Instagram, Hash, MessageSquare, Image } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/lib/auth';
import { AuthModal } from '@/components/auth/AuthModal';

export const SocialMediaSettings = () => {
  const [settings, setSettings] = useState<SocialMediaSettingsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hashtagInput, setHashtagInput] = useState('');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        const data = await fetchSocialMediaSettings();
        if (data) {
          setSettings(data);
        } else {
          // Initialize with default settings if none exist
          setSettings({
            id: '',
            enabled: false,
            platforms: {
              facebook: {
                enabled: false,
                pageId: '',
                pageName: '',
              },
              instagram: {
                enabled: false,
                accountId: '',
                username: '',
              },
            },
            postSettings: {
              includeImage: true,
              message: "Alert: Our services will be disrupted on {date} due to {reason}.",
              hashtags: ["weatheralert", "servicedisruption"],
              autoPost: true,
            },
            userId: '',
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      } catch (error) {
        console.error('Failed to load social media settings:', error);
        toast({
          title: 'Error',
          description: 'Failed to load social media settings',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadSettings();
    }
  }, [user, toast]);

  const handleSave = async () => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    
    if (!settings) return;
    
    try {
      setSaving(true);
      await updateSocialMediaSettings(settings);
      toast({
        title: 'Success',
        description: 'Social media settings saved',
      });
    } catch (error) {
      console.error('Failed to save social media settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save settings',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const addHashtag = () => {
    if (!hashtagInput.trim() || !settings) return;
    
    // Remove # if user added it
    const hashtag = hashtagInput.trim().replace(/^#/, '');
    
    // Check if hashtag already exists
    if (settings.postSettings.hashtags.includes(hashtag)) {
      toast({
        title: 'Warning',
        description: 'This hashtag already exists',
        variant: 'destructive',
      });
      return;
    }
    
    setSettings({
      ...settings,
      postSettings: {
        ...settings.postSettings,
        hashtags: [...settings.postSettings.hashtags, hashtag],
      }
    });
    setHashtagInput('');
  };

  const removeHashtag = (index: number) => {
    if (!settings) return;
    
    const newHashtags = [...settings.postSettings.hashtags];
    newHashtags.splice(index, 1);
    
    setSettings({
      ...settings,
      postSettings: {
        ...settings.postSettings,
        hashtags: newHashtags,
      }
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="text-center p-8">
        <p>Unable to load settings. Please try again later.</p>
        <Button onClick={() => window.location.reload()} className="mt-4">Reload</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Social Media Integration</h2>
          <p className="text-muted-foreground">Connect your social accounts to post alerts automatically</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="auto-post"
              checked={settings.enabled}
              onCheckedChange={(checked) => setSettings({...settings, enabled: checked})}
            />
            <Label htmlFor="auto-post">Enable Social Media Posts</Label>
          </div>
          
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Settings'
            )}
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="accounts" className="w-full">
        <TabsList>
          <TabsTrigger value="accounts">Social Accounts</TabsTrigger>
          <TabsTrigger value="content">Post Content</TabsTrigger>
          <TabsTrigger value="options">Options</TabsTrigger>
        </TabsList>
        
        <TabsContent value="accounts">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2">
                    <Facebook className="h-5 w-5 text-blue-600" />
                    Facebook
                  </CardTitle>
                  <CardDescription>Connect your Facebook page</CardDescription>
                </div>
                <Switch
                  checked={settings.platforms.facebook.enabled}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    platforms: {
                      ...settings.platforms,
                      facebook: {
                        ...settings.platforms.facebook,
                        enabled: checked
                      }
                    }
                  })}
                />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="facebook-page-name">Page Name</Label>
                    <Input
                      id="facebook-page-name"
                      placeholder="Your Facebook Page Name"
                      value={settings.platforms.facebook.pageName || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        platforms: {
                          ...settings.platforms,
                          facebook: {
                            ...settings.platforms.facebook,
                            pageName: e.target.value
                          }
                        }
                      })}
                      disabled={!settings.platforms.facebook.enabled}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="facebook-page-id">Page ID</Label>
                    <Input
                      id="facebook-page-id"
                      placeholder="Your Facebook Page ID"
                      value={settings.platforms.facebook.pageId || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        platforms: {
                          ...settings.platforms,
                          facebook: {
                            ...settings.platforms.facebook,
                            pageId: e.target.value
                          }
                        }
                      })}
                      disabled={!settings.platforms.facebook.enabled}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground pt-2">
                    You need to authorize our app to post to your Facebook page.
                  </p>
                  <Button 
                    variant={settings.platforms.facebook.enabled ? "default" : "outline"} 
                    className="w-full"
                    disabled={!settings.platforms.facebook.enabled}
                  >
                    Connect Facebook Page
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2">
                    <Instagram className="h-5 w-5 text-pink-600" />
                    Instagram
                  </CardTitle>
                  <CardDescription>Connect your Instagram business account</CardDescription>
                </div>
                <Switch
                  checked={settings.platforms.instagram.enabled}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    platforms: {
                      ...settings.platforms,
                      instagram: {
                        ...settings.platforms.instagram,
                        enabled: checked
                      }
                    }
                  })}
                />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="instagram-username">Username</Label>
                    <Input
                      id="instagram-username"
                      placeholder="Your Instagram Username"
                      value={settings.platforms.instagram.username || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        platforms: {
                          ...settings.platforms,
                          instagram: {
                            ...settings.platforms.instagram,
                            username: e.target.value
                          }
                        }
                      })}
                      disabled={!settings.platforms.instagram.enabled}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instagram-account-id">Account ID</Label>
                    <Input
                      id="instagram-account-id"
                      placeholder="Your Instagram Account ID"
                      value={settings.platforms.instagram.accountId || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        platforms: {
                          ...settings.platforms,
                          instagram: {
                            ...settings.platforms.instagram,
                            accountId: e.target.value
                          }
                        }
                      })}
                      disabled={!settings.platforms.instagram.enabled}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground pt-2">
                    Your Instagram account must be a business account linked to a Facebook page.
                  </p>
                  <Button 
                    variant={settings.platforms.instagram.enabled ? "default" : "outline"} 
                    className="w-full"
                    disabled={!settings.platforms.instagram.enabled}
                  >
                    Connect Instagram Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Post Content Settings</CardTitle>
              <CardDescription>Customize how your social media posts will appear</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="post-message" className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Message Template
                  </Label>
                  <div className="text-xs text-muted-foreground">
                    Available variables: {'{date}'}, {'{time}'}, {'{reason}'}
                  </div>
                </div>
                <Textarea
                  id="post-message"
                  placeholder="Type your post message template here..."
                  value={settings.postSettings.message}
                  onChange={(e) => setSettings({
                    ...settings,
                    postSettings: {
                      ...settings.postSettings,
                      message: e.target.value
                    }
                  })}
                  className="min-h-20"
                />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    Hashtags
                  </Label>
                </div>
                
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a hashtag (without #)"
                    value={hashtagInput}
                    onChange={(e) => setHashtagInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addHashtag();
                      }
                    }}
                  />
                  <Button variant="outline" onClick={addHashtag}>Add</Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {settings.postSettings.hashtags.map((hashtag, index) => (
                    <div 
                      key={index} 
                      className="flex items-center gap-1 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
                    >
                      #{hashtag}
                      <button 
                        onClick={() => removeHashtag(index)}
                        className="text-xs hover:text-destructive ml-1"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {settings.postSettings.hashtags.length === 0 && (
                    <p className="text-sm text-muted-foreground">No hashtags added yet</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="options">
          <Card>
            <CardHeader>
              <CardTitle>Posting Options</CardTitle>
              <CardDescription>Configure how alert posts are handled</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Image className="h-4 w-4" />
                    <Label htmlFor="include-image">Include Alert Image</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Generate and attach an image of the alert to social media posts
                  </p>
                </div>
                <Switch
                  id="include-image"
                  checked={settings.postSettings.includeImage}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    postSettings: {
                      ...settings.postSettings,
                      includeImage: checked
                    }
                  })}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-post">Automatic Posting</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically post to social media when a new alert is created
                  </p>
                </div>
                <Switch
                  id="auto-post"
                  checked={settings.postSettings.autoPost}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    postSettings: {
                      ...settings.postSettings,
                      autoPost: checked
                    }
                  })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />
    </div>
  );
};

export default SocialMediaSettings;
