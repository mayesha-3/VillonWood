import type { ChatMessage, VillagerProfession } from '../types/village';

export interface GroupChatCompanion {
  name: string;
  avatar: string;
  personality: string;
  welcome: { fr: string; en: string };
}

export interface GroupChatCompanionReply {
  fr: string;
  en: string;
}

const companions: Record<string, GroupChatCompanion> = {
  city_central: {
    name: 'Louise',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=LouisePlace',
    personality: 'Warm, curious, and lightly witty. She enjoys the fountain, market stalls, village festivals, and hearing what friends are doing.',
    welcome: {
      fr: 'Salut tout le monde ! Je prends un petit moment près de la fontaine. Quoi de neuf au village ?',
      en: 'Hi everyone! I’m taking a little break by the fountain. What’s new in the village?'
    }
  },
  cybercafe: {
    name: 'Camille',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=CamilleCyber',
    personality: 'Upbeat, relaxed, and a little nerdy. She loves music, old computers, online games, and chatting with friends at the cybercafé.',
    welcome: {
      fr: 'Coucou ! Je garde le poste près de la fenêtre. Tu écoutes quoi comme musique en ce moment ?',
      en: 'Hey! I’m saving the computer by the window. What music are you listening to these days?'
    }
  }
};

export function getGroupChatCompanion(location: VillagerProfession): GroupChatCompanion | null {
  return companions[location.id] ?? null;
}

export async function askGroupChatCompanion(
  location: VillagerProfession,
  _companion: GroupChatCompanion,
  history: ChatMessage[],
  username: string
): Promise<GroupChatCompanionReply> {
  const response = await fetch('/api/group-chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      locationId: location.id,
      username,
      history: history.slice(-12).map((message) => ({
        role: message.isUser ? 'user' : 'assistant',
        content: message.isUser
          ? `${message.sender}: ${message.text}`
          : JSON.stringify({ fr: message.text, en: message.englishTranslation || '' })
      }))
    })
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'The group chat companion could not reply.');
  if (typeof data.fr !== 'string' || typeof data.en !== 'string') {
    throw new Error('The group chat companion returned an invalid bilingual reply.');
  }
  return { fr: data.fr.trim(), en: data.en.trim() };
}
