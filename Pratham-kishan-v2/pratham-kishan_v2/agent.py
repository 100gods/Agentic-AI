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
from .sub_agents.crop_management_loop import crop_agent
from .sub_agents.gov_schema_loop import gov_scheme_agent
from .sub_agents.mandi_price_loop import mandi_price_loop
from .sub_agents.farming_tech import farming_tech_sub_agent
from .sub_agents.weather import weather_sub_agent
#from .sub_agents import crop_management_loop, gov_schema_loop, mandi_price_loop,weather_sub_agent,farming_tech_sub_agent

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
    instruction=prompt.PRATHAM_KISHAN_INSTRUCTION,  # Assuming a new prompt for framer
    output_key="framer_advisor_output",
    tools=[
        AgentTool(agent=crop_agent),
        AgentTool(agent=gov_scheme_agent),
        AgentTool(agent=mandi_price_loop),
        AgentTool(agent=farming_tech_sub_agent),
        AgentTool(agent=weather_sub_agent),
    ],
)

root_agent = farmer_advisor