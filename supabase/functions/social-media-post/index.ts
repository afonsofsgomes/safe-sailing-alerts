
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import html2canvas from 'https://esm.sh/html2canvas@1.4.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

console.log("Loading social-media-post function...")

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get Supabase client with env vars
    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string
    const facebookApiKey = Deno.env.get('FACEBOOK_API_KEY')
    const instagramApiKey = Deno.env.get('INSTAGRAM_API_KEY')
    
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Parse request body
    const { disruptionId, platforms, postSettings } = await req.json()
    
    if (!disruptionId) {
      return new Response(
        JSON.stringify({ error: 'Missing disruption ID' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }
    
    console.log(`Processing social media post for disruption ID: ${disruptionId}`)
    
    // Get disruption data
    const { data: disruption, error: disruptionError } = await supabase
      .from('disruptions')
      .select('*')
      .eq('id', disruptionId)
      .single()
      
    if (disruptionError) {
      console.error('Error fetching disruption:', disruptionError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch disruption data', details: disruptionError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }
    
    // Get widget settings for styling
    const { data: widgetSettings, error: settingsError } = await supabase
      .from('widget_settings')
      .select('*')
      .limit(1)
      .single()
      
    if (settingsError && settingsError.code !== 'PGRST116') {
      console.error('Error fetching widget settings:', settingsError)
    }
    
    // Format disruption date
    const disruptionDate = new Date(disruption.date)
    const formattedDate = disruptionDate.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    })
    
    // Format time if applicable
    let timeInfo = ''
    if (!disruption.is_full_day && disruption.start_time) {
      timeInfo = disruption.end_time 
        ? `${disruption.start_time} - ${disruption.end_time}` 
        : `From ${disruption.start_time}`
    } else if (disruption.is_full_day) {
      timeInfo = 'All Day'
    }
    
    // Prepare message with template variables replaced
    let message = postSettings.message || "Alert: Our services will be disrupted due to weather conditions."
    message = message.replace('{date}', formattedDate)
    message = message.replace('{time}', timeInfo)
    message = message.replace('{reason}', disruption.reason)
    
    // Add hashtags if configured
    if (postSettings.hashtags && postSettings.hashtags.length > 0) {
      message += '\n\n' + postSettings.hashtags.map(tag => `#${tag}`).join(' ')
    }
    
    // Results tracking
    const results = {
      facebook: { success: false, message: 'Not attempted' },
      instagram: { success: false, message: 'Not attempted' },
    }
    
    // Facebook posting
    if (platforms.facebook?.enabled && platforms.facebook?.pageId) {
      try {
        if (!facebookApiKey) {
          results.facebook.message = 'Facebook API key not configured'
        } else {
          console.log(`Posting to Facebook page: ${platforms.facebook.pageId}`)
          
          // In a real implementation, we would use the Facebook Graph API here
          // This is a placeholder for demonstration
          const facebookPost = {
            message: message,
            // In a real implementation, we would generate and attach an image here
            // access_token: facebookApiKey, 
            // page_id: platforms.facebook.pageId
          }
          
          console.log('Facebook post data:', facebookPost)
          
          // Simulate successful API call
          results.facebook.success = true
          results.facebook.message = 'Post created successfully (simulated)'
          
          // In a production environment, we'd make the actual API call:
          /*
          const response = await fetch(
            `https://graph.facebook.com/v18.0/${platforms.facebook.pageId}/feed`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                message: message,
                access_token: facebookApiKey,
              }),
            }
          )
          const data = await response.json()
          results.facebook = { 
            success: !!data.id, 
            message: data.id ? 'Post created successfully' : 'Failed to create post' 
          }
          */
        }
      } catch (error) {
        console.error('Error posting to Facebook:', error)
        results.facebook.message = error.message || 'Error posting to Facebook'
      }
    }
    
    // Instagram posting
    if (platforms.instagram?.enabled && platforms.instagram?.accountId) {
      try {
        if (!instagramApiKey) {
          results.instagram.message = 'Instagram API key not configured'
        } else {
          console.log(`Posting to Instagram account: ${platforms.instagram.accountId}`)
          
          // In a real implementation, we would use the Instagram Graph API here
          // This is a placeholder for demonstration
          const instagramPost = {
            caption: message,
            // In a real implementation, we would generate and attach an image here
            // access_token: instagramApiKey, 
            // account_id: platforms.instagram.accountId
          }
          
          console.log('Instagram post data:', instagramPost)
          
          // Simulate successful API call
          results.instagram.success = true
          results.instagram.message = 'Post created successfully (simulated)'
          
          // In a production environment, we'd make the actual API call
        }
      } catch (error) {
        console.error('Error posting to Instagram:', error)
        results.instagram.message = error.message || 'Error posting to Instagram'
      }
    }
    
    console.log('Social media posting results:', results)
    
    return new Response(
      JSON.stringify({ success: true, results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
    
  } catch (error) {
    console.error('Error in social-media-post function:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'An unexpected error occurred' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
