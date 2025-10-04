import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { NEOCard } from "@/components/NEOCard";
import { OrbitalDataCard } from "@/components/OrbitalDataCard";
import { EarthquakeCard } from "@/components/EarthquakeCard";
import { Button } from "@/components/ui/button";
import { Rocket, Satellite, Globe, Loader2, Waves } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [neoData, setNeoData] = useState<any[]>([]);
  const [orbitalData, setOrbitalData] = useState<any>(null);
  const [earthquakeData, setEarthquakeData] = useState<any[]>([]);
  const [loading, setLoading] = useState({
    neo: false,
    orbital: false,
    earthquake: false,
  });

  const fetchNEOData = async () => {
    setLoading(prev => ({ ...prev, neo: true }));
    try {
      const { data, error } = await supabase.functions.invoke('nasa-neo', {
        body: { start_date: '2025-10-01', end_date: '2025-10-07' }
      });
      
      if (error) throw error;
      
      if (data?.success) {
        setNeoData(data.data);
        toast.success(`Loaded ${data.data.length} Near Earth Objects`);
      } else {
        throw new Error(data?.error || 'Failed to fetch NEO data');
      }
    } catch (error: any) {
      console.error('Error fetching NEO data:', error);
      toast.error('Failed to load NEO data');
    } finally {
      setLoading(prev => ({ ...prev, neo: false }));
    }
  };

  const fetchOrbitalData = async () => {
    setLoading(prev => ({ ...prev, orbital: true }));
    try {
      const { data, error } = await supabase.functions.invoke('nasa-orbital', {
        body: { query: '2025' }
      });
      
      if (error) throw error;
      
      if (data?.success) {
        setOrbitalData(data.data);
        toast.success('Loaded orbital data');
      } else {
        throw new Error(data?.error || 'Failed to fetch orbital data');
      }
    } catch (error: any) {
      console.error('Error fetching orbital data:', error);
      toast.error('Failed to load orbital data');
    } finally {
      setLoading(prev => ({ ...prev, orbital: false }));
    }
  };

  const fetchEarthquakeData = async () => {
    setLoading(prev => ({ ...prev, earthquake: true }));
    try {
      const { data, error } = await supabase.functions.invoke('earthquake-data', {
        body: { start_date: '2020-01-01', min_magnitude: '6' }
      });
      
      if (error) throw error;
      
      if (data?.success) {
        setEarthquakeData(data.data);
        toast.success(`Loaded ${data.data.length} earthquake records`);
      } else {
        throw new Error(data?.error || 'Failed to fetch earthquake data');
      }
    } catch (error: any) {
      console.error('Error fetching earthquake data:', error);
      toast.error('Failed to load earthquake data');
    } finally {
      setLoading(prev => ({ ...prev, earthquake: false }));
    }
  };

  useEffect(() => {
    fetchNEOData();
    fetchOrbitalData();
    fetchEarthquakeData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-card">
      {/* Hero Section */}
      <header className="relative overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 animate-pulse"></div>
        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Rocket className="w-12 h-12 text-primary animate-bounce" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              NASA Data Explorer
            </h1>
          </div>
          <p className="text-center text-muted-foreground text-lg max-w-2xl mx-auto">
            Real-time visualization of Near Earth Objects, orbital trajectories, and seismic impact modeling
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-12">
        {/* Near Earth Objects Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Satellite className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-bold text-foreground">Near Earth Objects</h2>
            </div>
            <Button 
              onClick={fetchNEOData} 
              disabled={loading.neo}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {loading.neo ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                'Refresh Data'
              )}
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {neoData.slice(0, 9).map((neo) => (
              <NEOCard key={neo.id} neo={neo} />
            ))}
          </div>
          {neoData.length === 0 && !loading.neo && (
            <p className="text-center text-muted-foreground py-8">No NEO data available</p>
          )}
        </section>

        {/* Orbital Data Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Globe className="w-8 h-8 text-secondary" />
              <h2 className="text-3xl font-bold text-foreground">Orbital Trajectory Data</h2>
            </div>
            <Button 
              onClick={fetchOrbitalData} 
              disabled={loading.orbital}
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
            >
              {loading.orbital ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                'Refresh Data'
              )}
            </Button>
          </div>
          <OrbitalDataCard data={orbitalData} />
        </section>

        {/* Earthquake Impact Data Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Waves className="w-8 h-8 text-accent" />
              <h2 className="text-3xl font-bold text-foreground">Seismic Impact Modeling</h2>
            </div>
            <Button 
              onClick={fetchEarthquakeData} 
              disabled={loading.earthquake}
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              {loading.earthquake ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                'Refresh Data'
              )}
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {earthquakeData.slice(0, 8).map((quake) => (
              <EarthquakeCard key={quake.id} quake={quake} />
            ))}
          </div>
          {earthquakeData.length === 0 && !loading.earthquake && (
            <p className="text-center text-muted-foreground py-8">No earthquake data available</p>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>Data sources: NASA NEO API, JPL SBDB API, USGS Earthquake API</p>
          <p className="mt-2">Visualizing space data for asteroid impact modeling and trajectory analysis</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
