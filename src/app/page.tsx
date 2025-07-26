import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Leaf, CloudSun, MessageSquare, Landmark, BookOpen, Droplets, Briefcase, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';

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

        <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <Link href={feature.href} key={feature.href} className="group">
              <Card className="h-full transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 hover:border-primary/50">
                <CardHeader className="flex flex-col items-center text-center">
                  <div className="p-4 bg-primary/10 rounded-full mb-4 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="font-headline text-xl">{feature.title}</CardTitle>
                  <CardDescription className="mt-2 text-sm">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
