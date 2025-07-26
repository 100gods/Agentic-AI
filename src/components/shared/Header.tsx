import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

type HeaderProps = {
  title: string;
};

export default function Header({ title }: HeaderProps) {
  return (
    <header className="flex items-center gap-4 mb-8">
      <Button asChild variant="outline" size="icon">
        <Link href="/">
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back to Home</span>
        </Link>
      </Button>
      <h1 className="font-headline text-3xl font-bold text-primary">{title}</h1>
    </header>
  );
}
