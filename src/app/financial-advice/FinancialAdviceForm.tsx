
'use client';

import { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Briefcase, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { getFinancialAdvice, type GetFinancialAdviceOutput } from '@/ai/flows/financial-advice';
import { LanguageContext } from '@/context/LanguageContext';

const formSchema = z.object({
  query: z.string().min(10, {
    message: 'Your question must be at least 10 characters.',
  }),
  location: z.string().optional(),
  experience: z.string().optional(),
  farmingType: z.string().optional(),
  landSize: z.string().optional(),
  investmentInterest: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

export default function FinancialAdviceForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GetFinancialAdviceOutput | null>(null);
  const { toast } = useToast();
  const { t } = useContext(LanguageContext);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: '',
      location: '',
      experience: '0-2 years',
      farmingType: 'Subsistence',
      landSize: 'Small (1-5 acres)',
      investmentInterest: false,
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setResult(null);

    try {
      const response = await getFinancialAdvice({
        query: values.query,
        profile: {
          location: values.location,
          experience: values.experience,
          farmingType: values.farmingType,
          landSize: values.landSize,
          investmentInterest: values.investmentInterest,
        },
      });
      setResult(response);
    } catch (error) {
      console.error('Advice generation failed:', error);
      toast({
        variant: 'destructive',
        title: t('errorOccurred'),
        description: t('failedToGetAdvice'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="query"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('yourFinancialQuestion')}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t('financialQuestionPlaceholder')}
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('location')}</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Punjab, India" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('farmingExperience')}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="0-2 years">0-2 {t('years')}</SelectItem>
                          <SelectItem value="2-5 years">2-5 {t('years')}</SelectItem>
                          <SelectItem value="5-10 years">5-10 {t('years')}</SelectItem>
                          <SelectItem value="10+ years">10+ {t('years')}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="farmingType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('typeOfFarming')}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Subsistence">{t('subsistence')}</SelectItem>
                          <SelectItem value="Commercial">{t('commercial')}</SelectItem>
                           <SelectItem value="Organic">{t('organic')}</SelectItem>
                          <SelectItem value="Other">{t('other')}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="landSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('landSize')}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                           <SelectItem value="Small (1-5 acres)">{t('smallAcres')}</SelectItem>
                           <SelectItem value="Medium (5-25 acres)">{t('mediumAcres')}</SelectItem>
                           <SelectItem value="Large (25+ acres)">{t('largeAcres')}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
                <FormField
                control={form.control}
                name="investmentInterest"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                            <FormLabel>{t('interestedInInvestments')}</FormLabel>
                        </div>
                        <FormControl>
                            <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                        </FormControl>
                    </FormItem>
                )}
                />

              <Button type="submit" disabled={isLoading} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('gettingAdvice')}...
                  </>
                ) : (
                  t('getFinancialAdvice')
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <Card className="mt-8 animate-pulse">
            <CardHeader>
                <CardTitle>{t('generatingAdvice')}</CardTitle>
                <CardDescription>{t('generatingAdviceDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="h-4 bg-muted rounded w-1/4"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
            </CardContent>
        </Card>
      )}

      {result && (
        <Card className="mt-8 animate-in fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Sparkles className="text-primary"/> {t('aiFinancialAdvice')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-headline text-lg font-semibold text-primary">{t('advice')}</h3>
              <p className="mt-2 text-foreground/90 whitespace-pre-wrap">{result.advice}</p>
            </div>
             {result.opportunities && result.opportunities.length > 0 && (
              <div>
                <h3 className="font-headline text-lg font-semibold text-primary flex items-center gap-2">
                    <Briefcase />
                    {t('opportunities')}
                </h3>
                <div className="mt-2 space-y-4">
                  {result.opportunities.map((opp, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-card/50">
                      <p className="font-semibold">{opp.title}</p>
                      <p className="text-sm text-muted-foreground">{opp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
}
