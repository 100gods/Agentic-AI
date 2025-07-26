'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Calendar, Video, Clock } from 'lucide-react';
import { add, format } from 'date-fns';


import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { diagnoseCrop, type DiagnoseCropOutput } from '@/ai/flows/crop-diagnosis';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const formSchema = z.object({
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.',
  }),
  language: z.string({
    required_error: 'Please select a language.',
  }),
  photo:
    typeof window === 'undefined'
      ? z.any()
      : z
          .instanceof(FileList)
          .refine((files) => files?.length === 1, 'A photo is required.')
          .refine((files) => files?.[0]?.type.startsWith('image/'), 'Only image files are accepted.')
          .refine((files) => files?.[0]?.size <= 4 * 1024 * 1024, `Max file size is 4MB.`),
});

type FormValues = z.infer<typeof formSchema>;

const experts = [
    {
      id: '1',
      name: 'Dr. Anjali Sharma',
      specialty: 'Plant Pathology',
      rate: '₹1500/hr',
      avatar: 'https://placehold.co/100x100',
      dataAiHint: 'woman portrait',
      slots: ['10:00 AM', '11:00 AM', '02:00 PM'],
    },
    {
      id: '2',
      name: 'Mr. Vikram Singh',
      specialty: 'Entomology (Pest Control)',
      rate: '₹1200/hr',
      avatar: 'https://placehold.co/100x100',
      dataAiHint: 'man portrait',
      slots: ['09:00 AM', '12:00 PM', '04:00 PM'],
    },
];

type Expert = typeof experts[0];

export default function CropDiagnosisForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DiagnoseCropOutput | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();

  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
      language: 'English',
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setResult(null);
    setBookingConfirmed(false);
    setSelectedExpert(null);
    setSelectedSlot(null);

    const file = values.photo[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const photoDataUri = reader.result as string;
      try {
        const response = await diagnoseCrop({
          photoDataUri,
          description: values.description,
          language: values.language,
        });
        setResult(response);
      } catch (error) {
        console.error('Diagnosis failed:', error);
        toast({
          variant: 'destructive',
          title: 'An error occurred',
          description: 'Failed to get a diagnosis. Please try again.',
        });
      } finally {
        setIsLoading(false);
      }
    };
    reader.onerror = (error) => {
      console.error('Error reading file:', error);
      toast({
        variant: 'destructive',
        title: 'File Read Error',
        description: 'Could not read the selected image file.',
      });
      setIsLoading(false);
    };
  };

  const handleBookSlot = (expert: Expert, slot: string) => {
    setSelectedExpert(expert);
    setSelectedSlot(slot);
    setIsConfirming(true);
  };

  const confirmBooking = () => {
    setBookingConfirmed(true);
    setIsConfirming(false);
    toast({
        title: "Appointment Booked!",
        description: `Your consultation with ${selectedExpert?.name} at ${selectedSlot} is confirmed.`,
    });
  };
  
  const generateCalendarLink = () => {
    if (!selectedExpert || !selectedSlot) return '#';
    const now = new Date();
    const [time, period] = selectedSlot.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (period === 'PM' && hours < 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;

    const startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
    const endTime = add(startTime, { hours: 1 });

    const
 

utcStartTime = format(startTime, "yyyyMMdd'T'HHmmss'Z'");
    const utcEndTime = format(endTime, "yyyyMMdd'T'HHmmss'Z'");

    const details = `Consultation with ${selectedExpert.name} for ${result?.diseaseName}`;
    const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(details)}&dates=${utcStartTime}/${utcEndTime}&details=${encodeURIComponent('Video meeting to discuss crop diagnosis.')}`;
    return url;
  };


  return (
    <>
      <Card>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="photo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Crop Photo</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        className="file:text-foreground"
                        onChange={(e) => {
                          field.onChange(e.target.files);
                          handleImageChange(e);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {imagePreview && (
                <div className="w-full h-64 relative rounded-md overflow-hidden border">
                  <Image src={imagePreview} alt="Crop preview" layout="fill" objectFit="cover" data-ai-hint="crop plant" />
                </div>
              )}
              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select language for diagnosis" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="Hindi">Hindi (हिन्दी)</SelectItem>
                        <SelectItem value="Spanish">Spanish (Español)</SelectItem>
                        <SelectItem value="Marathi">Marathi (मराठी)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description of Issue</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., The leaves are turning yellow with brown spots..."
                        rows={5}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Get Diagnosis'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <Card className="mt-8 animate-pulse">
            <CardHeader>
                <CardTitle>Generating Diagnosis...</CardTitle>
                <CardDescription>Our AI is analyzing your crop. Please wait a moment.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="h-4 bg-muted rounded w-1/4"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/4 mt-4"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
            </CardContent>
        </Card>
      )}

      {result && (
        <Card className="mt-8 animate-in fade-in">
          <CardHeader>
            <CardTitle>Analysis Result</CardTitle>
            <CardDescription>Here is the diagnosis and suggested solutions from our AI expert.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-headline text-lg font-semibold text-primary">Diagnosis</h3>
              <p className="mt-2 text-foreground/90 whitespace-pre-wrap">{result.diagnosis}</p>
            </div>
            <div>
              <h3 className="font-headline text-lg font-semibold text-primary">Suggested Solutions</h3>
              <p className="mt-2 text-foreground/90 whitespace-pre-wrap">{result.solutions}</p>
            </div>
          </CardContent>
          {result.isDisease && !bookingConfirmed && (
            <>
                <Separator />
                <CardContent className="p-0">
                    <h3 className="font-headline text-lg font-semibold text-destructive">Expert Consultation Recommended</h3>
                    <p className="text-muted-foreground mt-1">Our analysis indicates a disease. You can book a video consultation with an expert for further guidance.</p>
                    <div className="mt-4 space-y-4">
                        {experts.map((expert) => (
                            <Card key={expert.id} className="bg-card/50">
                                <CardHeader className="flex flex-row items-center gap-4">
                                    <Avatar className="h-16 w-16">
                                        <AvatarImage src={expert.avatar} alt={expert.name} data-ai-hint={expert.dataAiHint} />
                                        <AvatarFallback>{expert.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <CardTitle className="text-base">{expert.name}</CardTitle>
                                        <CardDescription>{expert.specialty}</CardDescription>
                                        <Badge variant="secondary" className="mt-2">{expert.rate}</Badge>
                                    </div>
                                </CardHeader>
                                <CardFooter>
                                    <div className="flex gap-2 flex-wrap">
                                        <span className="text-sm font-medium self-center mr-2">Available Slots:</span>
                                        {expert.slots.map(slot => (
                                            <Button key={slot} variant="outline" size="sm" onClick={() => handleBookSlot(expert, slot)}>
                                                <Clock className="mr-2 h-4 w-4" /> {slot}
                                            </Button>
                                        ))}
                                    </div>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </>
          )}
           {bookingConfirmed && selectedExpert && selectedSlot && (
            <>
                <Separator />
                <CardContent className="p-0 mt-6">
                    <Card className="bg-green-50 border-green-200">
                        <CardHeader>
                            <CardTitle className="text-green-800">Appointment Confirmed!</CardTitle>
                            <CardDescription className="text-green-700">
                                Your video consultation with {selectedExpert.name} is scheduled for {selectedSlot}.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col sm:flex-row gap-4">
                            <Button asChild>
                                <a href="#" target="_blank" rel="noopener noreferrer">
                                    <Video className="mr-2 h-4 w-4" /> Join Meeting
                                </a>
                            </Button>
                            <Button variant="outline" asChild>
                                <a href={generateCalendarLink()} target="_blank" rel="noopener noreferrer">
                                    <Calendar className="mr-2 h-4 w-4" /> Add to Calendar
                                </a>
                            </Button>
                        </CardContent>
                    </Card>
                </CardContent>
            </>
           )}
        </Card>
      )}

    <AlertDialog open={isConfirming} onOpenChange={setIsConfirming}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Confirm Your Appointment</AlertDialogTitle>
            <AlertDialogDescription>
                Are you sure you want to book a consultation with <span className="font-bold">{selectedExpert?.name}</span> at <span className="font-bold">{selectedSlot}</span> for a fee of {selectedExpert?.rate}?
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmBooking}>Confirm Booking</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
