# main.py
import asyncio
from root_agent import PrathamKishan

"""
async def main():
     """
"""
    Main function to run the Pratham Kishan agent.
     """
"""
    pratham_kishan_agent = PrathamKishan()

    # Initial context for the farmer
    initial_context = {
        "crop": "wheat",
        "location": "Punjab, India",
        "demographics": "Small-scale farmer, 5 acres of land"
    }

    await pratham_kishan_agent(initial_context)


if __name__ == "__main__":
    # This ensures that the event loop is managed correctly
    try:
        loop = asyncio.get_running_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)

    loop.run_until_complete(main()) """
