# sub_agents/farming_tech/agent.py
from google.adk.agents import Agent,LoopAgent, LlmAgent, BaseAgent, SequentialAgent
from google.adk.tools import google_search
from . import prompts

MODEL = "gemini-2.0-flash-lite"

farming_tech_sub_agent = LlmAgent(
    name = "farming_tech_sub_agent",
    model = MODEL,
    instruction=prompts.FARMING_TECH_PROMPT,
    tools=[google_search]
)
