
'use client';

import Header from '@/components/shared/Header';
import FinancialAdviceForm from './FinancialAdviceForm';
import { useContext } from 'react';
import { LanguageContext } from '@/context/LanguageContext';

export default function FinancialAdvicePage() {
  const { t } = useContext(LanguageContext);
  return (
    <main className="container mx-auto max-w-3xl py-8 px-4">
      <Header title={t('FinancialAdvice')} />
      <p className="mb-6 text-muted-foreground">
        {t('financialAdviceDesc')}
      </p>
      <FinancialAdviceForm />
    </main>
  );
}
