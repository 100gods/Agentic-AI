# Copyright 2025 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""Pratham Kishan: provide framer assistenace"""

from google.adk.agents import LlmAgent
from google.adk.tools.agent_tool import AgentTool

from . import prompt
from .sub_agents.crop_management import crop_management_agent
from .sub_agents.gov_scheme import gov_scheme_agent
from .sub_agents.market_information import market_information_agent
from .sub_agents.farming_tech import farming_tech_agent
from .sub_agents.weather_information import weather_information_agent


MODEL = "gemini-2.0-flash-lite"


farmer_advisor = LlmAgent(
    name="pratham_kishan_framer_advisor",  # Changed name
    model=MODEL,
    description=(
        "guide users through a structured process to receive farming "
        "advice by orchestrating a series of expert subagents. help them "
        "with crop management, government schemes, market information, "
        "farming technologies, and weather forecasts."  # Changed description
    ),
    instruction=prompt.PRATHAM_KISHAN_FRAMER_PROMPT,  # Assuming a new prompt for framer
    output_key="framer_advisor_output",
    tools=[
        AgentTool(agent=crop_management_agent),
        AgentTool(agent=gov_scheme_agent),
        AgentTool(agent=market_information_agent),
        AgentTool(agent=farming_tech_agent),
        AgentTool(agent=weather_information_agent),
    ],
)

root_agent = farmer_advisor