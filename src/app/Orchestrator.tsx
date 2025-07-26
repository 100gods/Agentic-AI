'use client';

import { useState, useRef, useEffect, createElement } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Loader2, Mic, StopCircle, Leaf, CloudSun, MessageSquare, Landmark, BookOpen, Droplets, Briefcase, BarChart } from 'lucide-react';
import { orchestrate } from '@/ai/flows/orchestrator';
import { type OrchestrateOutput } from '@/ai/flows/orchestrator-schemas';
import { textToSpeech, type TextToSpeechOutput } from '@/ai/flows/tts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface OrchestratorProps {
    agentToFeatureMap: Record<string, {
        title: string;
        description: string;
        href: string;
    }>;
}

const iconMap: Record<string, React.ElementType> = {
    'Crop Diagnosis': Leaf,
    'Weather Reports': CloudSun,
    'Discussion Forums': MessageSquare,
    'Government Schemes': Landmark,
    'Farmer\'s Training': BookOpen,
    'Crop Management': Droplets,
    'Financial Advice': Briefcase,
    'Market Prices': BarChart,
};

export default function Orchestrator({ agentToFeatureMap }: OrchestratorProps) {
    const [query, setQuery] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [result, setResult] = useState<OrchestrateOutput | null>(null);
    const [audioResult, setAudioResult] = useState<TextToSpeechOutput | null>(null);
    const router = useRouter();
    const { toast } = useToast();
    const recognitionRef = useRef<any>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        audioRef.current = new Audio();
    }, []);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setQuery(transcript);
                handleOrchestration(transcript);
                setIsListening(false);
            };

            recognitionRef.current.onerror = (event: any) => {
                console.error('Speech recognition error', event.error);
                toast({
                    variant: 'destructive',
                    title: 'Voice Recognition Error',
                    description: `An error occurred: ${event.error}`,
                });
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }
    }, [toast]);

    const handleVoiceInput = () => {
        if (!recognitionRef.current) {
            toast({
                variant: 'destructive',
                title: 'Not Supported',
                description: 'Voice recognition is not supported in your browser.',
            });
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
        } else {
            setQuery('');
            setResult(null);
            setAudioResult(null);
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    const handleOrchestration = async (currentQuery: string) => {
        if (!currentQuery.trim()) return;

        setIsProcessing(true);
        setResult(null);
        setAudioResult(null);

        try {
            const response = await orchestrate({ query: currentQuery });
            setResult(response);
            
            const responseText = response.clarifyingQuestion || `Navigating to the ${response.agent} page.`;
            const audioResponse = await textToSpeech(responseText);
            setAudioResult(audioResponse);

            if (audioRef.current && audioResponse.audioDataUri) {
                audioRef.current.src = audioResponse.audioDataUri;
                audioRef.current.play();
            }

            if (response.agent && response.agent !== 'Unknown' && agentToFeatureMap[response.agent]) {
                 router.push(agentToFeatureMap[response.agent].href);
            }
        } catch (error) {
            console.error('Orchestration failed:', error);
            toast({
                variant: 'destructive',
                title: 'An error occurred',
                description: 'Failed to process your request. Please try again.',
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleOrchestration(query);
    };

    const selectedFeature = result?.agent ? agentToFeatureMap[result.agent] : null;
    const FeatureIcon = selectedFeature ? iconMap[selectedFeature.title] : null;

    return (
        <Card className="w-full max-w-2xl">
            <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="flex items-center gap-2">
                    <Input
                        type="text"
                        placeholder={isListening ? 'Listening...' : "How can I help you today?"}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        disabled={isProcessing || isListening}
                        className="text-base"
                    />
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={handleVoiceInput}
                        disabled={isProcessing}
                        aria-label={isListening ? 'Stop listening' : 'Start listening'}
                    >
                        {isListening ? (
                            <StopCircle className="h-5 w-5 text-destructive animate-pulse" />
                        ) : (
                            <Mic className="h-5 w-5" />
                        )}
                    </Button>
                    <Button type="submit" size="icon" disabled={isProcessing || !query}>
                        {isProcessing ? (
                            <Loader2 className="animate-spin" />
                        ) : (
                            <ArrowRight />
                        )}
                    </Button>
                </form>

                {isProcessing && (
                    <div className="mt-4 text-center text-muted-foreground animate-pulse">
                        Figuring out the best way to help...
                    </div>
                )}

                {result && (
                    <div className="mt-4 animate-in fade-in">
                        {selectedFeature && FeatureIcon ? (
                             <Alert>
                             <FeatureIcon className="h-4 w-4" />
                             <AlertTitle>Suggestion: {selectedFeature.title}</AlertTitle>
                             <AlertDescription>
                               {result.clarifyingQuestion || `Redirecting you to the ${selectedFeature.title} page...`}
                             </AlertDescription>
                           </Alert>
                        ) : (
                            <Alert variant="destructive">
                                <AlertTitle>Request Unclear</AlertTitle>
                                <AlertDescription>
                                    I'm not sure how to help with that. Please try rephrasing your request, or select a feature from the main menu.
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
