
'use client';

import { useState, useContext } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Leaf, CloudSun, MessageSquare, Landmark, BookOpen, Droplets, Briefcase, BarChart, ArrowRight, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import Orchestrator from './Orchestrator';
import { Separator } from '@/components/ui/separator';
import Alerts from '@/components/shared/Alerts';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { LanguageContext, Language, languageOptions } from '@/context/LanguageContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


export default function Home() {
  const { t, language, setLanguage } = useContext(LanguageContext);

  const features = [
    {
      title: 'Crop Diagnosis',
      description: 'Identify crop issues with a photo.',
      href: '/crop-diagnosis',
      icon: Leaf,
    },
    {
      title: 'Weather Reports',
      description: 'Get local weather and forecasts.',
      href: '/weather',
      icon: CloudSun,
    },
    {
      title: 'Discussion Forums',
      description: 'Connect with other farmers.',
      href: '/forums',
      icon: MessageSquare,
    },
    {
      title: 'Government Schemes',
      description: 'Find relevant government support.',
      href: '/schemes',
      icon: Landmark,
    },
    {
      title: "Farmer's Training",
      description: 'Access learning materials.',
      href: '/training',
      icon: BookOpen,
    },
    {
      title: 'Crop Management',
      description: 'Analyze soil data and schedules.',
      href: '/crop-management',
      icon: Droplets,
    },
    {
      title: 'Financial Advice',
      description: 'Get investment and loan advice.',
      href: '/financial-advice',
      icon: Briefcase,
    },
    {
      title: 'Market Prices',
      description: 'View current crop market prices.',
      href: '/market-prices',
      icon: BarChart,
    },
  ];
  
  const agentToFeatureMap: Record<string, { title: string; description: string; href: string; }> = features.reduce((acc, feature) => {
    acc[feature.title] = { title: feature.title, description: feature.description, href: feature.href };
    return acc;
  }, {} as Record<string, { title: string; description: string; href: string; }>);
  
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-background to-muted/50">
      <header className="absolute top-0 left-0 right-0 p-4 z-10 flex justify-between items-center">
        <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                    <Bell />
                    <span className="sr-only">{t('openAlerts')}</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>{t('alertsAndReminders')}</SheetTitle>
                </SheetHeader>
                <Alerts />
              </SheetContent>
            </Sheet>
            <div className="hidden md:block">
              <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
                  <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                      {languageOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                      ))}
                  </SelectContent>
              </Select>
            </div>
        </div>
        <Button asChild>
          <Link href="/profile">
            <User className="mr-2" /> {t('loginCreateProfile')}
          </Link>
        </Button>
      </header>
      
      <div className="flex">
        <main className="flex-1 flex flex-col items-center p-4 sm:p-6 md:p-8 pt-24">
          <div className="text-center mb-12">
            <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold text-primary">Pratham Kishan</h1>
            <p className="mt-4 text-lg sm:text-xl text-foreground/80">{t('intelligentPartner')}</p>
          </div>
          
          <Orchestrator agentToFeatureMap={agentToFeatureMap} />

          <div className="mt-20 w-full max-w-6xl">
              <div className="relative">
                  <Separator />
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center">
                      <span className="bg-gradient-to-b from-background to-muted/50 px-4 text-lg font-medium text-muted-foreground">
                      {t('orExploreFeatures')}
                      </span>
                  </div>
              </div>
            
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {features.map((feature) => (
                <Link href={feature.href} key={feature.title} className="group flex">
                  <Card className="h-full w-full hover:border-primary hover:shadow-lg transition-all duration-200 flex flex-col">
                    <CardHeader className="flex-grow">
                      <feature.icon className="h-8 w-8 text-primary mb-4" />
                      <CardTitle>{t(feature.title.replace(/ /g, ''))}</CardTitle>
                      <CardDescription>{t(feature.title.replace(/ /g, '') + 'Desc')}</CardDescription>
                    </CardHeader>
                    <div className="p-6 pt-0 mt-auto">
                      <div className="text-sm font-semibold text-primary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {t('goToFeature')} <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

        </main>
        
        <aside className="hidden md:block w-80 lg:w-96 p-4 pt-24 border-l border-border">
          <div className="sticky top-24">
            <h2 className="font-headline text-2xl font-bold text-primary mb-4">{t('alertsAndReminders')}</h2>
            <Alerts />
          </div>
        </aside>

      </div>
    </div>
  );
}
