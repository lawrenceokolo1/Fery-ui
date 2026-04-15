import EventEmitter from "events";
import SSE from "../utils/sse";
import { OpenAIMessage, Parameters } from "./types";

export const defaultModel = 'claude-haiku';

function feryHeaders(): Record<string, string> {
    const h: Record<string, string> = { "Content-Type": "application/json" };
    const key = import.meta.env.VITE_FERY_API_KEY as string | undefined;
    if (key) {
        h["X-API-Key"] = key;
    }
    return h;
}

export function isProxySupported() {
    return true;
}

export interface OpenAIResponseChunk {
    id?: string;
    done: boolean;
    choices?: {
        delta: {
            content: string;
        };
        index: number;
        finish_reason: string | null;
    }[];
    model?: string;
}

export async function createChatCompletion(messages: OpenAIMessage[], parameters: Parameters): Promise<string> {
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
    if (!lastUserMessage) {
        return '';
    }

    const response = await fetch('/api/v1/ask', {
        method: "POST",
        headers: feryHeaders(),
        body: JSON.stringify({
            question: lastUserMessage.content,
            stream: false,
        }),
    });

    if (!response.ok) {
        const text = await response.text();
        let msg = text || response.statusText || `HTTP ${response.status}`;
        try {
            const err = JSON.parse(text) as { detail?: string };
            if (err.detail) {
                msg = err.detail;
            }
        } catch {
            /* body is not JSON */
        }
        throw new Error(msg);
    }

    const data = await response.json();
    return data.answer || '';
}

export async function createStreamingChatCompletion(messages: OpenAIMessage[], parameters: Parameters) {
    const emitter = new EventEmitter();

    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
    if (!lastUserMessage) {
        setTimeout(() => emitter.emit('error', 'No user message found'), 0);
        return { emitter, cancel: () => {} };
    }

    const eventSource = new SSE('/api/v1/ask', {
        method: "POST",
        headers: feryHeaders(),
        payload: JSON.stringify({
            question: lastUserMessage.content,
            stream: true,
        }),
    }) as SSE;

    let contents = '';

    eventSource.addEventListener('error', (event: any) => {
        if (!contents) {
            let error = event.data;
            try {
                error = JSON.parse(error).detail || error;
            } catch (e) {}
            emitter.emit('error', error);
        }
    });

    eventSource.addEventListener('message', async (event: any) => {
        try {
            const parsed = JSON.parse(event.data);

            if (parsed.done) {
                emitter.emit('done', {
                    sources: parsed.sources || [],
                    session_id: parsed.session_id,
                    tool_calls: parsed.tool_calls || [],
                });
                return;
            }

            if (parsed.text) {
                contents += parsed.text;
                emitter.emit('data', contents);
            }
        } catch (e) {
            console.error('Failed to parse SSE chunk:', e);
        }
    });

    eventSource.stream();

    return {
        emitter,
        cancel: () => eventSource.close(),
    };
}

export const maxTokensByModel = {
    "claude-haiku": 4096,
};
