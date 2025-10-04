import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Orbit } from "lucide-react";

interface OrbitalData {
  object_name: string;
  orbital_elements: Record<string, any>;
  physical_parameters: Record<string, any>;
  orbit_class: Record<string, any>;
}

export const OrbitalDataCard = ({ data }: { data: OrbitalData | null }) => {
  if (!data) return null;

  const elements = data.orbital_elements || {};
  const keyElements = [
    { label: "Eccentricity", value: elements.e, unit: "" },
    { label: "Semi-major Axis", value: elements.a, unit: " AU" },
    { label: "Inclination", value: elements.i, unit: "°" },
    { label: "Perihelion Distance", value: elements.q, unit: " AU" },
  ];

  return (
    <Card className="bg-card/50 backdrop-blur border-secondary/20 hover:border-secondary/40 transition-all duration-300 hover:shadow-[var(--glow-purple)]">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2 text-secondary">
          <Orbit className="w-6 h-6" />
          Orbital Elements
        </CardTitle>
        <p className="text-sm text-muted-foreground">{data.object_name}</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {keyElements.map((element, index) => (
            <div key={index} className="space-y-1">
              <p className="text-xs text-muted-foreground">{element.label}</p>
              <p className="text-lg font-bold text-foreground">
                {element.value !== undefined && element.value !== null
                  ? `${parseFloat(element.value).toFixed(6)}${element.unit}`
                  : "N/A"}
              </p>
            </div>
          ))}
        </div>
        {data.orbit_class?.name && (
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground">Orbit Class</p>
            <p className="text-sm font-semibold text-secondary">
              {data.orbit_class.name}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
