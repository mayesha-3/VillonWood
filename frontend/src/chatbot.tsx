import React, { useState } from 'react';
import { X, Bot, Send, Sparkles, HelpCircle, MapPin } from 'lucide-react';
import { VILLAGERS_DATA } from './data/villagers';

interface ChatbotProps {
  onClose: () => void;
  onNavigateToLocation?: (locationId: string) => void;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
  suggestedAction?: { label: string; locationId: string };
}

export const Chatbot: React.FC<ChatbotProps> = ({ onClose, onNavigateToLocation }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'ai-welcome',
      sender: 'ai',
      text: 'Salutations, voyageur ! Je suis Villon IA, l’oracle artificiel et le guide de l’ancien VillonWood. Demandez-moi ce que vous voulez sur les 20 métiers du village, les discussions de lieux ou l’histoire du village !',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');

  const quickPrompts = [
    'Où se trouve la discussion de la boulangerie ?',
    'Qui se trouve actuellement sur le bateau ?',
    'Lister les 20 métiers anciens du village',
    'Où se trouve la forge du forgeron ?'
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `user-${crypto.randomUUID()}`,
      sender: 'user',
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');

    // Generate intelligent AI response
    setTimeout(() => {
      let replyText: string;
      let action: { label: string; locationId: string } | undefined = undefined;

      const lower = text.toLowerCase();

      if (lower.includes('bateau') || lower.includes('rivière') || lower.includes('poisson')) {
        replyText = 'Le bateau et le quai de pêche sont dirigés par le capitaine Jean ! Cliquez sur le repère du bateau pour ouvrir la discussion en direct et parler à tout l’équipage.';
        action = { label: 'Voir le bateau', locationId: 'fisherman' };
      } else if (lower.includes('boulangerie') || lower.includes('pain') || lower.includes('boulanger')) {
        replyText = 'Jean-Luc Boulanger dirige la boulangerie en pierre près du centre ! Les pains au levain sortent tout juste des fours à bois.';
        action = { label: 'Voir la boulangerie', locationId: 'baker' };
      } else if (lower.includes('forge') || lower.includes('forgeron') || lower.includes('fer')) {
        replyText = 'Le maître Vulcain travaille dans la grande forge du village. Il fabrique des outils, des fers à cheval et des lames.';
        action = { label: 'Voir la forge', locationId: 'blacksmith' };
      } else if (lower.includes('20') || lower.includes('métier') || lower.includes('villageois')) {
        const listStr = VILLAGERS_DATA.map((v, i) => `${i + 1}. ${v.name} (${v.characterName})`).join('\n');
        replyText = `Voici les 20 métiers de l’ancien village français :\n\n${listStr}`;
      } else {
        replyText = `VillonWood compte 20 lieux de villageois répartis sur la carte. Cliquez sur un bâtiment pour rejoindre sa discussion en direct, ou activez le mode coordonnées dans la barre supérieure !`;
      }

      const aiMsg: Message = {
        id: `ai-${crypto.randomUUID()}`,
        sender: 'ai',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedAction: action
      };

      setMessages((prev) => [...prev, aiMsg]);
    }, 700);
  };

  return (
    <div className="overlay-backdrop" onClick={onClose}>
      <div className="chatbot-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="ai-header">
          <div className="ai-brand">
            <div className="ai-bot-avatar">
              <Bot size={26} />
              <Sparkles className="sparkle-badge" size={12} />
            </div>
            <div>
              <h2>Villon AI Assistant</h2>
              <p>Intelligence & Guide for Ancient Villon Wood</p>
            </div>
          </div>
          <button className="close-modal-btn" onClick={onClose} title="Fermer Villon IA">
            <X size={20} />
          </button>
        </div>

        {/* Quick Prompts Bar */}
        <div className="quick-prompts-row">
          <span className="prompts-label"><HelpCircle size={14} /> Essayez de demander :</span>
          {quickPrompts.map((prompt, idx) => (
            <button key={idx} className="prompt-pill-btn" onClick={() => handleSend(prompt)}>
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat Messages */}
        <div className="ai-messages-list">
          {messages.map((m) => (
            <div key={m.id} className={`ai-bubble-wrapper ${m.sender === 'user' ? 'user' : 'ai'}`}>
              {m.sender === 'ai' && (
                <div className="ai-msg-icon"><Bot size={18} /></div>
              )}
              <div className="ai-bubble">
                <div className="ai-msg-header">
                  <span>{m.sender === 'ai' ? 'Villon IA' : 'Vous'}</span>
                  <span className="ai-time">{m.time}</span>
                </div>
                <div className="ai-msg-text" style={{ whiteSpace: 'pre-line' }}>{m.text}</div>

                {m.suggestedAction && onNavigateToLocation && (
                  <button 
                    className="ai-action-btn"
                    onClick={() => {
                      onNavigateToLocation(m.suggestedAction!.locationId);
                      onClose();
                    }}
                  >
                    <MapPin size={14} />
                    <span>{m.suggestedAction.label}</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }} 
          className="ai-input-form"
        >
          <input
            type="text"
            className="ai-input"
            placeholder="Demandez à Villon IA un renseignement sur un villageois, un lieu ou le bateau..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button type="submit" className="ai-send-btn" disabled={!inputText.trim()}>
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;