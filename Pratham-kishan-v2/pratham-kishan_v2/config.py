# config.py
import os
from adk.llms.google import Gemini

# Set up the Gemini LLM
# It's recommended to set the API key in your environment variables
# For example: export GEMINI_API_KEY="YOUR_API_KEY"
""" if "GEMINI_API_KEY" not in os.environ:
    print("Error: GEMINI_API_KEY environment variable not set.")
    exit() """

llm = Gemini()