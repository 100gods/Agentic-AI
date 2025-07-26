
'use client';

import Header from '@/components/shared/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Droplets, Thermometer, Wind, Sprout } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useContext } from 'react';
import { LanguageContext } from '@/context/LanguageContext';

export default function CropManagementPage() {
  const { t } = useContext(LanguageContext);
  return (
    <main className="container mx-auto max-w-4xl py-8 px-4">
      <Header title={t('CropManagement')} />
      <p className="mb-6 text-muted-foreground">
        {t('cropManagementDesc')}
      </p>

      <Card>
        <CardHeader>
          <CardTitle>{t('fieldSensorData')}</CardTitle>
          <CardDescription>{t('realTimeAnalysis')}</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Droplets className="h-5 w-5" />
                <span>{t('soilMoisture')}</span>
              </div>
              <span className="font-bold">65%</span>
            </div>
            <Progress value={65} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Thermometer className="h-5 w-5" />
                <span>{t('soilTemperature')}</span>
              </div>
              <span className="font-bold">28°C</span>
            </div>
            <Progress value={70} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Wind className="h-5 w-5" />
                <span>{t('phLevel')}</span>
              </div>
              <span className="font-bold">6.8</span>
            </div>
            <Progress value={68} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Sprout className="h-5 w-5" />
                <span>{t('nitrogen')} (N)</span>
              </div>
              <span className="font-bold">{t('good')}</span>
            </div>
             <Progress value={80} />
          </div>
        </CardContent>
      </Card>
      
      <Separator className="my-8" />

      <Card>
          <CardHeader>
              <CardTitle>{t('recommendations')}</CardTitle>
              <CardDescription>{t('basedOnAnalysis')}</CardDescription>
          </CardHeader>
          <CardContent>
              <ul className="list-disc list-inside space-y-3">
                  <li className="text-green-700 font-medium">
                      <span className="text-foreground">
                        <span className="font-semibold">{t('suitableCrops')}:</span> {t('suitableCropsDesc')}
                      </span>
                  </li>
                  <li className="text-blue-700 font-medium">
                       <span className="text-foreground">
                        <span className="font-semibold">{t('wateringSchedule')}:</span> {t('wateringScheduleDesc')}
                      </span>
                  </li>
                  <li className="text-yellow-700 font-medium">
                      <span className="text-foreground">
                        <span className="font-semibold">{t('fertilizerAlert')}:</span> {t('fertilizerAlertDesc')}
                      </span>
                  </li>
              </ul>
          </CardContent>
      </Card>
    </main>
  );
}
