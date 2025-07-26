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
            title: "Profile Saved!",
            description: "Your profile information has been updated.",
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Farmer Profile</CardTitle>
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
                                        <FormLabel>Full Name</FormLabel>
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
                                        <FormLabel>Location (State, Country)</FormLabel>
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
                                    <FormLabel>Farming Experience</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger><SelectValue placeholder="Select experience level" /></SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="0-2 years">0-2 years</SelectItem>
                                        <SelectItem value="2-5 years">2-5 years</SelectItem>
                                        <SelectItem value="5-10 years">5-10 years</SelectItem>
                                        <SelectItem value="10+ years">10+ years</SelectItem>
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
                                    <FormLabel>Type of Farming</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger><SelectValue placeholder="Select farming type" /></SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Subsistence">Subsistence</SelectItem>
                                        <SelectItem value="Commercial">Commercial</SelectItem>
                                        <SelectItem value="Organic">Organic</SelectItem>
                                        <SelectItem value="Livestock">Livestock</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
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
                                    <FormLabel>How much land do you farm?</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger><SelectValue placeholder="Select land size" /></SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="No land">No land</SelectItem>
                                        <SelectItem value="Small (1-5 acres)">Small (1-5 acres)</SelectItem>
                                        <SelectItem value="Medium (5-25 acres)">Medium (5-25 acres)</SelectItem>
                                        <SelectItem value="Large (25+ acres)">Large (25+ acres)</SelectItem>
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
                                        <FormLabel>Are you looking for investment?</FormLabel>
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
                            Save Profile
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
