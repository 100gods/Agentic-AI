import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Leaf, CloudSun, MessageSquare, Landmark, BookOpen, Droplets, Briefcase, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import Orchestrator from './Orchestrator';


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
  const { icon, ...rest } = feature;
  acc[feature.title] = rest;
  return acc;
}, {} as Record<string, { title: string; description: string; href: string; }>);


export default function Home() {
  return (
    <div className="relative min-h-screen">
      <header className="absolute top-0 right-0 p-4">
        <Button asChild>
          <Link href="/profile">
            <User className="mr-2" /> Login / Create Profile
          </Link>
        </Button>
      </header>
      <main className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 md:p-8">
        <div className="text-center mb-12">
          <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold text-primary">AgriAssist AI</h1>
          <p className="mt-4 text-lg sm:text-xl text-foreground/80">Your intelligent partner in farming</p>
        </div>
        
        <Orchestrator agentToFeatureMap={agentToFeatureMap} />

      </main>
    </div>
  );
}
