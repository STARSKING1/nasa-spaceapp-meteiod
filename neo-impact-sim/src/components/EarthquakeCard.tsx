import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Waves } from "lucide-react";

interface EarthquakeData {
  id: string;
  magnitude: number;
  place: string;
  time: string;
  coordinates: number[];
  depth: number;
  type: string;
}

export const EarthquakeCard = ({ quake }: { quake: EarthquakeData }) => {
  const getMagnitudeColor = (mag: number) => {
    if (mag >= 7) return "destructive";
    if (mag >= 6) return "secondary";
    return "default";
  };

  return (
    <Card className="bg-card/50 backdrop-blur border-accent/20 hover:border-accent/40 transition-all duration-300 hover:shadow-[var(--glow-orange)]">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base font-bold text-accent flex items-center gap-2">
            <Waves className="w-4 h-4" />
            M {quake.magnitude.toFixed(1)}
          </CardTitle>
          <Badge variant={getMagnitudeColor(quake.magnitude)}>
            {quake.type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm font-medium text-foreground line-clamp-2">
          {quake.place}
        </p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <p className="text-muted-foreground">Depth</p>
            <p className="font-semibold text-foreground">{quake.depth.toFixed(1)} km</p>
          </div>
          <div>
            <p className="text-muted-foreground">Time</p>
            <p className="font-semibold text-foreground">
              {new Date(quake.time).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="text-xs">
          <p className="text-muted-foreground">Coordinates</p>
          <p className="font-mono text-[10px] text-foreground">
            {quake.coordinates[1].toFixed(3)}, {quake.coordinates[0].toFixed(3)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
