
'use client';

import Header from '@/components/shared/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { useContext } from 'react';
import { LanguageContext } from '@/context/LanguageContext';

export default function TrainingPage() {
  const { t } = useContext(LanguageContext);

  const trainingOpportunities = [
    {
      title: 'Advanced Organic Farming Techniques',
      provider: 'National Centre of Organic Farming',
      level: t('advanced'),
      mode: 'Online',
      imageUrl: 'https://placehold.co/600x400',
      dataAiHint: 'organic farming'
    },
    {
      title: 'Workshop on Soil Health Management',
      provider: 'Indian Agricultural Research Institute',
      level: t('intermediate'),
      mode: 'In-Person',
      imageUrl: 'https://placehold.co/600x400',
      dataAiHint: 'soil health'
    },
    {
      title: 'Introduction to Greenhouse Cultivation',
      provider: 'State Horticulture Mission',
      level: t('beginner'),
      mode: 'Online',
      imageUrl: 'https://placehold.co/600x400',
      dataAiHint: 'greenhouse cultivation'
    },
  ];

  return (
    <main className="container mx-auto max-w-4xl py-8 px-4">
      <Header title={t('FarmersTraining')} />
      <p className="mb-6 text-muted-foreground">
        {t('trainingDesc')}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {trainingOpportunities.map((training, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="relative h-40 w-full">
              <Image src={training.imageUrl} alt={training.title} layout="fill" objectFit="cover" data-ai-hint={training.dataAiHint} />
            </div>
            <CardHeader>
              <CardTitle>{training.title}</CardTitle>
              <CardDescription>{training.provider}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Badge variant="secondary">{training.level}</Badge>
                <Badge variant="secondary">{training.mode}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
