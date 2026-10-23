import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Bot,
  Send,
  Sparkles,
  Minimize2,
  Globe,
  Languages,
} from 'lucide-react';

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
}

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

const SYSTEM_PROMPT = `You are Villon AI — an expert French language tutor and bilingual village guide in the medieval village of VillonWood. You help learners understand French through immersive, context-rich explanations.

When the user asks about a French word, phrase, or topic:
1. Provide a relevant French sentence naturally related to the topic.
2. Show the full translation using "=>" (e.g., "La boulangerie est au coin de la rue. => The bakery is at the corner of the street.")
3. Break down key words/phrases with aligned translations, each on its own line (e.g., "la boulangerie => the bakery")

When the user writes in French, help them understand what they said and gently correct any mistakes.
When the user greets you, respond warmly in French with a translation.

Keep responses concise (under 150 words). Stay in character as a friendly village tutor. Do not use markdown formatting — just plain text with "=>" for translations.`;

async function queryGroq(conversationHistory: Message[]): Promise<string> {
  if (!GROQ_API_KEY || GROQ_API_KEY === 'your_groq_api_key_here') {
    return 'Villon AI is not configured yet. Please add your free Groq API key to the .env file (VITE_GROQ_API_KEY). Get one at console.groq.com';
  }

  const apiMessages = [
    { role: 'system' as const, content: SYSTEM_PROMPT },
    ...conversationHistory.slice(-10).map(m => ({
      role: (m.sender === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
      content: m.text
    }))
  ];

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "qwen/qwen3.8-27b",
        messages: apiMessages,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      console.error('Groq API error:', res.status, errData);
      if (res.status === 429) {
        return 'The AI is a bit busy right now — too many requests. Please wait a moment and try again.';
      }
      return 'Something went wrong connecting to the AI. Please try again in a moment.';
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content || 'I could not generate a response. Please try again.';
  } catch (err) {
    console.error('Groq fetch error:', err);
    return 'Could not reach the AI service. Please check your internet connection and try again.';
  }
}

export const Chatbot: React.FC<ChatbotProps> = ({
  isOpen,
  onClose,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'ai-welcome',
      sender: 'ai',
      text: 'Salutations ! I am Villon AI — your bilingual village guide & translator. Ask me anything in English or French!',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },
    {
      id: 'ai-tip',
      sender: 'ai',
      text: 'Try asking: "Where is the bakery?" or "Comment dit-on bread en français?"',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleSend = async (textOverride?: string) => {
    const text = textOverride || inputText;
    if (!text.trim() || isTyping) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    if (!textOverride) setInputText('');
    setIsTyping(true);

    // Call Groq AI
    const reply = await queryGroq(updatedMessages);

    const aiMsg: Message = {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      text: reply,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setIsTyping(false);
    setMessages((prev) => [...prev, aiMsg]);
  };

  return (
    <div className="villon-ai-widget" onClick={(e) => e.stopPropagation()}>
      {/* HEADER */}
      <div className="vai-header">
        <div className="vai-header-left">
          <div className="vai-avatar-ring">
            <div className="vai-avatar">
              <Bot size={20} />
              <Sparkles size={10} className="vai-sparkle" />
            </div>
            <span className="vai-online-dot" />
          </div>
          <div className="vai-header-info">
            <h3 className="vai-title">Villon AI</h3>
            <p className="vai-subtitle">
              <Globe size={10} />
              <span>English ↔ Français • En ligne</span>
            </p>
          </div>
        </div>
        <div className="vai-header-actions">
          <button className="vai-header-btn" onClick={onClose} title="Minimize"><Minimize2 size={14} /></button>
          <button className="vai-header-btn vai-close-btn" onClick={onClose} title="Close"><X size={15} /></button>
        </div>
      </div>

      {/* LANGUAGE BADGE BAR */}
      <div className="vai-lang-bar">
        <div className="vai-lang-badge"><Languages size={12} /><span>Traducteur bilingue</span></div>
        <div className="vai-lang-badge vai-lang-active"><span>EN ↔ FR</span></div>
      </div>

      {/* MESSAGES */}
      <div className="vai-messages">
        {messages.map((m) => (
          <div key={m.id} className={`vai-msg ${m.sender === 'user' ? 'vai-msg-user' : 'vai-msg-ai'}`}>
            {m.sender === 'ai' && (<div className="vai-msg-avatar"><Bot size={14} /></div>)}
            <div className="vai-bubble-wrap">
              <div className={`vai-bubble ${m.sender === 'user' ? 'vai-bubble-user' : 'vai-bubble-ai'}`}>
                <p className="vai-bubble-text" style={{ whiteSpace: 'pre-wrap' }}>{m.text}</p>
              </div>
              <span className="vai-msg-time">{m.time}</span>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="vai-msg vai-msg-ai">
            <div className="vai-msg-avatar"><Bot size={14} /></div>
            <div className="vai-bubble vai-bubble-ai vai-typing-bubble">
              <div className="vai-typing-dots"><span /><span /><span /></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* QUICK PROMPTS */}
      <div className="vai-quick-prompts">
        {[
          { label: 'Where is the bakery?', text: 'Where is the bakery?' },
          { label: 'Translate: wine', text: 'Translate the word "wine" to French and explain it' },
          { label: 'Bonjour !', text: 'Bonjour !' },
          { label: 'Village life', text: 'Tell me about daily life in a French village' },
        ].map((p, i) => (
          <button key={i} type="button" className="vai-prompt-chip" onClick={() => handleSend(p.text)}>
            <span>{p.label}</span>
          </button>
        ))}
      </div>

      {/* INPUT */}
      <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="vai-input-bar">
        <input type="text" className="vai-input" placeholder="Type in English or French..." value={inputText} onChange={(e) => setInputText(e.target.value)} disabled={isTyping} />
        <button type="submit" className="vai-send-btn" disabled={!inputText.trim() || isTyping} title="Send"><Send size={16} /></button>
      </form>
    </div>
  );
};

export default Chatbot;