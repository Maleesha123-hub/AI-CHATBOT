import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: import.meta.env.VITE_DEEPSEEK_AI_API_KEY,
    baseURL: 'https://api.deepseek.com',
    dangerouslyAllowBrowser: true
});

export class Assistant {

    #model

    constructor(model = "deepseek-chat") {
        this.#model = model
    }

    async chat(content, history) {
        try {
            const result = await openai.chat.completions.create({
                model: this.#model,
                messages: [...history, { content, role: 'user' }]
            })

            return result.choices[0].message.content;

        } catch (error) {
            throw new Error(error);
        }
    }

    async *chatStream(content, history) {
        try {
            const result = await openai.chat.completions.create({
                model: this.#model,
                messages: [...history, { content, role: 'user' }],
                stream: true,
            })

            for await (const chunk of result) {
                yield chunk.choices[0]?.delta?.content || "";
            }

            return result.choices[0].message.content;

        } catch (error) {
            throw new Error(error);
        }
    }
}