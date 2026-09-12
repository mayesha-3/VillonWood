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

export const Chatbot: React.FC<ChatbotProps> = ({
  isOpen,
  onClose,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'ai-welcome',
      sender: 'ai',
      text: 'Salutations ! 🏰 I am Villon AI — your bilingual village guide & translator. Ask me anything in English or French!',
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

  const handleSend = (textOverride?: string) => {
    const text = textOverride || inputText;
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textOverride) setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const lower = text.toLowerCase();
      let reply = '';

if (
  lower.includes("bakery") ||
  lower.includes("boulangerie") ||
  lower.includes("bread") ||
  lower.includes("pain")
) {
  reply = `🥖 Le boulanger prépare du pain frais chaque matin.
=> The baker prepares fresh bread every morning.

le boulanger => the baker
prépare => prepares
du pain frais => fresh bread
chaque matin => every morning`;
} else if (
  lower.includes("boat") ||
  lower.includes("bateau") ||
  lower.includes("river") ||
  lower.includes("rivière")
) {
  reply = `⚓ Le capitaine navigue en bateau sur la rivière.
=> The captain sails by boat on the river.

le capitaine => the captain
navigue => navigates / sails
en bateau => by boat
sur la rivière => on the river`;
} else if (
  lower.includes("wine") ||
  lower.includes("vin") ||
  lower.includes("vineyard") ||
  lower.includes("vignoble")
) {
  reply = `🍷 Nous dégustons du bon vin dans le vignoble.
=> We are tasting good wine in the vineyard.

nous dégustons => we taste / we are tasting
du bon vin => good wine
dans => in
le vignoble => the vineyard`;
} else if (
  lower.includes("hello") ||
  lower.includes("bonjour") ||
  lower.includes("hi") ||
  lower.includes("salut")
) {
  reply = `👋 Bonjour monsieur le maire, bienvenue au village !
=> Hello Mr. Mayor, welcome to the village!

bonjour => hello / good morning
monsieur => mister / sir
le maire => the mayor
bienvenue => welcome
au village => to the village`;
} else if (
  lower.includes("translate") ||
  lower.includes("traduire") ||
  lower.includes("comment dit")
) {
  reply = `🌐 Pouvez-vous traduire cette phrase s'il vous plaît ?
=> Can you translate this sentence please?

pouvez-vous => can you
traduire => to translate
cette phrase => this sentence
s'il vous plaît => please`;
} else if (
  lower.includes("forge") ||
  lower.includes("blacksmith") ||
  lower.includes("forgeron")
) {
  reply = `🔨 Le forgeron travaille le fer chaud dans sa forge.
=> The blacksmith works hot iron in his forge.

le forgeron => the blacksmith
travaille => works
le fer chaud => hot iron
dans sa forge => in his forge`;
} else {
  reply = `🏡 Je visite un joli village aujourd'hui.
=> I am visiting a pretty village today.

je visite => I visit / I am visiting
un joli village => a pretty village
aujourd'hui => today`;
}

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setIsTyping(false);
      setMessages((prev) => [...prev, aiMsg]);
    }, 1200);
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
                <p className="vai-bubble-text">{m.text}</p>
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
          { emoji: '🥖', text: 'Where is the bakery?' },
          { emoji: '🍷', text: 'Translate: wine' },
          { emoji: '👋', text: 'Bonjour !' },
          { emoji: '⚓', text: 'Tell me about the river' },
        ].map((p, i) => (
          <button key={i} type="button" className="vai-prompt-chip" onClick={() => handleSend(`${p.emoji} ${p.text}`)}>
            <span className="vai-chip-emoji">{p.emoji}</span>
            <span>{p.text}</span>
          </button>
        ))}
      </div>

      {/* INPUT */}
      <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="vai-input-bar">
        <input type="text" className="vai-input" placeholder="Type in English or French..." value={inputText} onChange={(e) => setInputText(e.target.value)} />
        <button type="submit" className="vai-send-btn" disabled={!inputText.trim()} title="Send"><Send size={16} /></button>
      </form>
    </div>
  );
};

export default Chatbot;