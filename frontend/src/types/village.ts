export interface ChatMessage {
  id: string;
  sender: string;
  avatar: string;
  time: string;
  text: string;
  role?: string;
  isUser?: boolean;
}

export interface VillagerProfession {
  id: string;
  name: string;
  frenchTitle: string;
  characterName: string;
  structureName: string;
  category: 
    | 'Food & Farming' 
    | 'Crafts & Building' 
    | 'Trades & Artisans' 
    | 'Hospitality & Nature'
    | 'Alimentation et agriculture'
    | 'Artisanat et construction'
    | 'Métiers et artisanat'
    | 'Accueil et nature';
  x: number; // relative percentage (0 - 100)
  y: number; // relative percentage (0 - 100)
  description: string;
  defaultQuote: string;
  avatar: string;
  iconName: string;
  activeOccupantsCount: number;
  sampleMessages: ChatMessage[];
}

export type ActiveOverlay = 'media' | 'ai' | 'chat' | null;
