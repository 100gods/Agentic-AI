import os
import logging
import google.cloud.logging

from dotenv import load_dotenv

from google.adk import Agent
from google.adk.agents import SequentialAgent, LoopAgent, ParallelAgent, LlmAgent
from google.adk.tools.tool_context import ToolContext
from google.adk.tools.agent_tool import AgentTool
from google.adk.tools import google_search, exit_loop
from google.genai import types
from .callback_logging import log_query_to_model, log_model_response
from google.adk.tools.mcp_tool.mcp_toolset import MCPToolset, \
                StdioServerParameters, StdioConnectionParams
from . import prompt

cloud_logging_client = google.cloud.logging.Client()
cloud_logging_client.setup_logging()

load_dotenv()

model_name = os.getenv("MODEL")
print(model_name)
google_maps_api_key = os.getenv("GOOGLE_MAPS_API_KEY")

# Tools
def append_to_state(
    tool_context: ToolContext, field: str, response: str
) -> dict[str, str]:
    """Append new output to an existing state key.

    Args:
        field (str): a field name to append to
        response (str): a string to append to the field

    Returns:
        dict[str, str]: {"status": "success"}
    """
    existing_state = tool_context.state.get(field, [])
    tool_context.state[field] = existing_state + [response]
    logging.info(f"[Added to {field}] {response}")
    return {"status": "success"}

# Agents

# Gov Scheme Agents
scheme_researcher = LlmAgent(
    name="scheme_researcher",
    model=model_name,
    description="Researches government schemes based on crop details.",
    instruction="""
    CROP_DETAILS:
    {{ CROP_DETAILS? }}

    INSTRUCTIONS:
    Use the 'Google Search' tool to find relevant government schemes for the provided CROP_DETAILS.
    Summarize the schemes you found.
    """,
    generate_content_config=types.GenerateContentConfig(
            temperature=0.5,
        ),
    tools=[google_search],
)

scheme_benefit = LlmAgent(
    name="scheme_benefit",
    model=model_name,
    description="Calculated the benefits from the scheme.",
    instruction="""
    CROP_DETAILS:
    {{ CROP_DETAILS? }}

    INSTRUCTIONS:
    Use the 'Google Search' tool to find maximum benefit from the scheme.
    Summarize the schemes you found.
    """,
    generate_content_config=types.GenerateContentConfig(
            temperature=0.5,
        ),
    tools=[google_search],
)

gov_scheme_critic = Agent(
    name="gov_scheme_critic",
    model=model_name,
    description="Maximizes benefits from government schemes.",
    instruction="""
    SCHEME_DATA:
    {{ SCHEME_DATA? }}
    CROP_DETAILS:
    {{ CROP_DETAILS? }}

    INSTRUCTIONS:
    Analyze the SCHEME_DATA in relation to the CROP_DETAILS.
    Suggest ways to maximize benefits from these schemes.
    If significant improvements or additional details can be found, use the 'append_to_state' tool to add your feedback to the field 'SCHEME_FEEDBACK'.
    If the schemes are optimal or no further improvements can be made, use the 'exit_loop' tool.
    Explain your decision and briefly summarize the feedback you have provided.
    """,
    generate_content_config=types.GenerateContentConfig(
            temperature=0.5,
        ),
    tools=[append_to_state, exit_loop],
)

gov_scheme_agent = LoopAgent(
    name="gov_scheme_agent",
    description="Iterates through research and analysis to maximize government scheme benefits.",
    sub_agents=[
        scheme_researcher,
        gov_scheme_critic
    ],
    max_iterations=2,
)

# Mandi Price Agents
mandi_researcher = Agent(
    name="mandi_researcher",
    model=model_name,
    description="Researches current mandi prices for specified crops.",
    instruction="""
    CROP_DETAILS:
    {{ CROP_DETAILS? }}

    INSTRUCTIONS:
    Use the 'Google Search' tool to find current mandi prices for the specified CROP_DETAILS.
    Summarize the prices you found.
    """,
    before_model_callback=log_query_to_model,
    after_model_callback=log_model_response,
    generate_content_config=types.GenerateContentConfig(
            temperature=0,
        ),
    tools=[google_search],
)

mandi_profit = Agent(
    name="mandi_profit",
    model=model_name,
    description="Calculates potential profit based on mandi prices and crop details.",
    instruction="""
    MANDI_PRICE_DATA:
    {{ MANDI_PRICE_DATA? }}
    CROP_DETAILS:
    {{ CROP_DETAILS? }}

    INSTRUCTIONS:
    Based on the MANDI_PRICE_DATA and CROP_DETAILS (e.g., expected yield, production cost),
    calculate the potential profit.
    calculate the approx distance to mandi or Vegetable mandi or fruit mandi or Vegetable market or fruit market  using MCPToolset
    Use the 'append_to_state' tool to add your profit calculation and distance to mandi to the 'PROFIT_ANALYSIS' and 'DISTANCE_ANALYSIS' field.
    """,
    generate_content_config=types.GenerateContentConfig(
            temperature=0,
        ),
    tools=[append_to_state,
            MCPToolset(
                    connection_params=StdioConnectionParams(
                        server_params=StdioServerParameters(
                            command='npx',
                            args=[
                                "-y",
                                "@modelcontextprotocol/server-google-maps",
                            ],
                            env={
                                "GOOGLE_MAPS_API_KEY": google_maps_api_key
                            }
                        ),
                        timeout=5,
                        ),
                    )
    ],
)

mandi_critic = Agent(
    name="mandi_critic",
    model=model_name,
    description="Suggests ways to maximize profit from mandi sales.",
    instruction="""
    DISTANCE_ANALYSIS:
    {{DISTANCE_ANALYSIS? }}
    PROFIT_ANALYSIS:
    {{ PROFIT_ANALYSIS? }}
    MANDI_PRICE_DATA:
    {{ MANDI_PRICE_DATA? }}
    CROP_DETAILS:
    {{ CROP_DETAILS? }}

    INSTRUCTIONS:
    Review the PROFIT_ANALYSIS,DISTANCE_ANALYSIS and suggest strategies to maximize profit, such as optimal selling times or alternative markets.
    If significant improvements can be made, use the 'append_to_state' tool to add your feedback to the field 'PROFIT_OPTIMIZATION_FEEDBACK'.
    If the profit is optimal or no further improvements can be made, use the 'exit_loop' tool.
    Explain your decision and briefly summarize the feedback you have provided.
    """,
    generate_content_config=types.GenerateContentConfig(
            temperature=0.2,
        ),
    tools=[append_to_state, exit_loop],
)

mandi_price_agent = LoopAgent(
    name="mandi_price_agent",
    description="Iterates through mandi price research and profit optimization.",
    sub_agents=[
        mandi_researcher,
        mandi_profit,
        mandi_critic
    ],
    max_iterations=2,
)

# Individual Pratham Kisan Agents
crop_management_agent = Agent(
    name="crop_management_agent",
    model=model_name,
    description="Provides advice on crop management.",
    instruction="""
    INSTRUCTIONS:
    Based on the CROP_DETAILS, provide comprehensive advice on crop management,
    including soil preparation, sowing, irrigation, pest control, and harvesting.
    Use the 'Google Search' tool for information if needed.
    Use the 'append_to_state' tool to add your advice to the 'CROP_MANAGEMENT_ADVICE' field.
    """,
    before_model_callback=log_query_to_model,
    after_model_callback=log_model_response,
    tools=[google_search],
    generate_content_config=types.GenerateContentConfig(
            temperature=0.2,
        ),
)

weather_agent = Agent(
    name="weather_agent",
    model=model_name,
    description="Provides weather forecasts and their impact on crops.",
    instruction="""
    INSTRUCTIONS:
    Use the 'Google Search' tool to get the current and forecasted weather for the LOCATION.
    Analyze how the weather might impact the CROP_DETAILS and suggest necessary actions.
    """,
    before_model_callback=log_query_to_model,
    after_model_callback=log_model_response,
    tools=[google_search],
    generate_content_config=types.GenerateContentConfig(
            temperature=0.2,
        ),
)

farming_new_tech_agent = Agent(
    name="farming_new_tech_agent",
    model=model_name,
    description="Suggests new farming technologies and practices.",
    instruction="""
    INSTRUCTIONS:
    Based on the CROP_DETAILS, research and suggest new farming technologies,
    innovative practices, and sustainable agriculture methods that could improve yield or efficiency.
    Use the 'Google Search' tool for information.
    """,
    tools=[google_search],
    generate_content_config=types.GenerateContentConfig(
            temperature=0.2,
        ),
)

simple_agents = Agent(
    name = "simple_agents",
    model = model_name,
    description=(
                "based on parent agent just call sub agent"  # Changed description
            ),
    instruction = prompt.SIMPLE_AGENT,
    tools=[
                AgentTool(agent=crop_management_agent),
                AgentTool(agent=weather_agent),
                AgentTool(agent=farming_new_tech_agent),
    ],
    generate_content_config=types.GenerateContentConfig(
            temperature=0.2,
        ),

)

pratham_kishan_agent = LlmAgent(
    name="pratham_kishan_agent",
    model = model_name,
    description=(
            "guide users through a structured process to receive farming "
            "advice by orchestrating a series of expert subagents. help them "
            "with crop management, government schemes, market information, "
            "farming technologies, and weather forecasts."  # Changed description
        ),
    instruction = prompt.PRATHAM_KISHAN_INSTRUCTION,
     sub_agents=[simple_agents,
                gov_scheme_agent,
                mandi_price_agent
     ],
     generate_content_config=types.GenerateContentConfig(
               temperature=0.2,
           ),
)

root_agent = LlmAgent(
    name="greeter",
    model=model_name,
    description="Guides the user in getting agricultural advice.",
    instruction="""
    - Welcome the user to Pratham Kisan and inform them you can provide comprehensive agricultural guidance.
    - Ask the user for details about their crop (e.g., type of crop, stage of growth, location) to get started.
    - When they respond, use the 'append_to_state' tool to store the user's response in the 'CROP_DETAILS' state key and 'LOCATION' state key (if provided) and then transfer to the 'pratham_kishan_agent'.
    """,
    tools=[append_to_state],
    generate_content_config=types.GenerateContentConfig(
            temperature=0.2,
        ),
    sub_agents=[pratham_kishan_agent],
)