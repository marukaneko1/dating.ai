import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ProfileData {
  firstName: string;
  age: number;
  gender: string;
  bio?: string;
  location?: string;
  interestedIn: string[];
  promptAnswers: Array<{
    prompt: { text: string; category: string | null };
    answer: string;
  }>;
}

export const generateProfileInsight = async (profileData: ProfileData): Promise<string> => {
  try {
    // Build the prompt for ChatGPT
    const promptText = buildPrompt(profileData);

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert relationship psychologist and dating coach. Analyze dating profiles to provide deep, insightful character assessments that help people understand themselves and find meaningful connections. Be warm, empathetic, and perceptive.',
        },
        {
          role: 'user',
          content: promptText,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return completion.choices[0]?.message?.content || 'Unable to generate insight at this time.';
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('Failed to generate AI insight');
  }
};

function buildPrompt(profile: ProfileData): string {
  let prompt = `Analyze this dating profile and provide a detailed, insightful description of this person. Focus on their personality, values, emotional patterns, and what makes them unique. Infer deeper characteristics from the information provided.\n\n`;

  prompt += `**Basic Information:**\n`;
  prompt += `- Name: ${profile.firstName}\n`;
  prompt += `- Age: ${profile.age}\n`;
  prompt += `- Gender: ${profile.gender}\n`;
  prompt += `- Looking for: ${profile.interestedIn.join(', ')}\n`;
  
  if (profile.location) {
    prompt += `- Location: ${profile.location}\n`;
  }
  
  if (profile.bio) {
    prompt += `\n**Bio:** ${profile.bio}\n`;
  }

  if (profile.promptAnswers && profile.promptAnswers.length > 0) {
    prompt += `\n**Their Answers to Key Questions:**\n`;
    profile.promptAnswers.forEach((answer, index) => {
      prompt += `\n${index + 1}. "${answer.prompt.text}"\n`;
      prompt += `   Answer: "${answer.answer}"\n`;
    });
  }

  prompt += `\n**Your Task:**\n`;
  prompt += `Using all the information above, give me a detailed description of this person. Include:\n`;
  prompt += `1. Core personality traits and characteristics\n`;
  prompt += `2. Emotional patterns and how they handle relationships\n`;
  prompt += `3. Values and what matters most to them\n`;
  prompt += `4. Potential strengths in a relationship\n`;
  prompt += `5. What kind of partner might be a good match\n`;
  prompt += `6. Any insights into their emotional maturity and self-awareness\n\n`;
  prompt += `Be specific, empathetic, and insightful. Write in a warm, professional tone as if you're a relationship counselor who deeply understands this person.`;

  return prompt;
}

// Test function to verify OpenAI connection
export const testOpenAIConnection = async (): Promise<boolean> => {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: 'Say "OpenAI connection successful!"',
        },
      ],
      max_tokens: 20,
    });

    console.log('✅ OpenAI Test Response:', completion.choices[0]?.message?.content);
    return true;
  } catch (error) {
    console.error('❌ OpenAI Connection Failed:', error);
    return false;
  }
};

