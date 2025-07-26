import os
import logging
import google.cloud.logging

from dotenv import load_dotenv

from google.adk import Agent
from google.adk.agents import SequentialAgent, LoopAgent, ParallelAgent, LlmAgent
from google.adk.tools.tool_context import ToolContext
from google.adk.tools import google_search, exit_loop

cloud_logging_client = google.cloud.logging.Client()
cloud_logging_client.setup_logging()

load_dotenv()

model_name = os.getenv("MODEL")
print(model_name)

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
scheme_researcher = Agent(
    name="scheme_researcher",
    model=model_name,
    description="Researches government schemes based on crop details.",
    instruction="""
    CROP_DETAILS:
    {{ CROP_DETAILS? }}

    INSTRUCTIONS:
    Use the 'Google Search' tool to find relevant government schemes for the provided CROP_DETAILS.
    Use the 'append_to_state' tool to add your research to the 'SCHEME_DATA' field.
    Summarize the schemes you found.
    """,
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
    tools=[append_to_state, exit_loop],
)

gov_scheme_agent = LoopAgent(
    name="gov_scheme_agent",
    description="Iterates through research and analysis to maximize government scheme benefits.",
    sub_agents=[
        scheme_researcher,
        gov_scheme_critic
    ],
    max_iterations=3,
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
    Use the 'append_to_state' tool to add the mandi price data to the 'MANDI_PRICE_DATA' field.
    Summarize the prices you found.
    """,
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
    Use the 'append_to_state' tool to add your profit calculation to the 'PROFIT_ANALYSIS' field.
    """,
    tools=[append_to_state],
)

mandi_critic = Agent(
    name="mandi_critic",
    model=model_name,
    description="Suggests ways to maximize profit from mandi sales.",
    instruction="""
    PROFIT_ANALYSIS:
    {{ PROFIT_ANALYSIS? }}
    MANDI_PRICE_DATA:
    {{ MANDI_PRICE_DATA? }}
    CROP_DETAILS:
    {{ CROP_DETAILS? }}

    INSTRUCTIONS:
    Review the PROFIT_ANALYSIS and suggest strategies to maximize profit, such as optimal selling times or alternative markets.
    If significant improvements can be made, use the 'append_to_state' tool to add your feedback to the field 'PROFIT_OPTIMIZATION_FEEDBACK'.
    If the profit is optimal or no further improvements can be made, use the 'exit_loop' tool.
    Explain your decision and briefly summarize the feedback you have provided.
    """,
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
    max_iterations=3,
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
    tools=[google_search],
)

weather_agent = Agent(
    name="weather_agent",
    model=model_name,
    description="Provides weather forecasts and their impact on crops.",
    instruction="""
    LOCATION:
    {{ LOCATION? }}
    CROP_DETAILS:
    {{ CROP_DETAILS? }}

    INSTRUCTIONS:
    Use the 'Google Search' tool to get the current and forecasted weather for the LOCATION.
    Analyze how the weather might impact the CROP_DETAILS and suggest necessary actions.
    Use the 'append_to_state' tool to add your weather report and impact analysis to the 'WEATHER_REPORT' field.
    """,
    tools=[google_search, append_to_state],
)

farming_new_tech_agent = Agent(
    name="farming_new_tech_agent",
    model=model_name,
    description="Suggests new farming technologies and practices.",
    instruction="""
    CROP_DETAILS:
    {{ CROP_DETAILS? }}

    INSTRUCTIONS:
    Based on the CROP_DETAILS, research and suggest new farming technologies,
    innovative practices, and sustainable agriculture methods that could improve yield or efficiency.
    Use the 'Google Search' tool for information.
    Use the 'append_to_state' tool to add your suggestions to the 'NEW_TECH_SUGGESTIONS' field.
    """,
    tools=[google_search, append_to_state],
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
    instruction="""
        - Ask the user for details about their crop (e.g., type of crop, stage of growth, location) to get started.
        - When they respond, use the 'append_to_state' tool to store the user's response in the 'CROP_DETAILS' state key and 'LOCATION' state key (if provided) and then transfer to the sub agent based on query.
    """,
    sub_agents=[
        crop_management_agent,
        weather_agent,
        gov_scheme_agent,
        mandi_price_agent,
        farming_new_tech_agent
    ],
)

root_agent = Agent(
    name="greeter",
    model=model_name,
    description="Guides the user in getting agricultural advice.",
    instruction="""
    - Welcome the user to Pratham Kisan and inform them you can provide comprehensive agricultural guidance.
    - Ask the user for details about their crop (e.g., type of crop, stage of growth, location) to get started.
    - When they respond, use the 'append_to_state' tool to store the user's response in the 'CROP_DETAILS' state key and 'LOCATION' state key (if provided) and then transfer to the 'pratham_kishan_agent'.
    """,
    tools=[append_to_state],
    sub_agents=[pratham_kishan_agent],
)