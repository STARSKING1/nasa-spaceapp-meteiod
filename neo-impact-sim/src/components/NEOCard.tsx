import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Circle } from "lucide-react";

interface NEOData {
  id: string;
  name: string;
  date: string;
  diameter_min: number;
  diameter_max: number;
  miss_distance_km: number;
  velocity_kmh: number;
  is_hazardous: boolean;
  absolute_magnitude: number;
}

export const NEOCard = ({ neo }: { neo: NEOData }) => {
  return (
    <Card className="bg-card/50 backdrop-blur border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-[var(--glow-cyan)]">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-bold text-primary">
            {neo.name}
          </CardTitle>
          {neo.is_hazardous && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              Hazardous
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground">Close Approach: {neo.date}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs">Diameter Range</p>
            <p className="font-semibold text-foreground">
              {neo.diameter_min.toFixed(0)} - {neo.diameter_max.toFixed(0)} m
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs">Miss Distance</p>
            <p className="font-semibold text-secondary">
              {Number(neo.miss_distance_km).toLocaleString()} km
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs">Velocity</p>
            <p className="font-semibold text-accent">
              {Number(neo.velocity_kmh).toLocaleString()} km/h
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs">Magnitude</p>
            <p className="font-semibold text-foreground flex items-center gap-1">
              <Circle className="w-2 h-2 fill-current" />
              {neo.absolute_magnitude.toFixed(2)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
