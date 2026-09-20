import React, { useState } from 'react';
import type { VillagerProfession, ChatMessage } from './types/village';
import { X, Send, Anchor, MapPin } from 'lucide-react';

interface GroupChatProps {
  location: VillagerProfession | null;
  onClose: () => void;
}

export const GroupChat: React.FC<GroupChatProps> = ({ location, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(location ? location.sampleMessages : []);
  const [inputText, setInputText] = useState<string>('');

  if (!location) return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: ChatMessage = {
      id: `user-msg-${Date.now()}`,
      sender: 'Vous (voyageur)',
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=YouTraveler',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: inputText.trim(),
      isUser: true
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');

    setTimeout(() => {
      let replyText: string;
      if (location.id === 'baker') {
        replyText = `Ah, elles sortent du four ! Goûtez donc notre baguette au levain encore chaude pendant que vous discutez à la boulangerie !`;
      } else if (location.id === 'fisherman') {
        replyText = `À l’abordage ! Tenez-vous bien pendant que nous longeons les roseaux : nous venons de pêcher trois truites fraîches !`;
      } else if (location.id === 'blacksmith') {
        replyText = `Attention aux étincelles autour de l’enclume ! Avez-vous besoin d’armes ou de fers à cheval aujourd’hui ?`;
      } else if (location.id === 'innkeeper') {
        replyText = `Bienvenue au Sanglier d’or ! Servez-vous une chope de bière et prenez place sur un tabouret près du feu.`;
      } else if (location.id === 'barber') {
        replyText = `Prenez place dans le fauteuil ! Une serviette chaude et un parfum de romarin pour commencer la journée ?`;
      } else {
        replyText = `${location.characterName} dit : « ${location.defaultQuote} »`;
      }

      const autoReply: ChatMessage = {
        id: `reply-${Date.now()}`,
        sender: location.characterName,
        avatar: location.avatar,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: replyText,
        role: location.name
      };

      setMessages((prev) => [...prev, autoReply]);
    }, 1000);
  };

  const isBoat = location.id === 'fisherman';

  return (
    <div 
      className="overlay-backdrop place-chat-overlay" 
      onClick={onClose}
      style={{
        backgroundImage: location.bgImage 
          ? `linear-gradient(rgba(239, 223, 208, 0.18), rgba(211, 162, 113, 0.35)), url(${location.bgImage})` 
          : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="floating-chat-container" onClick={(e) => e.stopPropagation()}>
        {/* Minimal Floating Top Header */}
        <div className="minimal-chat-header">
          <div className="header-info-pill">
            <div className="place-icon-badge">
              {isBoat ? <Anchor size={18} /> : <MapPin size={18} />}
            </div>
            <div className="place-titles">
              <h2 className="minimal-place-name">{location.structureName}</h2>
              <div className="minimal-sub">
                <span className="online-dot" />
                <span>{location.activeOccupantsCount} en ligne</span>
                <span className="dot-sep">•</span>
                <span>Responsable: {location.characterName}</span>
              </div>
            </div>
          </div>

          <button className="minimal-close-btn" onClick={onClose} title="Fermer la discussion">
            <X size={18} />
          </button>
        </div>

        {/* High-Readability Floating Conversation Area */}
        <div className="floating-chat-messages">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`floating-bubble-row ${msg.isUser ? 'is-user' : 'is-villager'}`}
            >
              {!msg.isUser && (
                <img src={msg.avatar} alt={msg.sender} className="floating-avatar" />
              )}
              <div className="floating-bubble-content">
                <div className="floating-bubble-meta">
                  <span className="floating-sender">{msg.sender}</span>
                  {msg.role && <span className="floating-role">{msg.role}</span>}
                  <span className="floating-time">{msg.time}</span>
                </div>
                <div className="floating-bubble-text">{msg.text}</div>
              </div>
              {msg.isUser && (
                <img src={msg.avatar} alt="Vous" className="floating-avatar" />
              )}
            </div>
          ))}
        </div>

        {/* Floating Messenger Input Bar */}
        <form onSubmit={handleSendMessage} className="floating-chat-input-form">
          <input
            type="text"
            className="floating-chat-input"
            placeholder={`Discutez avec tout le monde à ${location.name}...`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button type="submit" className="floating-send-btn" disabled={!inputText.trim()}>
            <Send size={16} />
            <span>Envoyer</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default GroupChat;
