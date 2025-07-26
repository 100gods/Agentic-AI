import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Leaf, CloudSun, MessageSquare, Landmark, BookOpen, Droplets, Briefcase, BarChart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import Orchestrator from './Orchestrator';
import { Separator } from '@/components/ui/separator';


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


export default function Home() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-background to-muted/50">
      <header className="absolute top-0 right-0 p-4 z-10">
        <Button asChild>
          <Link href="/profile">
            <User className="mr-2" /> Login / Create Profile
          </Link>
        </Button>
      </header>
      <main className="flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 pt-24">
        <div className="text-center mb-12">
          <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold text-primary">AgriAssist AI</h1>
          <p className="mt-4 text-lg sm:text-xl text-foreground/80">Your intelligent partner in farming</p>
        </div>
        
        <Orchestrator agentToFeatureMap={agentToFeatureMap} />

        <div className="mt-20 w-full max-w-6xl">
            <div className="relative">
                <Separator />
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center">
                    <span className="bg-background px-4 text-lg font-medium text-muted-foreground">
                    Or explore features manually
                    </span>
                </div>
            </div>
          
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Link href={feature.href} key={feature.title} className="group flex">
                <Card className="h-full w-full hover:border-primary hover:shadow-lg transition-all duration-200 flex flex-col">
                  <CardHeader className="flex-grow">
                    <feature.icon className="h-8 w-8 text-primary mb-4" />
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <div className="p-6 pt-0 mt-auto">
                    <div className="text-sm font-semibold text-primary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Go to feature <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
