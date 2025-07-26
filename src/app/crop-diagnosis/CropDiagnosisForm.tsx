'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { diagnoseCrop, type DiagnoseCropOutput } from '@/ai/flows/crop-diagnosis';

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
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();

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
        </Card>
      )}
    </>
  );
}
