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

async function translate(text: string): Promise<string> {
  try {
    const res = await fetch('/api/translate', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return data.error || 'Could not translate that text. Please try again.';
    }

    const data = await res.json();
    return typeof data.translation === 'string' ? data.translation : 'Could not translate that text. Please try again.';
  } catch (err) {
    console.error('Translator request failed:', err);
    return 'Could not reach the translation service. Make sure the app server is running.';
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
      text: 'Bonjour ! Send me any English or French text, and I will translate it into the other language.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },
    {
      id: 'ai-tip',
      sender: 'ai',
      text: 'English → French • Français → anglais',
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

    setMessages((prev) => [...prev, userMsg]);
    if (!textOverride) setInputText('');
    setIsTyping(true);

    const reply = await translate(userMsg.text);

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
              <span>Translation only • English ↔ Français</span>
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
          { label: 'English → French', text: 'Good morning, how are you today?' },
          { label: 'Français → anglais', text: 'Bonjour, comment allez-vous aujourd’hui ?' },
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
