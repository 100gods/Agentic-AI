import { config } from 'dotenv';
config();

import '@/ai/flows/crop-diagnosis.ts';
import '@/ai/flows/financial-advice.ts';
import '@/ai/flows/orchestrator.ts';
import '@/ai/flows/tts.ts';
