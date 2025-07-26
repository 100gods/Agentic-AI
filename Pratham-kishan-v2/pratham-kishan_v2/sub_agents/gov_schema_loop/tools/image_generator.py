# tools/image_generator.py
from adk.builtins import tool

@tool
async def generate_image_icon(prompt: str) -> str:
    """
    Simulates generating an image icon based on a prompt.
    """
    print(f"--- TOOL: Generating image icon for: {prompt} ---")
    return f"[ICON: {prompt.replace(' ', '_').lower()}.png]"
