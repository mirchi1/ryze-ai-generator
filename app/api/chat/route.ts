import { NextResponse } from 'next/server';
import { SYSTEM_RULES } from '@/lib/constants';

// NOTE: You will need to install 'openai' (npm install openai) 
// or use your preferred LLM provider here.
export async function POST(req: Request) {
  try {
    const { prompt, currentCode } = await req.json();

    // --- STEP 1: THE PLANNER ---
    // Goal: Decide which components to use based on user intent.
    const planPrompt = `User wants: ${prompt}. 
    Current UI: ${currentCode}. 
    Create a plan: which Ryze components will you use and why?`;

    // --- STEP 2: THE GENERATOR ---
    // Goal: Convert the plan into deterministic React code.
    const generatorPrompt = `${SYSTEM_RULES} 
    Based on the plan, generate ONLY the code.`;

    // --- STEP 3: THE EXPLAINER ---
    // Goal: Explain decisions in plain English.
    const explanationPrompt = `Explain why you chose this layout and these components.`;

    /** * FOR THE ASSIGNMENT: 
     * You would call your LLM (like OpenAI) three times here, 
     * or use a chain of thought. 
     */

    // MOCK RESPONSE (This simulates what the AI would return)
    const aiGeneratedCode = `
<RyzeCard title="AI Dashboard">
  <RyzeInput label="Search" placeholder="Look for something..." />
  <RyzeButton label="Search Now" variant="primary" />
</RyzeCard>`.trim();

    return NextResponse.json({
      plan: "Selected RyzeCard as container, RyzeInput for search, and RyzeButton for action.",
      code: aiGeneratedCode,
      explanation: "I used a card to group the search elements for better visual hierarchy."
    });

  } catch (error) {
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}