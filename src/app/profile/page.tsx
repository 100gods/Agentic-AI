
'use client';
import Header from '@/components/shared/Header';
import ProfileForm from './ProfileForm';
import { useContext } from 'react';
import { LanguageContext } from '@/context/LanguageContext';

export default function ProfilePage() {
  const { t } = useContext(LanguageContext);
  return (
    <main className="container mx-auto max-w-3xl py-8 px-4">
      <Header title={t('yourProfile')} hideLogin={true} />
      <p className="mb-6 text-muted-foreground">
        {t('profileDesc')}
      </p>
      <ProfileForm />
    </main>
  );
}
