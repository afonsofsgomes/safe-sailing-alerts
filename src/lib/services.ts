import { supabase } from '@/integrations/supabase/client';
import { Disruption, WidgetSettings } from './types';

// Disruption Services
export const fetchDisruptions = async (): Promise<Disruption[]> => {
  const { data, error } = await supabase
    .from('disruptions')
    .select('*')
    .order('date', { ascending: true });

  if (error) throw error;

  return data.map(item => ({
    id: item.id,
    date: new Date(item.date),
    startTime: item.start_time || undefined,
    endTime: item.end_time || undefined,
    reason: item.reason,
    isFullDay: item.is_full_day,
    createdAt: new Date(item.created_at),
    refundProvided: item.refund_provided || false,
    refundAmount: item.refund_amount || 0,
    createdByEmail: undefined
  }));
};

export const createDisruption = async (disruption: Omit<Disruption, 'id' | 'createdAt' | 'createdByEmail'>): Promise<Disruption> => {
  // Get the current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('disruptions')
    .insert({
      user_id: user.id,
      date: disruption.date.toISOString().split('T')[0],
      start_time: disruption.startTime,
      end_time: disruption.endTime,
      reason: disruption.reason,
      is_full_day: disruption.isFullDay,
      refund_provided: disruption.refundProvided,
      refund_amount: disruption.refundProvided ? disruption.refundAmount : null
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    date: new Date(data.date),
    startTime: data.start_time || undefined,
    endTime: data.end_time || undefined,
    reason: data.reason,
    isFullDay: data.is_full_day,
    createdAt: new Date(data.created_at),
    refundProvided: data.refund_provided || false,
    refundAmount: data.refund_amount || 0,
    createdByEmail: undefined
  };
};

export const updateDisruption = async (id: string, disruption: Partial<Disruption>): Promise<void> => {
  const updates: any = {};
  
  if (disruption.date) updates.date = disruption.date.toISOString().split('T')[0];
  if (disruption.startTime !== undefined) updates.start_time = disruption.startTime;
  if (disruption.endTime !== undefined) updates.end_time = disruption.endTime;
  if (disruption.reason !== undefined) updates.reason = disruption.reason;
  if (disruption.isFullDay !== undefined) updates.is_full_day = disruption.isFullDay;
  if (disruption.refundProvided !== undefined) updates.refund_provided = disruption.refundProvided;
  if (disruption.refundAmount !== undefined) updates.refund_amount = disruption.refundAmount;

  const { error } = await supabase
    .from('disruptions')
    .update(updates)
    .eq('id', id);

  if (error) throw error;
};

export const deleteDisruption = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('disruptions')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// Widget Settings Services
export const fetchWidgetSettings = async (): Promise<WidgetSettings | null> => {
  const { data, error } = await supabase
    .from('widget_settings')
    .select('*')
    .limit(1)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // No rows returned
    throw error;
  }

  return {
    title: data.title,
    description: data.description,
    primaryColor: data.primary_color,
    accentColor: data.accent_color,
    showDates: data.show_dates,
    showTimes: data.show_times,
    showIcon: data.show_icon,
    animation: data.animation as 'none' | 'fade' | 'slide' | 'wave',
    borderRadius: data.border_radius as 'none' | 'small' | 'medium' | 'large' | 'pill',
    shadow: data.shadow as 'none' | 'small' | 'medium' | 'large',
    fontStyle: data.font_style as 'default' | 'serif' | 'mono',
    layout: data.layout as 'standard' | 'compact' | 'minimal',
    borderWidth: data.border_width as 'none' | 'thin' | 'medium' | 'thick'
  };
};

export const updateWidgetSettings = async (settings: Partial<WidgetSettings>): Promise<void> => {
  // Get the current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('User not authenticated');

  const updates: any = {};
  
  if (settings.title !== undefined) updates.title = settings.title;
  if (settings.description !== undefined) updates.description = settings.description;
  if (settings.primaryColor !== undefined) updates.primary_color = settings.primaryColor;
  if (settings.accentColor !== undefined) updates.accent_color = settings.accentColor;
  if (settings.showDates !== undefined) updates.show_dates = settings.showDates;
  if (settings.showTimes !== undefined) updates.show_times = settings.showTimes;
  if (settings.showIcon !== undefined) updates.show_icon = settings.showIcon;
  if (settings.animation !== undefined) updates.animation = settings.animation;
  if (settings.borderRadius !== undefined) updates.border_radius = settings.borderRadius;
  if (settings.shadow !== undefined) updates.shadow = settings.shadow;
  if (settings.fontStyle !== undefined) updates.font_style = settings.fontStyle;
  if (settings.layout !== undefined) updates.layout = settings.layout;
  if (settings.borderWidth !== undefined) updates.border_width = settings.borderWidth;

  // Get all widget settings
  const { data } = await supabase
    .from('widget_settings')
    .select('*');
  
  if (!data || data.length === 0) {
    // If no settings exist, insert new one
    const { error: insertError } = await supabase
      .from('widget_settings')
      .insert({
        ...updates,
        user_id: user.id
      });
    
    if (insertError) throw insertError;
  } else {
    // Update settings row by ID to ensure we have a proper WHERE clause
    const settingId = data[0].id;
    const { error: updateError } = await supabase
      .from('widget_settings')
      .update(updates)
      .eq('id', settingId);
    
    if (updateError) throw updateError;
  }
};
