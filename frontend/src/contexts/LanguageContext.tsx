import React, { createContext, useContext, useState } from 'react';

export type Language = 'fr' | 'en';

type Translations = Record<string, { fr: string; en: string }>;

export const translations: Translations = {
  // App
  appName: { fr: 'VillonWood', en: 'VillonWood' },

  // Settings
  settingsTitle: { fr: 'Paramètres de VillonWood', en: 'VillonWood Settings' },
  languageLabel: { fr: 'Langue du système', en: 'System Language' },
  profileLabel: { fr: 'Profil de citoyen', en: 'Citizen Profile' },
  dailyRoleLabel: { fr: 'Rôle du citoyen (24h GMT)', en: 'Citizen Daily Role (24h GMT)' },
  audioLabel: { fr: 'Audio & Interface', en: 'Audio & Interface' },
  soundEffects: { fr: 'Effets sonores & ambiances', en: 'Sound Effects & Ambience' },
  testBell: { fr: 'Tester la cloche du village', en: 'Test Village Bell' },
  showHUD: { fr: 'Afficher le HUD', en: 'Show HUD Overlay' },
  community: { fr: 'Communauté & Retours', en: 'Community & Feedback' },
  rateApp: { fr: 'Évaluer l\'application', en: 'Rate the App' },
  reportAbuse: { fr: 'Signaler un abus', en: 'Report Abuse' },
  save: { fr: 'Enregistrer', en: 'Save' },
  logout: { fr: 'Déconnexion', en: 'Log Out' },
  deleteAccount: { fr: 'Supprimer le compte', en: 'Delete Account' },
  adminPanel: { fr: 'Tableau de bord Admin', en: 'Admin Dashboard' },
  appRoleLabel: { fr: 'Rôle dans le système', en: 'App Role' },
  restrictedWarning: {
    fr: 'Vous avez été restreint. Veuillez contacter l\'administrateur si vous pensez qu\'il s\'agit d\'une erreur.',
    en: 'You have been restricted, please contact admin if you think it was a mistake.'
  },

  // Roles
  userRoleLearner: { fr: 'Apprenant', en: 'Learner' },
  userRoleTeacher: { fr: 'Enseignant', en: 'Teacher' },
  userRoleAdmin: { fr: 'Administrateur', en: 'Admin' },

  // Sidebar
  sidebarMedia: { fr: 'Villon Media', en: 'Villon Media' },
  sidebarCamera: { fr: 'Photo', en: 'Photo Booth' },
  sidebarMusic: { fr: 'Musique', en: 'Music' },
  sidebarSettings: { fr: 'Paramètres', en: 'Settings' },
  sidebarAdmin: { fr: 'Panneau Admin', en: 'Admin Panel' },
  sidebarHudShow: { fr: 'Statut HUD', en: 'Show HUD' },
  sidebarHudHide: { fr: 'Masquer Statut', en: 'Hide HUD' },

  // Map tooltips
  mapLocation: { fr: 'Lieu', en: 'Location' },
  mapPeopleOnline: { fr: 'personnes discutent actuellement', en: 'people chatting now' },
  mapClickToChat: { fr: 'Cliquer pour entrer et discuter', en: 'Click to enter and chat' },

  // Camera
  cameraTitle: { fr: 'Mode Photo VillonWood', en: 'VillonWood Photo Mode' },
  cameraStarting: { fr: 'Démarrage de la caméra…', en: 'Starting camera…' },
  cameraPreview: { fr: 'Aperçu photo', en: 'Photo Preview' },
  cameraRetake: { fr: 'Reprendre', en: 'Retake' },
  cameraSaved: { fr: 'Photo enregistrée !', en: 'Photo saved!' },
  cameraFilters: { fr: 'Filtres', en: 'Filters' },
  cameraFrames: { fr: 'Cadres', en: 'Frames' },
  cameraFilterParchment: { fr: 'Parchemin', en: 'Parchment' },
  cameraFilterAutumn: { fr: 'Automne', en: 'Autumn' },
  cameraFilterInk: { fr: 'Encre Noir', en: 'Dark Ink' },
  cameraFilterNormal: { fr: 'Normal', en: 'Normal' },
  cameraFrameNone: { fr: 'Aucun', en: 'None' },
  cameraFrameChef: { fr: 'Chef Cuisinier', en: 'Chef Cook' },
  cameraTakePhoto: { fr: 'Prendre une photo', en: 'Take Photo' },
  cameraRetakePhoto: { fr: 'Reprendre une photo', en: 'Retake Photo' },
  cameraDownload: { fr: 'Enregistrer', en: 'Download' },
  cameraDownloadTooltip: { fr: 'Télécharger la photo', en: 'Download Photo' },

  // Music
  musicTitle: { fr: 'Ménestrel & Musique du Village', en: 'Minstrel & Village Music' },
  musicPlaylist: { fr: 'Chansons du barde', en: 'Bard\'s Playlist' },
  musicTrack1: { fr: 'Luth & Guitare du Troubadour', en: 'Troubadour Lute & Guitar' },
  musicTrack2: { fr: 'Brume Matinale sur le Village', en: 'Morning Mist on the Village' },
  musicTrack3: { fr: 'Chanson de la Taverne Sanglier', en: 'Boar Tavern Song' },
  musicTrack4: { fr: 'Symphonie Rustique de Villon', en: 'Rustic Symphony of Villon' },
  musicMood1: { fr: 'Acoustique & Folk', en: 'Acoustic & Folk' },
  musicMood2: { fr: 'Calme Nature', en: 'Calm Nature' },
  musicMood3: { fr: 'Festif & Taverne', en: 'Festive & Tavern' },
  musicMood4: { fr: 'Médiéval Doux', en: 'Soft Medieval' },

  // Social Media / Gazette
  gazettePreTitle: { fr: 'Chronique & Écrits Communaux • Anno 1784', en: 'Chronicle & Community Writings • Anno 1784' },
  gazetteTitle: { fr: 'La Gazette de Villon', en: 'The Villon Gazette' },
  gazetteSubtitle: { fr: 'Le Fil Social officiel du Village de Villon', en: 'Official Social Feed of Villon Village' },
  gazetteClose: { fr: 'Enrouler le parchemin', en: 'Close Scroll' },
  gazetteCategories: { fr: 'Rubriques', en: 'Categories' },
  gazetteAll: { fr: 'Tous', en: 'All' },
  gazettePostTitle: { fr: 'Titre de votre annonce...', en: 'Your post title...' },
  gazettePostContent: { fr: 'Rédigez une missive pour la communauté...', en: 'Write a message for the community...' },
  gazettePublish: { fr: 'Publier', en: 'Publish' },
  gazettePrev: { fr: 'Précédent', en: 'Previous' },
  gazetteNext: { fr: 'Suivant', en: 'Next' },
  gazetteAnnouncement: { fr: 'Annonce', en: 'Post' },
  gazetteOf: { fr: 'sur', en: 'of' },
  gazetteShowMore: { fr: 'Voir la suite', en: 'Show more' },
  gazetteShowLess: { fr: 'Voir moins', en: 'Show less' },
  gazetteSeals: { fr: 'Sceaux', en: 'Likes' },
  gazetteMissives: { fr: 'Missives', en: 'Comments' },
  gazetteShare: { fr: 'Transmettre', en: 'Share' },
  gazetteSave: { fr: 'Enregistrer', en: 'Save' },
  gazetteEmpty: { fr: 'Aucune annonce trouvée dans cette rubrique.', en: 'No posts found in this category.' },
  gazetteNewPost: { fr: 'Nouvelle Annonce au Parchemin', en: 'New Scroll Announcement' },
  gazetteYou: { fr: 'Vous (Voyageur)', en: 'You (Traveler)' },
  gazetteJustNow: { fr: 'à l\'instant', en: 'just now' },

  // GroupChat
  chatOnline: { fr: 'en ligne', en: 'online' },
  chatManager: { fr: 'Responsable', en: 'Manager' },
  chatPlaceholder: { fr: 'Discutez avec tout le monde à', en: 'Chat with everyone at' },
  chatSend: { fr: 'Envoyer', en: 'Send' },
  chatRestricted: { fr: 'Accès au chat restreint par l\'administrateur...', en: 'Chat restricted by administrator...' },
  chatRestrictedBtn: { fr: 'Restreint', en: 'Restricted' },
  chatClose: { fr: 'Fermer la discussion', en: 'Close chat' },

  // HUD
  hudLogin: { fr: 'Se connecter', en: 'Log In' },
  hudServer: { fr: 'SRV // VILLON-FRANCE', en: 'SRV // VILLON-FRANCE' },
  hudWorld: { fr: 'LE MONDE DES 20 MÉTIERS', en: 'THE WORLD OF 20 TRADES' },
  hudAlive: { fr: ' CITOYENS', en: ' CITIZENS' },
  hudStatus: { fr: 'STATUT DU VILLAGE', en: 'VILLAGE STATUS' },
  hudActive: { fr: '100% ACTIF', en: '100% ACTIVE' },
  hudSettings: { fr: 'Paramètres', en: 'Settings' },
  hudLogout: { fr: 'Déconnexion', en: 'Log Out' },
  hudUsername: { fr: 'Nom d\'utilisateur', en: 'Username' },
  hudUsernamePlaceholder: { fr: 'Entrez un pseudo...', en: 'Enter a username...' },

  // Role rotation
  roleRotation: { fr: 'Rotation du rôle dans', en: 'Role rotation in' },

  // Auth
  loginLogout: { fr: 'Déconnexion', en: 'Log Out' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const useLanguage = (): LanguageContextType => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('villon_language');
    return (saved === 'en' || saved === 'fr') ? saved : 'fr';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('villon_language', lang);
  };

  const t = (key: string): string => {
    if (translations[key]) {
      return translations[key][language] || translations[key].fr;
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
