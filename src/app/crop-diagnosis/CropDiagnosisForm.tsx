
'use client';

import { useState, useRef, useEffect, useContext } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Calendar, Video, Clock, Mic, StopCircle, Volume2 } from 'lucide-react';
import { add, format } from 'date-fns';


import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { diagnoseCrop, type DiagnoseCropOutput } from '@/ai/flows/crop-diagnosis';
import { textToSpeech, type TextToSpeechOutput } from '@/ai/flows/tts';
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
import { LanguageContext, languageOptions } from '@/context/LanguageContext';

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

export default function CropDiagnosisForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DiagnoseCropOutput | null>(null);
  const [audioResult, setAudioResult] = useState<TextToSpeechOutput | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();
  
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [selectedExpert, setSelectedExpert] = useState<any | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const { t, language, languageCode, setLanguage } = useContext(LanguageContext);

  const experts = [
    {
      id: '1',
      name: 'Dr. Anjali Sharma',
      specialty: t('plantPathology'),
      rate: '₹1500/hr',
      avatar: 'https://placehold.co/100x100',
      dataAiHint: 'woman portrait',
      slots: ['10:00 AM', '11:00 AM', '02:00 PM'],
    },
    {
      id: '2',
      name: 'Mr. Vikram Singh',
      specialty: t('entomology'),
      rate: '₹1200/hr',
      avatar: 'https://placehold.co/100x100',
      dataAiHint: 'man portrait',
      slots: ['09:00 AM', '12:00 PM', '04:00 PM'],
    },
];

type Expert = typeof experts[0];
  
  useEffect(() => {
    audioRef.current = new Audio();
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
      language: language,
    },
  });
  
  const selectedLanguage = form.watch('language');

  useEffect(() => {
    form.setValue('language', language);
  }, [language, form]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = languageCode;

      recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          form.setValue('description', transcript);
          setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        if (event.error !== 'no-speech') {
          console.error('Speech recognition error', event.error);
          toast({
              variant: 'destructive',
              title: t('voiceRecognitionError'),
              description: t('voiceRecognitionErrorDesc', { error: event.error }),
          });
        }
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

    }
  }, [languageCode, toast, form, t]);

  const handleVoiceInput = () => {
    if (!recognitionRef.current) {
      toast({
          variant: 'destructive',
          title: t('notSupported'),
          description: t('voiceRecognitionNotSupported'),
      });
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      form.setValue('description', '');
      recognitionRef.current.lang = languageCode;
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const playAudioResult = () => {
    if (audioRef.current && audioResult?.audioDataUri) {
      audioRef.current.src = audioResult.audioDataUri;
      audioRef.current.play();
    }
  };


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
    setAudioResult(null);
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

        const textForTTS = `${t('diagnosis')}: ${response.diagnosis}. ${t('suggestedSolutions')}: ${response.solutions}`;
        const audioResponse = await textToSpeech(textForTTS);
        setAudioResult(audioResponse);

      } catch (error) {
        console.error('Diagnosis failed:', error);
        toast({
          variant: 'destructive',
          title: t('errorOccurred'),
          description: t('failedToGetDiagnosis'),
        });
      } finally {
        setIsLoading(false);
      }
    };
    reader.onerror = (error) => {
      console.error('Error reading file:', error);
      toast({
        variant: 'destructive',
        title: t('fileReadError'),
        description: t('couldNotReadFile'),
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
        title: t('appointmentBooked'),
        description: t('appointmentBookedDesc', { name: selectedExpert?.name, slot: selectedSlot }),
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

    const utcStartTime = format(startTime, "yyyyMMdd'T'HHmmss'Z'");
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
                    <FormLabel>{t('cropPhoto')}</FormLabel>
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
                    <FormLabel>{t('language')}</FormLabel>
                    <Select onValueChange={(value) => {
                      field.onChange(value);
                      setLanguage(value as any);
                    }} 
                    defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('selectLanguage')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {languageOptions.map(option => (
                           <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                        ))}
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
                    <FormLabel>{t('descriptionOfIssue')}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Textarea
                          placeholder={isListening ? t('listening') : t('descriptionPlaceholder')}
                          rows={5}
                          {...field}
                          disabled={isListening}
                        />
                         <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={handleVoiceInput}
                            disabled={isLoading}
                            className="absolute bottom-2 right-2"
                            aria-label={isListening ? t('stopListening') : t('startListening')}
                          >
                            {isListening ? (
                                <StopCircle className="h-5 w-5 text-destructive animate-pulse" />
                            ) : (
                                <Mic className="h-5 w-5" />
                            )}
                          </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('analyzing')}...
                  </>
                ) : (
                  t('getDiagnosis')
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <Card className="mt-8 animate-pulse">
            <CardHeader>
                <CardTitle>{t('generatingDiagnosis')}</CardTitle>
                <CardDescription>{t('generatingDiagnosisDesc')}</CardDescription>
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
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{t('analysisResult')}</CardTitle>
                <CardDescription>{t('analysisResultDesc')}</CardDescription>
              </div>
              {audioResult && (
                <Button variant="outline" size="icon" onClick={playAudioResult} aria-label={t('playDiagnosis')}>
                  <Volume2 className="h-5 w-5" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-headline text-lg font-semibold text-primary">{t('diagnosis')}</h3>
              <p className="mt-2 text-foreground/90 whitespace-pre-wrap">{result.diagnosis}</p>
            </div>
            <div>
              <h3 className="font-headline text-lg font-semibold text-primary">{t('suggestedSolutions')}</h3>
              <p className="mt-2 text-foreground/90 whitespace-pre-wrap">{result.solutions}</p>
            </div>
          </CardContent>
          {result.isDisease && !bookingConfirmed && (
            <>
                <Separator />
                <CardContent className="p-0 pt-6">
                    <h3 className="font-headline text-lg font-semibold text-destructive">{t('expertConsultationRec')}</h3>
                    <p className="text-muted-foreground mt-1">{t('expertConsultationRecDesc')}</p>
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
                                        <span className="text-sm font-medium self-center mr-2">{t('availableSlots')}:</span>
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
                            <CardTitle className="text-green-800">{t('appointmentConfirmed')}</CardTitle>
                            <CardDescription className="text-green-700">
                                {t('appointmentConfirmedDesc', { name: selectedExpert.name, slot: selectedSlot })}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col sm:flex-row gap-4">
                            <Button asChild>
                                <a href="#" target="_blank" rel="noopener noreferrer">
                                    <Video className="mr-2 h-4 w-4" /> {t('joinMeeting')}
                                </a>
                            </Button>
                            <Button variant="outline" asChild>
                                <a href={generateCalendarLink()} target="_blank" rel="noopener noreferrer">
                                    <Calendar className="mr-2 h-4 w-4" /> {t('addToCalendar')}
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
            <AlertDialogTitle>{t('confirmAppointment')}</AlertDialogTitle>
            <AlertDialogDescription>
                {t('confirmAppointmentDesc', { name: selectedExpert?.name, slot: selectedSlot, rate: selectedExpert?.rate})}
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmBooking}>{t('confirmBooking')}</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
