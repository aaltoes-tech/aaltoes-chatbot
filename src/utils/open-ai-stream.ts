export interface ChatGPTMessage{
    role: 'user' | 'assistant' | "system",
    content: string,
}
export interface OpenAIStreamPayload {
    model: string; 
    messages: ChatGPTMessage[];
    temperature: number;
    top_p: number;
    frequency_penalty: number;
    presence_penalty: number;   
    max_tokens: number;
    stream: boolean;
    n: number;
}

export async function OpenAIStream(payload: OpenAIStreamPayload){

}