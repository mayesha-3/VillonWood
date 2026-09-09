import React, { useState } from 'react';
import type { VillagerProfession, ChatMessage } from './types/village';
import { X, Send, Users, Anchor, MapPin, MessageCircle } from 'lucide-react';

interface GroupChatProps {
  location: VillagerProfession | null;
  onClose: () => void;
}

export const GroupChat: React.FC<GroupChatProps> = ({ location, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(location ? location.sampleMessages : []);
  const [inputText, setInputText] = useState<string>('');

  if (!location) return null;

  const occupantsCount = location.activeOccupantsCount;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: ChatMessage = {
      id: `user-msg-${Date.now()}`,
      sender: 'Vous (voyageur)',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=YouTraveler',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: inputText.trim(),
      isUser: true
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');

    // Trigger simulated response from the master villager or shop occupant after 1 second
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
    <div className="overlay-backdrop" onClick={onClose}>
      <div className="group-chat-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="chat-modal-header">
          <div className="header-left">
            <div className="shop-icon-wrapper">
              {isBoat ? <Anchor size={24} className="boat-icon" /> : <MapPin size={24} />}
            </div>
            <div>
              <div className="shop-category">{location.category} • {location.frenchTitle}</div>
              <h2 className="shop-title">{location.structureName}</h2>
              <div className="shop-subinfo">
                <span className="occupants-badge">
                  <Users size={14} /> {occupantsCount} personnes présentes actuellement
                </span>
                <span className="master-villager">
                  Responsable : <strong>{location.characterName}</strong>
                </span>
              </div>
            </div>
          </div>

          <button className="close-modal-btn" onClick={onClose} title="Fermer la discussion du lieu">
            <X size={20} />
          </button>
        </div>

        {/* Structure Banner / Quote */}
        <div className="structure-banner">
          <img src={location.avatar} alt={location.characterName} className="banner-avatar" />
          <div className="banner-text">
            <p>"{location.defaultQuote}"</p>
            <small>{location.description}</small>
          </div>
        </div>

        {/* Live Group Chat Messages List */}
        <div className="chat-messages-container">
          <div className="chat-welcome-notice">
            <MessageCircle size={16} />
            <span>Vous êtes entré dans la discussion en direct de <strong>{location.structureName}</strong>. Dites bonjour à tout le monde !</span>
          </div>

          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`chat-bubble-wrapper ${msg.isUser ? 'user-wrapper' : 'villager-wrapper'}`}
            >
              {!msg.isUser && (
                <img src={msg.avatar} alt={msg.sender} className="chat-avatar" />
              )}
              <div className="chat-bubble">
                <div className="bubble-sender-info">
                  <span className="sender-name">{msg.sender}</span>
                  {msg.role && <span className="sender-role">{msg.role}</span>}
                  <span className="message-time">{msg.time}</span>
                </div>
                <div className="bubble-text">{msg.text}</div>
              </div>
              {msg.isUser && (
                <img src={msg.avatar} alt="Vous" className="chat-avatar user-avatar" />
              )}
            </div>
          ))}
        </div>

        {/* Message Input Bar */}
        <form onSubmit={handleSendMessage} className="chat-input-form">
          <input
            type="text"
            className="chat-input"
            placeholder={
              isBoat 
                ? "Discutez avec les personnes à bord..." 
                : `Discutez avec tout le monde à ${location.name.split('/')[0]}...`
            }
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button type="submit" className="chat-send-btn" disabled={!inputText.trim()}>
            <Send size={18} />
            <span>Envoyer</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default GroupChat;
