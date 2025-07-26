import Header from '@/components/shared/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Droplets, Thermometer, Wind, Sprout } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function CropManagementPage() {
  return (
    <main className="container mx-auto max-w-4xl py-8 px-4">
      <Header title="Crop Management" />
      <p className="mb-6 text-muted-foreground">
        Live data from your soil sensors and personalized crop recommendations.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Field A-1 Sensor Data</CardTitle>
          <CardDescription>Real-time soil and environment analysis.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Droplets className="h-5 w-5" />
                <span>Soil Moisture</span>
              </div>
              <span className="font-bold">65%</span>
            </div>
            <Progress value={65} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Thermometer className="h-5 w-5" />
                <span>Soil Temperature</span>
              </div>
              <span className="font-bold">28°C</span>
            </div>
            <Progress value={70} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Wind className="h-5 w-5" />
                <span>pH Level</span>
              </div>
              <span className="font-bold">6.8</span>
            </div>
            <Progress value={68} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Sprout className="h-5 w-5" />
                <span>Nitrogen (N)</span>
              </div>
              <span className="font-bold">Good</span>
            </div>
             <Progress value={80} />
          </div>
        </CardContent>
      </Card>
      
      <Separator className="my-8" />

      <Card>
          <CardHeader>
              <CardTitle>Recommendations</CardTitle>
              <CardDescription>Based on current data analysis.</CardDescription>
          </CardHeader>
          <CardContent>
              <ul className="list-disc list-inside space-y-3">
                  <li className="text-green-700 font-medium">
                      <span className="text-foreground">
                        <span className="font-semibold">Suitable Crops:</span> Maize and Soybeans are highly suitable for current conditions.
                      </span>
                  </li>
                  <li className="text-blue-700 font-medium">
                       <span className="text-foreground">
                        <span className="font-semibold">Watering Schedule:</span> Moisture levels are optimal. Next irrigation cycle recommended in 3 days.
                      </span>
                  </li>
                  <li className="text-yellow-700 font-medium">
                      <span className="text-foreground">
                        <span className="font-semibold">Fertilizer Alert:</span> Potassium levels are slightly low. Consider applying a potassium-rich fertilizer.
                      </span>
                  </li>
              </ul>
          </CardContent>
      </Card>
    </main>
  );
}
