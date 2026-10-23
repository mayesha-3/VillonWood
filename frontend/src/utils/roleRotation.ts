// 24-Hour GMT Role Rotation Utility for VillonWood

export interface RoleInfo {
  id: string;
  title: string;
  frenchTitle: string;
  iconName: string;
  description: string;
  badgeColor: string;
}

export const VILLON_ROLES: RoleInfo[] = [
  {
    id: 'baker',
    title: 'Chef Boulanger',
    frenchTitle: 'Le Boulanger du Village',
    iconName: 'Cake',
    description: 'Façonne les pains au levain et cuit la première fournée pour les habitants.',
    badgeColor: '#c46238'
  },
  {
    id: 'blacksmith',
    title: 'Maître Forgeron',
    frenchTitle: 'Le Forgeron des Lames',
    iconName: 'Flame',
    description: 'Bat le fer rougeoyant à l’enclume pour créer armes, fers et outils.',
    badgeColor: '#b91c1c'
  },
  {
    id: 'vigneron',
    title: 'Vigneron des Coteaux',
    frenchTitle: 'Le Maître de Chais',
    iconName: 'Wine',
    description: 'Supervise la récolte des grappes et l’élevage des grands crus en fûts.',
    badgeColor: '#6b21a8'
  },
  {
    id: 'fisherman',
    title: 'Capitaine Pêcheur',
    frenchTitle: 'Le Gardien du Port',
    iconName: 'Anchor',
    description: 'Guide le bateau sur la rivière et rapporte les truites fraîches du matin.',
    badgeColor: '#0369a1'
  },
  {
    id: 'shepherd',
    title: 'Berger des Collines',
    frenchTitle: 'Le Berger des Pâturages',
    iconName: 'Cloud',
    description: 'Veille sur le troupeau de moutons et récolte la laine brute pour le village.',
    badgeColor: '#15803d'
  },
  {
    id: 'innkeeper',
    title: 'Aubergiste du Sanglier d’Or',
    frenchTitle: 'L’Hôte de la Taverne',
    iconName: 'Utensils',
    description: 'Offre ragoût fumant, chopes fraîches et feu crépitant aux voyageurs.',
    badgeColor: '#92400e'
  },
  {
    id: 'weaver',
    title: 'Maître Tisserande',
    frenchTitle: 'La Tisserande des Étoffes',
    iconName: 'Scissors',
    description: 'Tisse des drapés indigotés et des couvertures chaudes pour l’hiver.',
    badgeColor: '#be185d'
  },
  {
    id: 'carpenter',
    title: 'Charpentier de Marine',
    frenchTitle: 'Le Bâtisseur de Bois',
    iconName: 'Wrench',
    description: 'Façonne les poutres en chêne massif pour soutenir les toits de Villon.',
    badgeColor: '#713f12'
  }
];

/**
 * Calculates the current day index in GMT (00:00 UTC shift)
 */
export const getCurrentGMTDayIndex = (): number => {
  const now = new Date();
  const startOfYear = Date.UTC(now.getUTCFullYear(), 0, 0);
  const diff = now.getTime() - startOfYear;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
};

/**
 * Returns the user's role for today based on 24h GMT 00:00 rotation
 */
export const getUserDailyRole = (userSeed: string = 'default'): RoleInfo => {
  const dayIndex = getCurrentGMTDayIndex();
  let seedHash = 0;
  for (let i = 0; i < userSeed.length; i++) {
    seedHash += userSeed.charCodeAt(i);
  }
  const roleIndex = Math.abs(dayIndex + seedHash) % VILLON_ROLES.length;
  return VILLON_ROLES[roleIndex];
};

/**
 * Returns formatted countdown time remaining until next 00:00 GMT shift
 */
export const getGMTCountdown = (): string => {
  const now = new Date();
  const nextGMT = new Date();
  nextGMT.setUTCHours(24, 0, 0, 0); // Next 00:00 GMT

  const diffMs = nextGMT.getTime() - now.getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
};
