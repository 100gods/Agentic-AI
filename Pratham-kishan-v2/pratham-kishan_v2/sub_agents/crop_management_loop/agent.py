# sub_agents/crop_management_loop/agent.py
from google.adk.agents import LoopAgent, LlmAgent, BaseAgent, SequentialAgent,Agent
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
        super().__init__(name = "crop_critic_agent",
                         model=MODEL,
                         instruction=critique_prompt)

# --- Child Agents for this Loop ---
initial_crop_agent = LlmAgent(
    name = "initial_crop_agent",
    model=MODEL,
    instruction=prompts.CROP_AGENT_PROMPT,
    tools=[google_search],
)

finance_agent = LlmAgent(name = "crop_finance_agent",
                         model=MODEL,
                         instruction=prompts.FINANCE_AGENT_PROMPT,
                         tools=[google_search]
                         )
crop_critic_agent = CriticAgent(critique_prompt=prompts.CRITIC_PROMPT)

# --- The Loop Agent ---
refinement_loop = LoopAgent(
    name = "crop_agent_refine",
    sub_agents=[crop_critic_agent, finance_agent],
    max_iterations=3,
    #exit_condition=lambda result: "EXIT" in result.get('content', '')
)

crop_agent = SequentialAgent(
    name="crop_agent_first",
    sub_agents=[
        initial_crop_agent, # Run first to create initial doc
        refinement_loop       # Then run the critique/refine loop
    ],
    description="Writes an initial document and then iteratively refines it with critique using an exit tool."
)