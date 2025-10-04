import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const query = url.searchParams.get('query') || '2025';
    
    console.log(`Fetching orbital data for: ${query}`);
    
    const orbitalUrl = `https://ssd-api.jpl.nasa.gov/sbdb.api?sstr=${query}&full-prec=true`;
    const response = await fetch(orbitalUrl);
    
    if (!response.ok) {
      throw new Error(`JPL API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Extract key orbital elements
    const orbitalElements = data?.orbit?.elements || {};
    
    console.log('Successfully fetched orbital data');
    
    return new Response(JSON.stringify({ 
      success: true, 
      data: {
        object_name: data?.object?.fullname || data?.object?.des || query,
        orbital_elements: orbitalElements,
        physical_parameters: data?.phys_par || {},
        orbit_class: data?.orbit?.orbit_class || {}
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching orbital data:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
