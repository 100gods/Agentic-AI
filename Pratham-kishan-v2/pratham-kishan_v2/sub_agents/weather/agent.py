# sub_agents/weather/agent.py
from google.adk.agents import LlmAgent
from google.adk.tools import google_search
from . import prompts

MODEL = "gemini-2.0-flash"
weather_sub_agent = LlmAgent(
    name = "weather_sub_agent",
    model = MODEL,
    instruction=prompts.WEATHER_AGENT_PROMPT,
    tools=[google_search]
)
