'use client';

import React, { useCallback, useRef, useState } from 'react';
import { MessageCircle, X, Send, Loader2, RotateCcw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import axiosInstance from '@/lib/axiosInstance';

type Msg = { role: 'user' | 'model'; content: string };

async function readSseStream(
  res: Response,
  onText: (t: string) => void,
): Promise<void> {
  const reader = res.body?.getReader();
  if (!reader) throw new Error('No response body');
  const dec = new TextDecoder();
  let buffer = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += dec.decode(value, { stream: true });
    const parts = buffer.split('\n\n');
    buffer = parts.pop() ?? '';
    for (const block of parts) {
      for (const line of block.split('\n')) {
        if (!line.startsWith('data:')) continue;
        const payload = line.replace(/^data:\s*/, '').trim();
        if (payload === '[DONE]') return;
        try {
          const j = JSON.parse(payload) as { text?: string; error?: string };
          if (j.error) throw new Error(j.error);
          if (j.text) onText(j.text);
        } catch {
          /* ignore partial JSON */
        }
      }
    }
  }
}

export function TravelChatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Msg[]>([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollBottom = () => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    });
  };

  const sendWithRetries = useCallback(async (text: string, history: Msg[]) => {
    setError(null);
    setPending(true);
    const userMsg: Msg = { role: 'user', content: text };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    scrollBottom();

    let assistant = '';
    setMessages((m) => [...m, { role: 'model', content: '' }]);

    const applyDelta = (delta: string) => {
      assistant += delta;
      setMessages((m) => {
        const next = [...m];
        const last = next[next.length - 1];
        if (last?.role === 'model') {
          next[next.length - 1] = { ...last, content: assistant };
        }
        return next;
      });
      scrollBottom();
    };

    const payloadHistory = [...history, userMsg]
      .slice(-12)
      .map(({ role, content }) => ({ role, content }));

    const tryStream = async () => {
      const res = await fetch('/api/v1/ai/chat/stream', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: payloadHistory }),
      });
      if (!res.ok) throw new Error(`Stream HTTP ${res.status}`);
      await readSseStream(res, applyDelta);
    };

    const tryJson = async () => {
      assistant = '';
      setMessages((m) => {
        const next = [...m];
        const last = next[next.length - 1];
        if (last?.role === 'model') next[next.length - 1] = { role: 'model', content: '' };
        return next;
      });
      const res = await axiosInstance.post('/ai/chat', {
        message: text,
        history: payloadHistory,
      });
      const reply = res.data?.data?.reply as string | undefined;
      if (!reply) throw new Error('No reply');
      applyDelta(reply);
    };

    const stripFailedAssistant = () => {
      setMessages((m) => {
        const next = [...m];
        const last = next[next.length - 1];
        if (last?.role === 'model' && !last.content) next.pop();
        return next;
      });
    };

    try {
      try {
        await tryStream();
      } catch {
        await tryJson();
      }
      setPending(false);
    } catch (e) {
      console.error(e);
      for (let i = 0; i < 2; i++) {
        try {
          await new Promise((r) => setTimeout(r, 500 * (i + 1)));
          await tryJson();
          setPending(false);
          return;
        } catch {
          /* continue */
        }
      }
      stripFailedAssistant();
      setError('Could not reach the travel assistant. Try again in a moment.');
      setPending(false);
    }
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const t = input.trim();
    if (!t || pending) return;
    const hist = messages.filter((m) => m.content.length > 0);
    void sendWithRetries(t, hist);
  };

  return (
    <>
      <button
        type="button"
        aria-label="Open travel assistant"
        onClick={() => setOpen(true)}
        className={cn(
          'fixed bottom-6 right-6 z-[90] h-14 w-14 rounded-2xl shadow-xl flex items-center justify-center',
          'bg-[#edae49] text-[#003d5b] hover:scale-105 transition-transform',
          open && 'hidden',
        )}
      >
        <MessageCircle className="w-7 h-7" />
      </button>

      {open && (
        <div
          className="fixed bottom-6 right-6 z-[90] w-[min(100vw-2rem,400px)] h-[min(85vh,560px)] flex flex-col rounded-[1.75rem] border border-border/80 bg-card shadow-2xl overflow-hidden"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/60 bg-[#001b2b] text-white">
            <span className="text-xs font-black uppercase tracking-widest">Travel assistant</span>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10 rounded-xl h-9 w-9"
                onClick={() => {
                  setMessages([]);
                  setError(null);
                }}
                aria-label="Clear chat"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10 rounded-xl h-9 w-9"
                onClick={() => setOpen(false)}
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
            {messages.length === 0 && (
              <p className="text-muted-foreground text-xs leading-relaxed">
                Ask about destinations, seasons, budgeting, or how to plan a trip. Signed-in travelers get
                context from your recent trips and preferences.
              </p>
            )}
            {messages.map((m, i) => (
              <div
                key={`${i}-${m.role}-${m.content.slice(0, 12)}`}
                className={cn(
                  'rounded-2xl px-3 py-2 max-w-[95%]',
                  m.role === 'user'
                    ? 'ml-auto bg-primary text-primary-foreground'
                    : 'mr-auto bg-muted/80 text-foreground',
                )}
              >
                {m.role === 'model' ? (
                  <div className="text-sm leading-relaxed [&_p]:mb-2 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_li]:my-0.5">
                    {m.content ? (
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                          ul: ({ children }) => <ul className="mb-2 space-y-1">{children}</ul>,
                          ol: ({ children }) => <ol className="mb-2 space-y-1">{children}</ol>,
                          strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                        }}
                      >
                        {m.content}
                      </ReactMarkdown>
                    ) : pending ? (
                      <Loader2 className="w-4 h-4 animate-spin opacity-60" />
                    ) : null}
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap">{m.content}</p>
                )}
              </div>
            ))}
            {error && <p className="text-destructive text-xs font-medium">{error}</p>}
          </div>

          <form onSubmit={onSubmit} className="p-3 border-t border-border/60 flex gap-2 bg-background/80">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything travel-related…"
              rows={2}
              className="flex-1 resize-none rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
              disabled={pending}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  onSubmit(e as unknown as React.FormEvent);
                }
              }}
            />
            <Button type="submit" disabled={pending || !input.trim()} className="rounded-xl self-end h-10 w-10 p-0">
              {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
