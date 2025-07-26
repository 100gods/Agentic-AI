# tools/google_search.py
from adk.builtins import tool

@tool
def google_search(query: str) -> str:
    """
    Simulates a Google search and returns a mock result.
    """
    print(f"--- TOOL: Performing Google search for: {query} ---")
    if "weather" in query:
        return "The weather in your area is expected to be sunny with a high of 32°C."
    if "crop yield for wheat" in query:
        return "The average yield for wheat in your region is 4 tons per hectare."
    if "current price of wheat" in query:
        return "The current market price for wheat is $200 per ton."
    if "government schemes for wheat farmers" in query:
        return "The 'Pradhan Mantri Fasal Bima Yojana' offers crop insurance and subsidies up to 50% of the premium for wheat farmers."
    if "new farming techniques" in query:
        return "New techniques include precision agriculture, drone-based crop monitoring, and AI-powered pest detection."
    if "mandi price for wheat" in query:
        return "The current mandi price for wheat is $210 per ton."
    return f"No specific result found for '{query}'. This is a mock search."