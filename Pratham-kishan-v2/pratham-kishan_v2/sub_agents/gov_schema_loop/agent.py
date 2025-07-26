# sub_agents/gov_schema_loop/agent.py
from google.adk.agents import  Agent,LoopAgent, LlmAgent, BaseAgent, SequentialAgent
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
        super().__init__(name = "gov_schema_critic_agent",
                         model=MODEL,
                         instruction=critique_prompt)

# --- Child Agents for this Loop ---
initial_gov_agent = LlmAgent(name="initial_gov_agent", instruction=prompts.CROP_AGENT_PROMPT, tools=[google_search])
schema_agent = LlmAgent(name="schema_agent", instruction=prompts.SCHEMA_AGENT_PROMPT, tools=[google_search])
gov_schema_critic_agent = CriticAgent(critique_prompt=prompts.CRITIC_PROMPT)

# --- The Loop Agent ---
refinement_loop_gov = LoopAgent(
    name = "gov_schema_loop",
    sub_agents=[gov_schema_critic_agent, schema_agent],
    max_iterations=3,
)

gov_scheme_agent = SequentialAgent(
    name="gov_scheme_agent_first",
    sub_agents=[
        initial_gov_agent, # Run first to create initial doc
        refinement_loop_gov       # Then run the critique/refine loop
    ],
    description="Writes an initial document and then iteratively refines it with critique using an exit tool."
)
