
'use client';

import Header from '@/components/shared/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Cloud, Sun, CloudRain, Wind } from 'lucide-react';
import { useContext } from 'react';
import { LanguageContext } from '@/context/LanguageContext';

export default function WeatherPage() {
  const { t } = useContext(LanguageContext);
  return (
    <main className="container mx-auto max-w-4xl py-8 px-4">
      <Header title={t('WeatherReports')} />
      <Card>
        <CardHeader>
          <CardTitle>{t('currentWeather')}: New Delhi</CardTitle>
          <CardDescription>{t('lastUpdated')}: {t('justNow')}</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-lg">
            <Sun className="h-12 w-12 text-yellow-500" />
            <div>
              <p className="text-4xl font-bold">34°C</p>
              <p className="text-muted-foreground">{t('clearSkies')}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Wind className="h-5 w-5 text-muted-foreground" />
              <span>{t('wind')}: 12 km/h</span>
            </div>
            <div className="flex items-center gap-2">
              <CloudRain className="h-5 w-5 text-muted-foreground" />
              <span>{t('humidity')}: 45%</span>
            </div>
             <div className="flex items-center gap-2">
              <Cloud className="h-5 w-5 text-muted-foreground" />
              <span>{t('precipitation')}: 5%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <h2 className="font-headline text-2xl font-bold text-primary mt-10 mb-4">{t('cropSpecificForecast')}</h2>
      <Card>
        <CardHeader>
            <CardTitle>{t('advisoryForWheat')}</CardTitle>
            <CardDescription>{t('next7Days')}</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-destructive font-medium mb-4">{t('warning')}: {t('heatStressRisk')}</p>
            <ul className="list-disc list-inside space-y-2 text-foreground/90">
                <li>{t('advisory1')}</li>
                <li>{t('advisory2')}</li>
                <li>{t('advisory3')}</li>
                <li>{t('advisory4')}</li>
            </ul>
        </CardContent>
      </Card>
    </main>
  );
}
