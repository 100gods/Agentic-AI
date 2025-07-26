
'use client';

import Header from '@/components/shared/Header';
import CropDiagnosisForm from './CropDiagnosisForm';
import { useContext } from 'react';
import { LanguageContext } from '@/context/LanguageContext';

export default function CropDiagnosisPage() {
  const { t } = useContext(LanguageContext);
  return (
    <main className="container mx-auto max-w-3xl py-8 px-4">
      <Header title={t('CropDiagnosis')} />
      <p className="mb-6 text-muted-foreground">
        {t('cropDiagnosisDesc')}
      </p>
      <CropDiagnosisForm />
    </main>
  );
}
