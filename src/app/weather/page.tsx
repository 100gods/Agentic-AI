import Header from '@/components/shared/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Cloud, Sun, CloudRain, Wind } from 'lucide-react';

export default function WeatherPage() {
  return (
    <main className="container mx-auto max-w-4xl py-8 px-4">
      <Header title="Weather Reports" />
      <Card>
        <CardHeader>
          <CardTitle>Current Weather: New Delhi</CardTitle>
          <CardDescription>Last updated: Just now</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-lg">
            <Sun className="h-12 w-12 text-yellow-500" />
            <div>
              <p className="text-4xl font-bold">34°C</p>
              <p className="text-muted-foreground">Clear Skies</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Wind className="h-5 w-5 text-muted-foreground" />
              <span>Wind: 12 km/h</span>
            </div>
            <div className="flex items-center gap-2">
              <CloudRain className="h-5 w-5 text-muted-foreground" />
              <span>Humidity: 45%</span>
            </div>
             <div className="flex items-center gap-2">
              <Cloud className="h-5 w-5 text-muted-foreground" />
              <span>Precipitation: 5%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <h2 className="font-headline text-2xl font-bold text-primary mt-10 mb-4">Crop-Specific Forecast</h2>
      <Card>
        <CardHeader>
            <CardTitle>Advisory for Wheat Crops</CardTitle>
            <CardDescription>Next 7 Days</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-destructive font-medium mb-4">Warning: High temperatures expected. Risk of heat stress.</p>
            <ul className="list-disc list-inside space-y-2 text-foreground/90">
                <li>Ensure adequate irrigation, especially during the afternoon.</li>
                <li>Monitor for signs of wilting or leaf curling.</li>
                <li>Postpone pesticide spraying to cooler parts of the day to avoid leaf burn.</li>
                <li>No significant rainfall expected; plan irrigation schedules accordingly.</li>
            </ul>
        </CardContent>
      </Card>
    </main>
  );
}
