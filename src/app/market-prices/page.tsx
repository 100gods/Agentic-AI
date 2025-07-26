
'use client';
import Header from '@/components/shared/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { useContext } from 'react';
import { LanguageContext } from '@/context/LanguageContext';

const cropPrices = [
  { crop: 'Wheat', price: '₹2,125', change: '+2.5%', trend: 'up' },
  { crop: 'Rice (Basmati)', price: '₹3,500', change: '-1.2%', trend: 'down' },
  { crop: 'Maize', price: '₹1,900', change: '+5.0%', trend: 'up' },
  { crop: 'Cotton', price: '₹6,050', change: '+0.8%', trend: 'up' },
  { crop: 'Soybean', price: '₹4,300', change: '-3.1%', trend: 'down' },
  { crop: 'Sugarcane', price: '₹315', change: '+1.6%', trend: 'up' },
];

export default function MarketPricesPage() {
  const { t } = useContext(LanguageContext);
  return (
    <main className="container mx-auto max-w-4xl py-8 px-4">
      <Header title={t('MarketPrices')} />
      <p className="mb-6 text-muted-foreground">
        {t('marketPricesDesc')}
      </p>

      <Card>
        <CardHeader>
          <CardTitle>{t('cropPrices')}</CardTitle>
          <CardDescription>{t('allIndiaAverage')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('crop')}</TableHead>
                <TableHead className="text-right">{t('price')}</TableHead>
                <TableHead className="text-right">{t('change24h')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cropPrices.map((item) => (
                <TableRow key={item.crop}>
                  <TableCell className="font-medium">{item.crop}</TableCell>
                  <TableCell className="text-right font-bold">{item.price}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={item.trend === 'up' ? 'default' : 'destructive'} className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      {item.trend === 'up' ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
                      {item.change}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}
