# sub_agents/_critic/agent.py
from adk.api import Agent
from config import llm

class CriticAgent(Agent):
    """
    A generic critic agent that provides feedback on a given context.
    The prompt for this agent is dynamically set during its creation.
    """
    def __init__(self, critique_prompt: str):
        super().__init__(llm=llm, prompt=critique_prompt)