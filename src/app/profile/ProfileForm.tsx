
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useContext } from 'react';
import { LanguageContext } from '@/context/LanguageContext';

const profileSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
  location: z.string().min(2, { message: 'Location is required.' }),
  experience: z.string({ required_error: 'Please select your experience level.' }),
  farmingType: z.string({ required_error: 'Please select your farming type.' }),
  landSize: z.string({ required_error: 'Please select your land size.' }),
  investmentInterest: z.boolean().default(false),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfileForm() {
    const { toast } = useToast();
    const { t } = useContext(LanguageContext);

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            fullName: '',
            location: '',
            investmentInterest: false,
        },
    });
    
    const isLoading = form.formState.isSubmitting;

    const onSubmit = (data: ProfileFormValues) => {
        console.log(data);
        toast({
            title: t('profileSaved'),
            description: t('profileSavedDesc'),
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('farmerProfile')}</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="fullName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('fullName')}</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Ramesh Kumar" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('locationStateCountry')}</FormLabel>
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
                                        <SelectTrigger><SelectValue placeholder={t('selectExperience')} /></SelectTrigger>
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
                                        <SelectTrigger><SelectValue placeholder={t('selectFarmingType')} /></SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Subsistence">{t('subsistence')}</SelectItem>
                                        <SelectItem value="Commercial">{t('commercial')}</SelectItem>
                                        <SelectItem value="Organic">{t('organic')}</SelectItem>
                                        <SelectItem value="Livestock">{t('livestock')}</SelectItem>
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
                                    <FormLabel>{t('howMuchLand')}</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger><SelectValue placeholder={t('selectLandSize')} /></SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="No land">{t('noLand')}</SelectItem>
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
                                        <FormLabel>{t('lookingForInvestment')}</FormLabel>
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
                        <Button type="submit" disabled={isLoading} className="w-full">
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {t('saveProfile')}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
