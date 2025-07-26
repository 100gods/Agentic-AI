# root_agent/agent.py
from google.adk.agents import ParallelAgent,Agent,LlmAgent
from .sub_agents import crop_management_loop, gov_schema_loop, mandi_price_loop,weather_sub_agent,farming_tech_sub_agent


MODEL = "gemini-2.0-flash"

class PrathamKishan(Agent):
    """
    The root agent that orchestrates all other sub-agents.
    """
    def __init__(self):
        super().__init__(
            name = "pratham_kishan",
            instruction="""
            You are Pratham Kishan, an AI assistant for farmers.
            You have a team of specialized agents to help with various tasks.
            Coordinate your agents to provide a comprehensive report to the farmer.
            The farmer has provided the following details:
            Crop: {crop}
            Location: {location}
            Demographics: {demographics}

            Delegate tasks to your sub-agents in parallel where possible.
            1. Get crop management advice.
            2. Get the weather report.
            3. Find government schemes.
            4. Research new farming technologies.
            5. Get the latest mandi prices.

            Synthesize all the information into a final, consolidated report.
            """
        )

    async def __call__(self, context: dict = None, **kwargs):
        print("--- Pratham Kishan is starting its work... ---")

        # Run sub-agents in parallel
        results = await parallel(
            crop_management_loop(context={"crop": context.get("crop")}),
            weather_sub_agent(context={"location": context.get("location")}),
            gov_schema_loop(context={"crop": context.get("crop"), "yield": "4 tons per hectare", "demographics": context.get("demographics")}),
            farming_tech_sub_agent(),
            mandi_price_loop(context={"crop": context.get("crop"), "yield": "4 tons per hectare"})
        )(context)

        # Combine the results from all agents
        final_report_context = {
            "crop_management_report": results[0].get('content'),
            "weather_report": results[1].get('content'),
            "gov_schema_report": results[2].get('content'),
            "farming_tech_report": results[3].get('content'),
            "mandi_price_report": results[4].get('content'),
        }

        # Generate the final synthesized report
        final_report_prompt = """
        Synthesize the following reports from your expert agents into a single, easy-to-read report for the farmer.

        Crop Management Advice:
        {crop_management_report}

        Weather Report:
        {weather_report}

        Government Schemes Report:
        {gov_schema_report}

        New Farming Technologies Report:
        {farming_tech_report}

        Mandi Price Report:
        {mandi_price_report}
        """

        final_report_agent = LlmAgent(name = "final_report_agent", instruction=final_report_prompt)
        final_report = await final_report_agent(final_report_context)

        print("\n--- Pratham Kishan's Final Report ---")
        print(final_report.get('content'))
        return final_report