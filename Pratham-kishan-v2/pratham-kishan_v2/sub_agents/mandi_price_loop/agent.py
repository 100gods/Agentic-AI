# sub_agents/mandi_price_loop/agent.py
from google.adk.agents import Agent,LoopAgent, LlmAgent, BaseAgent, SequentialAgent
from google.adk.models.google_llm import Gemini
from google.adk.tools import google_search

from . import prompts

MODEL = "gemini-2.0-flash-lite"

class CriticAgent(Agent):
    """
    A generic critic agent that provides feedback on a given context.
    The prompt for this agent is dynamically set during its creation.
    """
    def __init__(self, critique_prompt: str):
        super().__init__(name = "mandi_critic_agent",
                         model=MODEL,
                         instruction=critique_prompt)

# --- Child Agents for this Loop ---
mandi_agent = LlmAgent(name = "mandi_agent_inital", model=MODEL,,instruction=prompts.MANDI_AGENT_PROMPT, tools=[google_search])
mandi_finance_agent = Agent(name="mandi_finance_agent", model=MODEL,,instruction=prompts.FINANCE_AGENT_PROMPT, tools=[google_search])
mandi_critic_agent = CriticAgent(critique_prompt=prompts.CRITIC_PROMPT)

# --- The Loop Agent ---
refinement_loop_mandi = LoopAgent(
    name ="mandi_loop_agent",
    sub_agents=[mandi_critic_agent, mandi_finance_agent],
    max_iterations=3,
)

mandi_price_loop = SequentialAgent(
    name="mandi_first_agent",
    sub_agents=[
        mandi_agent, # Run first to create initial doc
        refinement_loop_mandi       # Then run the critique/refine loop
    ],
    description="Writes an initial document and then iteratively refines it with critique using an exit tool."
)