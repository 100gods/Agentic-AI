
'use client';

import Header from '@/components/shared/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useContext } from 'react';
import { LanguageContext } from '@/context/LanguageContext';

export default function SchemesPage() {
  const { t } = useContext(LanguageContext);
  const schemes = [
    {
      title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
      description: 'An insurance service for farmers for their yields. It covers losses due to natural calamities, pests, and diseases.',
      eligibility: 'All farmers including sharecroppers and tenant farmers growing notified crops in the notified areas are eligible for coverage.',
    },
    {
      title: 'Kisan Credit Card (KCC) Scheme',
      description: 'Provides farmers with timely access to credit for their cultivation needs as well as for non-farm activities.',
      eligibility: 'Farmers, who are owner cultivators, are eligible. Tenant farmers, oral lessees, and sharecroppers are also eligible.',
    },
    {
      title: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
      description: 'A central sector scheme with 100% funding from the Government of India. It provides income support of Rs. 6,000 per year to all landholding farmer families.',
      eligibility: 'All landholding farmer families with cultivable landholding.',
    },
  ];

  return (
    <main className="container mx-auto max-w-4xl py-8 px-4">
      <Header title={t('GovernmentSchemes')} />
      <p className="mb-6 text-muted-foreground">
        {t('schemesDesc')}
      </p>

      <div className="space-y-6">
        {schemes.map((scheme, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{scheme.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{scheme.description}</p>
              <h4 className="font-semibold mb-2">{t('eligibility')}:</h4>
              <p className="text-muted-foreground mb-4">{scheme.eligibility}</p>
              <Button variant="outline">{t('learnMore')}</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
