
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { WidgetSettings } from '@/lib/types';

interface ThemeOption {
  name: string;
  preview: React.ReactNode;
  settings: Partial<WidgetSettings>;
}

export const WidgetThemes = () => {
  const updateWidgetSettings = useAppStore((state) => state.updateWidgetSettings);

  const themes: ThemeOption[] = [
    {
      name: "Ocean Blue",
      preview: (
        <div className="h-12 rounded-md bg-gradient-to-r from-blue-500 to-cyan-400 border border-blue-300"></div>
      ),
      settings: {
        primaryColor: '#0EA5E9',
        accentColor: '#06B6D4',
        borderRadius: 'medium',
        shadow: 'medium',
        animation: 'wave',
      }
    },
    {
      name: "Sunset Orange",
      preview: (
        <div className="h-12 rounded-md bg-gradient-to-r from-orange-500 to-amber-400 border border-amber-300"></div>
      ),
      settings: {
        primaryColor: '#F97316',
        accentColor: '#F59E0B',
        borderRadius: 'pill',
        shadow: 'large',
        animation: 'slide',
      }
    },
    {
      name: "Forest Green",
      preview: (
        <div className="h-12 rounded-md bg-gradient-to-r from-green-600 to-emerald-500 border border-green-400"></div>
      ),
      settings: {
        primaryColor: '#16A34A',
        accentColor: '#10B981',
        borderRadius: 'small',
        shadow: 'small',
        animation: 'fade',
      }
    },
    {
      name: "Royal Purple",
      preview: (
        <div className="h-12 rounded-md bg-gradient-to-r from-purple-600 to-violet-500 border border-violet-400"></div>
      ),
      settings: {
        primaryColor: '#9333EA',
        accentColor: '#8B5CF6',
        borderRadius: 'large',
        shadow: 'medium',
        animation: 'fade',
      }
    },
    {
      name: "Sleek Black",
      preview: (
        <div className="h-12 rounded-md bg-gradient-to-r from-gray-800 to-gray-700 border border-gray-600"></div>
      ),
      settings: {
        primaryColor: '#1F2937',
        accentColor: '#D1D5DB',
        borderRadius: 'small',
        shadow: 'none',
        animation: 'none',
      }
    },
    {
      name: "Bold Red",
      preview: (
        <div className="h-12 rounded-md bg-gradient-to-r from-red-600 to-rose-500 border border-red-400"></div>
      ),
      settings: {
        primaryColor: '#DC2626',
        accentColor: '#F43F5E',
        borderRadius: 'medium',
        shadow: 'large',
        animation: 'slide',
      }
    },
  ];

  const applyTheme = (settings: Partial<WidgetSettings>) => {
    updateWidgetSettings(settings);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Quick Themes</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {themes.map((theme) => (
          <Card key={theme.name} className="p-3 hover:shadow-md transition-shadow cursor-pointer" onClick={() => applyTheme(theme.settings)}>
            {theme.preview}
            <p className="mt-2 text-sm font-medium text-center">{theme.name}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};
