
'use client';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import { useContext } from 'react';
import { LanguageContext } from '@/context/LanguageContext';

type HeaderProps = {
  title: string;
  hideLogin?: boolean;
};

export default function Header({ title, hideLogin = false }: HeaderProps) {
  const { t } = useContext(LanguageContext);
  return (
    <header className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">{t('backToHome')}</span>
          </Link>
        </Button>
        <h1 className="font-headline text-3xl font-bold text-primary">{title}</h1>
      </div>
      {!hideLogin && (
         <Button asChild variant="outline">
           <Link href="/profile">
             <User className="mr-2 h-4 w-4" /> {t('login')}
           </Link>
         </Button>
      )}
    </header>
  );
}
