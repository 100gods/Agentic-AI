# **App Name**: AgriAssist AI

## Core Features:

- AI Orchestrator: Central AI tool acts as orchestrator, routing requests to specialized agents based on voice/text input or user selection.
- Crop Diagnosis: Uses image analysis and LLM reasoning tool to diagnose crop diseases, providing multilingual support.
- Weather Reports: Provides current weather information and crop-specific forecasts based on user's identified location.
- Discussion Forums: Enables discussion forums between farmers, grouped by topics related to crops and farming, allowing easy participation and question asking.
- Government Schemes: Offers information on current government schemes relevant to farmers.
- Farmer's Training: Lists training opportunities at various levels and on multiple farming topics, enhancing farmer education.
- Crop Management & Offline Support: Analyzes soil data from sensors to provide insights on humidity, structure, crop suitability, and watering schedules, using available, limited cached data when offline (e.g., suggestions for enabling drip irrigation).

## Style Guidelines:

- Primary color: A deep teal (#008080) to evoke a sense of intelligence and responsiveness. Note: user requested this color.
- Background color: A light, complementary teal (#E0F8F8) to create a soft, clean aesthetic.  Note: user requested this color.
- Accent color: A pale green (#98FF98) to highlight interactive elements like buttons and provide positive feedback.  Note: user requested this color.
- Font: 'Inter' (sans-serif) for both headlines and body text for its modern, clean, and highly readable appearance. Note: user requested this font; currently only Google Fonts are supported.
- Single-column, centered layout for focus. Use a Card component as the main container with a subtle shadow.
- Minimalist icons from lucide-react to represent key actions (e.g., microphone, play button, upload).
- Subtle fade and scale animations for state changes, such as during AI processing.