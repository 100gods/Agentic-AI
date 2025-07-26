'use server';
/**
 * @fileOverview A text-to-speech AI flow.
 *
 * - textToSpeech - A function that converts text to speech.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import wav from 'wav';

async function toWav(
    pcmData: Buffer,
    channels = 1,
    rate = 24000,
    sampleWidth = 2
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const writer = new wav.Writer({
        channels,
        sampleRate: rate,
        bitDepth: sampleWidth * 8,
      });
  
      let bufs: any[] = [];
      writer.on('error', reject);
      writer.on('data', function (d) {
        bufs.push(d);
      });
      writer.on('end', function () {
        resolve(Buffer.concat(bufs).toString('base64'));
      });
  
      writer.write(pcmData);
      writer.end();
    });
  }

const TextToSpeechOutputSchema = z.object({
    audioDataUri: z.string().describe("The generated audio as a data URI."),
});
export type TextToSpeechOutput = z.infer<typeof TextToSpeechOutputSchema>;


const textToSpeechFlow = ai.defineFlow(
    {
      name: 'textToSpeechFlow',
      inputSchema: z.string(),
      outputSchema: TextToSpeechOutputSchema,
    },
    async (query) => {
      const { media } = await ai.generate({
        model: 'gemini-2.5-flash-preview-tts',
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Algenib' },
            },
          },
        },
        prompt: query,
      });
      if (!media) {
        throw new Error('no media returned');
      }
      const audioBuffer = Buffer.from(
        media.url.substring(media.url.indexOf(',') + 1),
        'base64'
      );
      return {
        audioDataUri: 'data:audio/wav;base64,' + (await toWav(audioBuffer)),
      };
    }
  );

export async function textToSpeech(text: string): Promise<TextToSpeechOutput> {
    return textToSpeechFlow(text);
}
