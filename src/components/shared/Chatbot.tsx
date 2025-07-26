
'use client';

import { useState, useContext, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Send, Bot, User, Loader2, ArrowRight } from 'lucide-react';
import { LanguageContext } from '@/context/LanguageContext';
import { orchestrate, type OrchestrateOutput } from '@/ai/flows/orchestrator';
import { useToast } from '@/hooks/use-toast';

interface Message {
    sender: 'user' | 'bot';
    text: string;
    isCarousel?: boolean;
    result?: OrchestrateOutput | null;
}

const features = [
    { name: 'Crop Diagnosis', href: '/crop-diagnosis' },
    { name: 'Weather Reports', href: '/weather' },
    { name: 'Discussion Forums', href: '/forums' },
    { name: 'Government Schemes', href: '/schemes' },
    { name: "Farmer's Training", href: '/training' },
    { name: 'Crop Management', href: '/crop-management' },
    { name: 'Financial Advice', href: '/financial-advice' },
    { name: 'Market Prices', href: '/market-prices' },
];

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const { t } = useContext(LanguageContext);
    const { toast } = useToast();
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const userMessage: Message = { sender: 'user', text: inputValue };
        setMessages((prev) => [...prev, userMessage]);
        setInputValue('');
        setIsProcessing(true);

        try {
            const response = await orchestrate({ query: userMessage.text });
            let botText = '';
            
            if (response.agent && response.agent !== 'Unknown') {
                 botText = response.clarifyingQuestion || t('navigatingTo', { page: t(response.agent.replace(/ /g, '')) });
            } else {
                 botText = response.clarifyingQuestion || t('requestUnclearDesc');
            }

            const botMessage: Message = { sender: 'bot', text: botText, result: response };
            setMessages((prev) => [...prev, botMessage]);

        } catch (error) {
            console.error('Chatbot error:', error);
            const errorMessage: Message = { sender: 'bot', text: t('failedToProcessRequest') };
            setMessages((prev) => [...prev, errorMessage]);
            toast({
                variant: 'destructive',
                title: t('errorOccurred'),
                description: t('failedToProcessRequest'),
            });
        } finally {
            setIsProcessing(false);
        }
    };
    
    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({
                top: scrollAreaRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [messages]);

    const getFeatureHref = (agentName: string) => {
        const feature = features.find(f => f.name === agentName);
        return feature ? feature.href : '#';
    }

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="default"
                    className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg z-50 animate-in fade-in"
                    aria-label="Open chatbot"
                >
                    <Bot className="h-8 w-8" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                side="top"
                align="end"
                className="w-[350px] md:w-[400px] h-[500px] rounded-lg shadow-2xl p-0 flex flex-col"
            >
                <div className="p-4 bg-primary text-primary-foreground rounded-t-lg">
                    <h3 className="text-lg font-semibold">{t('intelligentPartner')}</h3>
                </div>
                <ScrollArea className="flex-1 p-4" ref={scrollAreaRef as any}>
                    <div className="space-y-4">
                        {messages.map((message, index) => (
                            <div key={index} className={`flex items-start gap-3 ${message.sender === 'user' ? 'justify-end' : ''}`}>
                                {message.sender === 'bot' && <Bot className="h-6 w-6 text-primary flex-shrink-0" />}
                                <div className={`max-w-[80%] rounded-lg p-3 text-sm ${
                                    message.sender === 'user' 
                                    ? 'bg-primary text-primary-foreground' 
                                    : 'bg-muted'
                                }`}>
                                    <p className="whitespace-pre-wrap">{message.text}</p>
                                    {message.sender === 'bot' && message.result?.agent && message.result.agent !== 'Unknown' && (
                                        <div className="mt-2">
                                            <Button asChild variant="secondary" size="sm">
                                                <Link href={getFeatureHref(message.result.agent)}>
                                                    Go to {t(message.result.agent.replace(/ /g, ''))} <ArrowRight className="ml-2 h-4 w-4" />
                                                </Link>
                                            </Button>
                                        </div>
                                    )}
                                </div>
                                {message.sender === 'user' && <User className="h-6 w-6 flex-shrink-0" />}
                            </div>
                        ))}
                         {isProcessing && (
                            <div className="flex items-start gap-3">
                                <Bot className="h-6 w-6 text-primary flex-shrink-0" />
                                <div className="max-w-[80%] rounded-lg p-3 text-sm bg-muted flex items-center">
                                    <Loader2 className="h-5 w-5 animate-spin"/>
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>
                <form onSubmit={handleSendMessage} className="p-4 border-t flex items-center gap-2">
                    <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={t('howCanIHelp')}
                        disabled={isProcessing}
                    />
                    <Button type="submit" size="icon" disabled={isProcessing}>
                        <Send className="h-5 w-5" />
                    </Button>
                </form>
            </PopoverContent>
        </Popover>
    );
}
