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
    const startDate = url.searchParams.get('start_date') || '2020-01-01';
    const minMagnitude = url.searchParams.get('min_magnitude') || '6';
    
    console.log(`Fetching earthquake data from ${startDate} with min magnitude ${minMagnitude}`);
    
    const earthquakeUrl = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${startDate}&minmagnitude=${minMagnitude}`;
    const response = await fetch(earthquakeUrl);
    
    if (!response.ok) {
      throw new Error(`USGS API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Transform earthquake data
    const transformedData = (data.features || []).slice(0, 50).map((feature: any) => ({
      id: feature.id,
      magnitude: feature.properties?.mag || 0,
      place: feature.properties?.place || 'Unknown',
      time: new Date(feature.properties?.time).toISOString(),
      coordinates: feature.geometry?.coordinates || [0, 0, 0],
      depth: feature.geometry?.coordinates?.[2] || 0,
      type: feature.properties?.type || 'earthquake'
    }));
    
    console.log(`Successfully fetched ${transformedData.length} earthquake records`);
    
    return new Response(JSON.stringify({ 
      success: true, 
      data: transformedData,
      total_count: data.metadata?.count || 0
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching earthquake data:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
