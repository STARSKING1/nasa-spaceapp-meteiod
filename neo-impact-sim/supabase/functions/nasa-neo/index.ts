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
    const API_KEY = "7oKds9xyF5iQjQ2g7EjrAYovS3oatSVNTauN97pL";
    const url = new URL(req.url);
    const startDate = url.searchParams.get('start_date') || '2025-10-01';
    const endDate = url.searchParams.get('end_date') || '2025-10-07';
    
    console.log(`Fetching NEO data from ${startDate} to ${endDate}`);
    
    const neoUrl = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=${API_KEY}`;
    const response = await fetch(neoUrl);
    
    if (!response.ok) {
      throw new Error(`NASA API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Transform data for easier frontend consumption
    const transformedData = Object.entries(data.near_earth_objects || {}).flatMap(([date, neos]: [string, any]) => 
      neos.map((neo: any) => ({
        id: neo.id,
        name: neo.name,
        date,
        diameter_min: neo.estimated_diameter?.meters?.estimated_diameter_min || 0,
        diameter_max: neo.estimated_diameter?.meters?.estimated_diameter_max || 0,
        miss_distance_km: neo.close_approach_data?.[0]?.miss_distance?.kilometers || 0,
        velocity_kmh: neo.close_approach_data?.[0]?.relative_velocity?.kilometers_per_hour || 0,
        is_hazardous: neo.is_potentially_hazardous_asteroid,
        absolute_magnitude: neo.absolute_magnitude_h
      }))
    );
    
    console.log(`Successfully fetched ${transformedData.length} NEO objects`);
    
    return new Response(JSON.stringify({ 
      success: true, 
      data: transformedData,
      element_count: data.element_count 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching NEO data:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
