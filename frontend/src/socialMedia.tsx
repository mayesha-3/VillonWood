import React, { useEffect, useMemo, useState } from 'react';

import {
  X, Heart, MessageSquare, Sparkles, Scroll,
  ChevronRight, ChevronDown, ChevronUp, Send, Search,
  CheckCircle2, ImagePlus, Trash2, ArrowLeft, MapPin,
  BriefcaseBusiness, CalendarDays, Languages, ScrollText
} from 'lucide-react';
import mapImage from './assets/map.png';
import { useLanguage } from './contexts/LanguageContext';

const ALL_CATEGORY = 'all';

interface SocialMediaProps { onClose: () => void }
interface Professional {
  id: string; name: string; profession: string; handle: string; avatar: string;
  cover: string; category: string; postTitle: string; postText: string; postImage: string;
  building: string;
}

interface SocialComment {
  id: string;
  author: string;
  text: string;
  avatar: string;
  englishText?: string;
}

interface SocialPost {
  id: string;
  professionalId: string;
  author: string;
  handle: string;
  avatar: string;
  time: string;
  title: string;
  content: string;
  image?: string;
  likes: number;
  isLiked?: boolean;
  tag: string;
  category: string;

  // নতুন দুটি তথ্য
  savoirFaire?: string;
  seasonalCalendar?: string;
}

const professionals: Professional[] = [
  { id:'bertrand',
     name:'Maître Bertrand',
      profession:'Farmer',
       handle:'@maitre_bertrand', 
       category:'Agriculture', 
       avatar:'/src/pic/professionals/1.png', 
       cover:'/src/pic/professionals/cover.png',
        building:'Ferme de Villon', 
        postTitle:'Les récoltes du matin sont arrivées !', 
        postText:'Les champs sont dorés et la récolte de blé commence à l’aube. Venez découvrir nos légumes de saison et les nouvelles bottes de foin à la ferme. Que la journée soit généreuse pour tout le village !', 
        postImage:'/src/pic/professionals/1 pic.jpg' },
  { id:'jacques',
     name:'Jacques du Clos',
      profession:'Vigneron / Grape Grower',
       handle:'@vigneron_villon',
        category:'Vignoble', 
        avatar:'/src/pic/professionals/2.png', 
        cover:'/src/pic/professionals/cover.png',
         building:'Domaine du Clos', 
         postTitle:'Au cœur des vignes du Clos', 
         postText:'Les grappes ont pris une belle couleur sous le soleil. Une promenade guidée dans les vignes aura lieu cet après-midi ; je vous raconterai les secrets de notre terroir.', 
         postImage:'/src/pic/professionals/2 pic.jpg' },
  { id:'guillaume',
     name:'Guillaume', profession:'Shepherd', 
     handle:'@berger_guillaume', 
     category:'Élevage', 
     avatar:'/src/pic/professionals/3.png',
      cover:'/src/pic/professionals/cover.png', 
      building:'Bergerie des Collines', postTitle:'Une matinée avec le troupeau', postText:'Les moutons sont partis vers les collines verdoyantes. Le petit agneau né cette nuit se porte à merveille. La vie au grand air réserve toujours de belles surprises !', postImage:'/src/pic/professionals/3 pic.jpg' },
  { id:'etienne', name:'Etienne', profession:'Cattle Herder', handle:'@etienne_troupeau', category:'Élevage', avatar:'/src/pic/professionals/4.png', cover:'/src/pic/professionals/cover.png', building:'Étable Saint-Martin', postTitle:'Le troupeau au pâturage', postText:'Nos bêtes profitent aujourd’hui de l’herbe fraîche près du vieux chêne. Merci aux voisins qui ont aidé à réparer la clôture hier soir !', postImage:'/src/pic/professionals/4 pic.jpg' },
  { id:'charles', name:'Maître Charles', profession:'Miller', handle:'@moulin_charles', category:'Meunerie', avatar:'/src/pic/professionals/5.png', cover:'/src/pic/professionals/cover.png', building:'Moulin du Ruisseau', postTitle:'La meule tourne à nouveau', postText:'Le moulin est en marche et la farine fraîche est prête. Apportez votre grain avant le coucher du soleil ; la rivière donne aujourd’hui une force magnifique à la roue.', postImage:'/src/pic/professionals/5 pic.jpg' },
  { id:'vulcain', name:'Maître forgeron Vulcain', profession:'Blacksmith', handle:'@forge_vulcain', category:'Artisanat', avatar:'/src/pic/professionals/6.png', cover:'/src/pic/professionals/cover.png', building:'La Forge de Vulcain', postTitle:'Le feu de la forge est allumé', postText:'Aujourd’hui, je façonne des charnières, des outils agricoles et une nouvelle enseigne pour la place du village. Passez voir les étincelles danser près de l’enclume !', postImage:'/src/pic/professionals/6 pic.jpg' },
  { id:'thibault', name:'Thibault', profession:'Farrier', handle:'@marechal_thibault', category:'Artisanat', avatar:'/src/pic/professionals/7.png', cover:'/src/pic/professionals/cover.png', building:'Atelier du Maréchal', postTitle:'Des fers neufs pour les chevaux', postText:'Les chevaux du relais ont reçu leurs nouveaux fers. Je serai près de l’écurie jusqu’à la tombée de la nuit pour les urgences et les ajustements.', postImage:'/src/pic/professionals/7 pic.jpg' },
  { id:'jeanluc', name:'Jean-Luc Boulanger', profession:'Baker', handle:'@baker_jeanluc', category:'Boulangerie', avatar:'/src/pic/professionals/8.png', cover:'/src/pic/professionals/cover.png', building:'Boulangerie du Village', postTitle:'Pains & brioches du matin', postText:'Les baguettes au levain et les brioches sont sorties du four à bois ! Passez avant midi pour les déguster encore chaudes. Aujourd’hui, une fournée spéciale au miel de Villon vous attend.', postImage:'/src/pic/professionals/8 pic.jpg' },
  { id:'simone', name:'Madame Simone', profession:'Cheesemaker', handle:'@fromages_simone', category:'Fromagerie', avatar:'/src/pic/professionals/9.png', cover:'/src/pic/professionals/cover.png', building:'La Laiterie de Simone', postTitle:'Les fromages du jour sont prêts', postText:'Mes tommes ont reposé dans la cave fraîche et sont prêtes à être goûtées. Il y aura aussi du fromage frais aux herbes du jardin. À très bientôt au marché !', postImage:'/src/pic/professionals/9 pic.jpg' },
  { id:'gaston', name:'Gaston', profession:'Brewer', handle:'@brasseur_gaston', category:'Brasserie', avatar:'/src/pic/professionals/10.png', cover:'/src/pic/professionals/cover.png', building:'Brasserie du Chêne', postTitle:'Une nouvelle cuvée à la brasserie', postText:'La cuve a fini de fermenter et le brassin du mois embaume toute la rue. Venez découvrir les arômes de malt et de houblon lors de notre visite de l’atelier.', postImage:'/src/pic/professionals/10 pic.jpg' },
  { id:'colette', name:'Colette', profession:'Weaver', handle:'@tisserande_colette', category:'Textile', avatar:'/src/pic/professionals/11.png', cover:'/src/pic/professionals/cover.png', building:'L’Atelier des Fils', postTitle:'De nouveaux motifs sur le métier', postText:'Je travaille aujourd’hui un tissu aux couleurs de Villon, avec des fils de lin et de laine. Venez voir le métier en action et choisir votre motif préféré.', postImage:'/src/pic/professionals/11 pic.jpg' },
  { id:'armand', name:'Monsieur Armand', profession:'Tailor', handle:'@tailleur_armand', category:'Textile', avatar:'/src/pic/professionals/12.png', cover:'/src/pic/professionals/cover.png', building:'La Maison du Tailleur', postTitle:'Manteaux prêts pour la saison', postText:'Les manteaux de laine et les vestes de fête sont presque terminés. Je prends encore quelques mesures aujourd’hui dans mon atelier, près de la place du marché.', postImage:'/src/pic/professionals/12 pic.jpg' },
  { id:'remi', name:'Remi', profession:'Shoemaker', handle:'@cordonnier_remi', category:'Artisanat', avatar:'/src/pic/professionals/13.png', cover:'/src/pic/professionals/cover.png', building:'L’Échoppe du Cordonnier', postTitle:'Bottes réparées, prêtes à repartir', postText:'J’ai réparé les bottes du messager et cousu de nouvelles semelles pour les voyageurs. Apportez vos chaussures usées : une seconde vie leur est possible !', postImage:'/src/pic/professionals/13 pic.jpg' },
  { id:'laurent', name:'Laurent', profession:'Carpenter', handle:'@menuisier_laurent', category:'Construction', avatar:'/src/pic/professionals/14.png', cover:'/src/pic/professionals/cover.png', building:'Menuiserie Laurent', postTitle:'Une nouvelle porte en chêne', postText:'La porte de l’auberge est taillée et assemblée à la main. Le bois de chêne révèle un magnifique grain ; je termine les ferrures avec le forgeron Vulcain.', postImage:'/src/pic/professionals/14 pic.jpg' },
  { id:'marc', name:'Marc le Batisseur', profession:'Mason', handle:'@batisseur_marc', category:'Construction', avatar:'/src/pic/professionals/15.png', cover:'/src/pic/professionals/cover.png', building:'Chantier de la Vieille Place', postTitle:'Les murs de la place avancent', postText:'Les pierres de la nouvelle arche sont posées. Merci aux apprentis et aux voisins pour leur aide ; nous espérons ouvrir le passage avant la prochaine foire.', postImage:'/src/pic/professionals/15 pic.jpg' },
  { id:'mathieu', name:'Mathieu', profession:'Wheelwright', handle:'@charron_mathieu', category:'Artisanat', avatar:'/src/pic/professionals/16.png', cover:'/src/pic/professionals/cover.png', building:'Atelier des Roues', postTitle:'Une roue neuve pour la charrette', postText:'La roue en frêne est assemblée et cerclée. Elle sera prête pour le transport des sacs de farine dès demain matin. Le charronnage demande patience et précision !', postImage:'/src/pic/professionals/16 pic.jpg' },
  { id:'bernard', name:'Bernard', profession:'Cooper / Barrel Maker', handle:'@tonnelier_bernard', category:'Artisanat', avatar:'/src/pic/professionals/17.png', cover:'/src/pic/professionals/cover.png', building:'Tonnellerie Bernard', postTitle:'Des tonneaux de chêne fraîchement cerclés', postText:'Les nouveaux tonneaux sont prêts pour le domaine du Clos. Le chêne a été chauffé juste ce qu’il faut pour donner au vin de beaux arômes.', postImage:'/src/pic/professionals/17 pic.jpg' },
  { id:'capitaine', name:'Capitaine Jean et équipage', profession:'Fisherman and Crew', handle:'@equipage_du_rivage', category:'Rivière', avatar:'/src/pic/professionals/18.png', cover:'/src/pic/professionals/cover.png', building:'Quai des Pêcheurs', postTitle:'Une belle prise sur la rivière', postText:'Le ciel est clair sur la rivière Villon ! Nos filets ont ramené de belles truites. Nous embarquons les volontaires au quai pour une sortie paisible au coucher du soleil.', postImage:'/src/pic/professionals/18 pic.jpg' },
  { id:'aveline', name:'Aveline', profession:'Basket Weaver', handle:'@vannerie_aveline', category:'Artisanat', avatar:'/src/pic/professionals/19.png', cover:'/src/pic/professionals/cover.png', building:'La Vannerie d’Aveline', postTitle:'Paniers tressés à la main', postText:'Les jeunes pousses de saule sont souples et parfaites pour le tressage. J’ai terminé des paniers pour le marché et des corbeilles pour la boulangerie.', postImage:'/src/pic/professionals/19 pic.jpg' },
  { id:'pierre', name:'Maître Pierre de Villon', profession:'Innkeeper', handle:'@aubergiste_pierre', category:'Auberge', avatar:'/src/pic/professionals/20.png', cover:'/src/pic/professionals/cover.png', building:'Auberge de Villon', postTitle:'Bienvenue à l’auberge !', postText:'Le feu crépite dans la grande salle et le dîner mijote. Des chambres sont prêtes pour les voyageurs ; venez partager des histoires près de la cheminée après le marché.', postImage:'/src/pic/professionals/20 pic.jpg' },
];
const dailyProfessionVariants = [
  ['Farmer', 'Agriculture', 'La récolte du jour à la ferme'],
  ['Vigneron / Grape Grower', 'Vignoble', 'Les nouvelles du domaine viticole'],
  ['Shepherd', 'Élevage', 'Le troupeau découvre de nouveaux pâturages'],
  ['Cattle Herder', 'Élevage', 'Les nouvelles de notre troupeau'],
  ['Miller', 'Meunerie', 'La farine fraîche du moulin'],
  ['Blacksmith', 'Artisanat', 'Les travaux du jour à la forge'],
  ['Farrier', 'Artisanat', 'Les chevaux reçoivent leurs nouveaux fers'],
  ['Baker', 'Boulangerie', 'Le pain frais sort du four'],
  ['Cheesemaker', 'Fromagerie', 'Les fromages du jour sont prêts'],
  ['Brewer', 'Brasserie', 'Les nouvelles de la brasserie'],
  ['Weaver', 'Textile', 'Les créations du métier à tisser'],
  ['Tailor', 'Textile', 'Les vêtements confectionnés aujourd’hui'],
  ['Shoemaker', 'Artisanat', 'Les chaussures réparées à l’atelier'],
  ['Carpenter', 'Construction', 'Le travail du bois à l’atelier'],
  ['Mason', 'Construction', 'Les progrès du chantier du village'],
  ['Wheelwright', 'Artisanat', 'Une nouvelle roue prend forme'],
  ['Cooper / Barrel Maker', 'Artisanat', 'Les tonneaux préparés à l’atelier'],
  ['Fisherman and Crew', 'Rivière', 'Les nouvelles de la pêche du jour'],
  ['Basket Weaver', 'Artisanat', 'Les paniers tressés du jour'],
  ['Innkeeper', 'Auberge', 'Les nouvelles de l’auberge de Villon'],
] as const;

const getDhakaDateKey = () =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Dhaka',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
  
const VILLON_START_DHAKA_DATE = '2026-10-21';

const getVillonDayNumber = (dateKey = getDhakaDateKey()) => {
  const [year, month, day] = dateKey.split('-').map(Number);
  const [startYear, startMonth, startDay] =
    VILLON_START_DHAKA_DATE.split('-').map(Number);

  const currentDay = Math.floor(
    Date.UTC(year, month - 1, day) / 86400000
  );

  const startDayNumber = Math.floor(
    Date.UTC(startYear, startMonth - 1, startDay) / 86400000
  );

  return currentDay - startDayNumber;
};

const getVillonDateKey = (dateKey: string) => {
  const elapsedDays = Math.max(0, getVillonDayNumber(dateKey));
  const date = new Date(Date.UTC(1850, 0, 1 + elapsedDays));
  return date.toISOString().slice(0, 10);
};


const getDhakaDayNumber = () => {
  const dateKey = getDhakaDateKey();
  const [year, month, day] = dateKey.split('-').map(Number);
  return Math.floor(Date.UTC(year, month - 1, day) / 86400000);
};
const initialComments: Record<string, SocialComment[]> = {
  bertrand:[{id:'c1',author:'Colette',text:'Quelle belle récolte ! Les couleurs des champs sont magnifiques. 🌾',avatar:professionals[10].avatar},{id:'c2',author:'Maître Pierre de Villon',text:'Nous prendrons volontiers des légumes frais pour l’auberge !',avatar:professionals[19].avatar}],
  jacques:[{id:'c3',author:'Gaston',text:'Le soleil a vraiment aidé les vignes cette semaine !',avatar:professionals[9].avatar},{id:'c4',author:'Aveline',text:'J’aimerais beaucoup visiter le domaine. 🍇',avatar:professionals[18].avatar}],
  jeanluc:[{id:'c5',author:'Madame Simone',text:'Une brioche chaude avec mon fromage frais : un délice !',avatar:professionals[8].avatar},{id:'c6',author:'Maître Bertrand',text:'Je passerai prendre du pain après la ferme.',avatar:professionals[0].avatar}],
  capitaine:[{id:'c7',author:'Guillaume',text:'Le troupeau et moi vous saluons depuis les collines !',avatar:professionals[2].avatar},{id:'c8',author:'Maître Pierre de Villon',text:'Gardez-nous quelques belles truites pour le dîner !',avatar:professionals[19].avatar}],
};
const englishTranslations: Record<string, { title: string; content: string }> = {
  bertrand: { title: 'The morning harvest has arrived!', content: 'The fields are golden and the wheat harvest begins at dawn. Come discover our seasonal vegetables and fresh hay at the farm. May this be a generous day for the whole village!' },
  jacques: { title: 'At the heart of the Clos vineyards', content: 'The grapes have taken on a beautiful colour in the sunshine. A guided walk through the vineyard will take place this afternoon, and I will share the secrets of our land.' },
  guillaume: { title: 'A morning with the flock', content: 'The sheep have headed towards the green hills. The little lamb born last night is doing very well. Life in the open air always brings lovely surprises!' },
  etienne: { title: 'The herd in the pasture', content: 'Our cattle are enjoying the fresh grass near the old oak tree today. Thank you to the neighbours who helped repair the fence last night!' },
  charles: { title: 'The millstone is turning again', content: 'The mill is running and fresh flour is ready. Bring your grain before sunset; the river is giving the wheel wonderful power today.' },
  vulcain: { title: 'The forge fire is lit', content: 'Today I am shaping hinges, farming tools and a new sign for the village square. Come watch the sparks dance beside the anvil!' },
  thibault: { title: 'Fresh horseshoes for the horses', content: 'The horses at the relay have received their new shoes. I will be near the stable until nightfall for urgent repairs and adjustments.' },
  jeanluc: { title: 'Morning breads and brioches', content: 'The sourdough loaves and brioches have come out of the wood-fired oven! Visit before noon to taste them while warm. A special batch made with Villon honey awaits you today.' },
  simone: { title: 'Today’s cheeses are ready', content: 'My tomme cheeses have rested in the cool cellar and are ready to taste. There will also be fresh cheese with garden herbs. See you at the market!' },
  gaston: { title: 'A new brew at the brewery', content: 'The vat has finished fermenting and this month’s brew fills the street with its aroma. Come discover the scents of malt and hops on a tour of the workshop.' },
  colette: { title: 'New patterns on the loom', content: 'Today I am weaving a cloth in Villon’s colours, using linen and wool threads. Come watch the loom at work and choose your favourite pattern.' },
  armand: { title: 'Coats ready for the season', content: 'The wool coats and festive jackets are nearly finished. I am still taking measurements in my workshop today, near the market square.' },
  remi: { title: 'Boots repaired and ready to travel', content: 'I repaired the messenger’s boots and stitched new soles for travellers. Bring your worn shoes; they can have a second life!' },
  laurent: { title: 'A new oak door', content: 'The inn’s door has been cut and assembled by hand. The oak grain is beautiful; I am finishing the fittings with Vulcain the blacksmith.' },
  marc: { title: 'The square’s walls are taking shape', content: 'The stones of the new arch are in place. Thanks to the apprentices and neighbours for their help; we hope to open the passage before the next fair.' },
  mathieu: { title: 'A new wheel for the cart', content: 'The ash wheel has been assembled and rimmed. It will be ready to carry flour sacks tomorrow morning. Wheelwright work takes patience and precision!' },
  bernard: { title: 'Freshly hooped oak barrels', content: 'The new barrels are ready for the Clos estate. The oak has been heated just enough to give the wine lovely aromas.' },
  capitaine: { title: 'A fine catch from the river', content: 'The sky is clear over the Villon River! Our nets have brought in fine trout. We are welcoming volunteers at the quay for a peaceful trip at sunset.' },
  aveline: { title: 'Hand-woven baskets', content: 'The young willow shoots are supple and perfect for weaving. I have finished baskets for the market and small hampers for the bakery.' },
  pierre: { title: 'Welcome to the inn!', content: 'The fire crackles in the great hall and dinner is simmering. Rooms are ready for travellers; come share stories by the hearth after the market.' },
};


const professionalWork: Record<
  string,
  {
    stepsFr: string[];
    stepsEn: string[];
    seasons: {
      fr: string;
      en: string;
      activityFr: string;
      activityEn: string;
    }[];
  }
> = {
  bertrand: {
    stepsFr: ['Labourer et préparer la terre', 'Semer les graines', 'Arroser et désherber les cultures', 'Surveiller la croissance des plantes', 'Récolter et stocker les céréales'],
    stepsEn: ['Plough and prepare the soil', 'Sow the seeds', 'Water the crops and remove weeds', 'Monitor plant growth', 'Harvest and store the grain'],
    seasons: [
      { fr: 'Printemps', en: 'Spring', activityFr: 'Labourer les champs et semer les cultures.', activityEn: 'Plough the fields and sow crops.' },
      { fr: 'Été', en: 'Summer', activityFr: 'Arroser, désherber et surveiller les récoltes.', activityEn: 'Water, weed and monitor the crops.' },
      { fr: 'Automne', en: 'Autumn', activityFr: 'Récolter les céréales et remplir les greniers.', activityEn: 'Harvest grain and fill the granaries.' },
      { fr: 'Hiver', en: 'Winter', activityFr: 'Entretenir les outils et préparer les semences.', activityEn: 'Maintain tools and prepare seeds.' },
    ],
  },
  jacques: {
    stepsFr: ['Préparer et entretenir le sol du vignoble', 'Tailler les ceps de vigne', 'Attacher les sarments et guider les pousses', 'Surveiller la maturation des raisins', 'Vendanger puis trier les grappes'],
    stepsEn: ['Prepare and maintain the vineyard soil', 'Prune the grapevines', 'Tie canes and guide new shoots', 'Monitor grape ripening', 'Harvest and sort the grape clusters'],
    seasons: [
      { fr: 'Printemps', en: 'Spring', activityFr: 'Tailler les derniers sarments et protéger les jeunes pousses.', activityEn: 'Finish pruning and protect young shoots.' },
      { fr: 'Été', en: 'Summer', activityFr: 'Attacher les vignes et surveiller la maturation des raisins.', activityEn: 'Train the vines and monitor grape ripening.' },
      { fr: 'Automne', en: 'Autumn', activityFr: 'Vendanger les raisins et commencer la vinification.', activityEn: 'Harvest grapes and begin winemaking.' },
      { fr: 'Hiver', en: 'Winter', activityFr: 'Tailler les ceps et réparer les supports des vignes.', activityEn: 'Prune the vines and repair their supports.' },
    ],
  },
  guillaume: {
    stepsFr: ['Rassembler le troupeau', 'Vérifier la santé des moutons', 'Conduire les moutons vers les pâturages', 'Surveiller le troupeau et le protéger', 'Rentrer les moutons et vérifier leur abri'],
    stepsEn: ['Gather the flock', 'Check the sheep’s health', 'Lead the sheep to pasture', 'Watch over and protect the flock', 'Bring the sheep back and check their shelter'],
    seasons: [
      { fr: 'Printemps', en: 'Spring', activityFr: 'Surveiller les agneaux et trouver de nouveaux pâturages.', activityEn: 'Care for lambs and find fresh pasture.' },
      { fr: 'Été', en: 'Summer', activityFr: 'Conduire le troupeau vers les pâturages et l’eau.', activityEn: 'Lead the flock to pasture and water.' },
      { fr: 'Automne', en: 'Autumn', activityFr: 'Préparer les abris et surveiller l’état du troupeau.', activityEn: 'Prepare shelters and check the flock’s condition.' },
      { fr: 'Hiver', en: 'Winter', activityFr: 'Protéger les moutons du froid et leur fournir du fourrage.', activityEn: 'Protect the sheep from cold and provide fodder.' },
    ],
  },
  etienne: {
    stepsFr: ['Préparer le fourrage et l’eau', 'Examiner la santé du bétail', 'Conduire les bêtes au pâturage', 'Nettoyer l’étable et entretenir les enclos', 'Rassembler le troupeau pour la nuit'],
    stepsEn: ['Prepare fodder and water', 'Check the cattle’s health', 'Lead the animals to pasture', 'Clean the cowshed and maintain the pens', 'Gather the herd for the night'],
    seasons: [
      { fr: 'Printemps', en: 'Spring', activityFr: 'Remettre le bétail au pâturage quand les prés le permettent.', activityEn: 'Return cattle to pasture when the fields are ready.' },
      { fr: 'Été', en: 'Summer', activityFr: 'Fournir de l’eau et rechercher des pâturages frais.', activityEn: 'Provide water and seek fresh pasture.' },
      { fr: 'Automne', en: 'Autumn', activityFr: 'Préparer les réserves de fourrage pour les mois froids.', activityEn: 'Prepare fodder supplies for the cold months.' },
      { fr: 'Hiver', en: 'Winter', activityFr: 'Nourrir le bétail à l’étable et garder la litière propre.', activityEn: 'Feed cattle in the cowshed and keep bedding clean.' },
    ],
  },
  charles: {
    stepsFr: ['Nettoyer et vérifier les meules', 'Préparer les grains à moudre', 'Faire tourner le moulin', 'Tamiser la farine obtenue', 'Stocker la farine et nettoyer le moulin'],
    stepsEn: ['Clean and inspect the millstones', 'Prepare the grain for milling', 'Operate the mill', 'Sift the resulting flour', 'Store the flour and clean the mill'],
    seasons: [
      { fr: 'Printemps', en: 'Spring', activityFr: 'Inspecter le mécanisme et réparer les pièces usées.', activityEn: 'Inspect the mechanism and repair worn parts.' },
      { fr: 'Été', en: 'Summer', activityFr: 'Moudre les grains et surveiller le débit de l’eau.', activityEn: 'Grind grain and monitor the water flow.' },
      { fr: 'Automne', en: 'Autumn', activityFr: 'Moudre les grains fraîchement récoltés et stocker la farine.', activityEn: 'Mill newly harvested grain and store the flour.' },
      { fr: 'Hiver', en: 'Winter', activityFr: 'Entretenir les meules et protéger les réserves de farine.', activityEn: 'Maintain the millstones and protect flour stocks.' },
    ],
  },
  vulcain: {
    stepsFr: ['Choisir le métal et allumer la forge', 'Chauffer le fer jusqu’à ce qu’il soit malléable', 'Forger la pièce au marteau sur l’enclume', 'Tremper ou refroidir le métal selon le travail', 'Meuler, affûter et vérifier la pièce'],
    stepsEn: ['Choose the metal and light the forge', 'Heat iron until it becomes workable', 'Hammer the piece on the anvil', 'Quench or cool the metal as required', 'Grind, sharpen and inspect the piece'],
    seasons: [
      { fr: 'Printemps', en: 'Spring', activityFr: 'Réparer les outils agricoles avant les travaux des champs.', activityEn: 'Repair farm tools before fieldwork begins.' },
      { fr: 'Été', en: 'Summer', activityFr: 'Fabriquer et réparer les outils utilisés dans les champs.', activityEn: 'Make and repair tools used in the fields.' },
      { fr: 'Automne', en: 'Autumn', activityFr: 'Réparer les lames, les ferrures et les outils de récolte.', activityEn: 'Repair blades, fittings and harvesting tools.' },
      { fr: 'Hiver', en: 'Winter', activityFr: 'Entretenir la forge et fabriquer les pièces commandées.', activityEn: 'Maintain the forge and make commissioned parts.' },
    ],
  },
  thibault: {
    stepsFr: ['Examiner les sabots du cheval', 'Retirer les vieux fers et nettoyer les sabots', 'Choisir un fer adapté à chaque sabot', 'Ajuster et fixer le fer avec précaution', 'Vérifier l’équilibre et la démarche du cheval'],
    stepsEn: ['Examine the horse’s hooves', 'Remove old shoes and clean the hooves', 'Choose a suitable shoe for each hoof', 'Fit and secure the shoe carefully', 'Check the horse’s balance and gait'],
    seasons: [
      { fr: 'Printemps', en: 'Spring', activityFr: 'Vérifier les fers avant les travaux agricoles.', activityEn: 'Check horseshoes before farm work begins.' },
      { fr: 'Été', en: 'Summer', activityFr: 'Entretenir les sabots des chevaux qui travaillent chaque jour.', activityEn: 'Maintain the hooves of horses working daily.' },
      { fr: 'Automne', en: 'Autumn', activityFr: 'Préparer les chevaux aux déplacements et aux récoltes.', activityEn: 'Prepare horses for travel and harvest work.' },
      { fr: 'Hiver', en: 'Winter', activityFr: 'Vérifier les sabots et adapter les soins aux chemins humides.', activityEn: 'Check hooves and adapt care to wet paths.' },
    ],
  },
  jeanluc: {
    stepsFr: ['Peser la farine, l’eau, le levain et le sel', 'Mélanger et pétrir la pâte', 'Laisser fermenter la pâte', 'Façonner les pains et chauffer le four', 'Enfourner, cuire et laisser refroidir les pains'],
    stepsEn: ['Measure flour, water, starter and salt', 'Mix and knead the dough', 'Let the dough ferment', 'Shape the loaves and heat the oven', 'Bake and cool the loaves'],
    seasons: [
      { fr: 'Printemps', en: 'Spring', activityFr: 'Préparer les fournées pour les travaux et les fêtes du village.', activityEn: 'Prepare bread batches for village work and festivals.' },
      { fr: 'Été', en: 'Summer', activityFr: 'Organiser les fournées tôt pour éviter la chaleur du jour.', activityEn: 'Bake early to avoid the day’s heat.' },
      { fr: 'Automne', en: 'Autumn', activityFr: 'Cuire du pain pour accompagner les récoltes et les réserves.', activityEn: 'Bake bread for harvest work and winter stores.' },
      { fr: 'Hiver', en: 'Winter', activityFr: 'Maintenir le four et préparer des fournées régulières.', activityEn: 'Maintain the oven and prepare regular batches.' },
    ],
  },
  simone: {
    stepsFr: ['Réceptionner le lait frais', 'Chauffer ou préparer le lait selon le fromage', 'Ajouter le ferment et la présure', 'Égoutter le caillé et façonner les fromages', 'Saler puis affiner les fromages'],
    stepsEn: ['Receive fresh milk', 'Heat or prepare the milk for the chosen cheese', 'Add starter culture and rennet', 'Drain the curds and shape the cheeses', 'Salt and age the cheeses'],
    seasons: [
      { fr: 'Printemps', en: 'Spring', activityFr: 'Transformer le lait et surveiller la qualité des nouvelles productions.', activityEn: 'Process milk and monitor the quality of fresh batches.' },
      { fr: 'Été', en: 'Summer', activityFr: 'Garder le lait et les fromages dans un endroit frais.', activityEn: 'Keep milk and cheese in a cool place.' },
      { fr: 'Automne', en: 'Autumn', activityFr: 'Préparer les fromages destinés à l’affinage et aux réserves.', activityEn: 'Prepare cheeses for ageing and storage.' },
      { fr: 'Hiver', en: 'Winter', activityFr: 'Surveiller l’affinage et maintenir une bonne hygiène.', activityEn: 'Monitor ageing and maintain good hygiene.' },
    ],
  },
  gaston: {
    stepsFr: ['Nettoyer les cuves et préparer les ingrédients', 'Faire chauffer l’eau et préparer le moût avec les céréales', 'Ajouter le houblon si la recette le prévoit', 'Refroidir le moût et ajouter la levure', 'Laisser fermenter puis conserver la bière'],
    stepsEn: ['Clean the vats and prepare the ingredients', 'Heat water and prepare the grain wort', 'Add hops if the recipe calls for them', 'Cool the wort and add yeast', 'Allow fermentation and store the beer'],
    seasons: [
      { fr: 'Printemps', en: 'Spring', activityFr: 'Nettoyer les cuves et préparer les ingrédients de brassage.', activityEn: 'Clean vats and prepare brewing ingredients.' },
      { fr: 'Été', en: 'Summer', activityFr: 'Surveiller la fermentation et garder les cuves au frais.', activityEn: 'Monitor fermentation and keep the vats cool.' },
      { fr: 'Automne', en: 'Autumn', activityFr: 'Préparer les brassins avec les céréales nouvellement récoltées.', activityEn: 'Brew batches with newly harvested grain.' },
      { fr: 'Hiver', en: 'Winter', activityFr: 'Nettoyer le matériel et surveiller les réserves en cave.', activityEn: 'Clean equipment and monitor cellar stocks.' },
    ],
  },
  colette: {
    stepsFr: ['Préparer et carder les fibres', 'Filer les fibres pour obtenir du fil', 'Installer les fils de chaîne sur le métier', 'Tisser les fils de trame et de chaîne', 'Couper et vérifier la pièce tissée'],
    stepsEn: ['Prepare and card the fibres', 'Spin the fibres into yarn', 'Set the warp threads on the loom', 'Weave the warp and weft threads', 'Cut and inspect the woven cloth'],
    seasons: [
      { fr: 'Printemps', en: 'Spring', activityFr: 'Préparer les fibres et choisir les couleurs des nouveaux tissus.', activityEn: 'Prepare fibres and choose colours for new cloth.' },
      { fr: 'Été', en: 'Summer', activityFr: 'Tisser les étoffes légères et aérer l’atelier.', activityEn: 'Weave lighter fabrics and ventilate the workshop.' },
      { fr: 'Automne', en: 'Autumn', activityFr: 'Tisser des étoffes plus épaisses pour la saison froide.', activityEn: 'Weave thicker cloth for colder weather.' },
      { fr: 'Hiver', en: 'Winter', activityFr: 'Réparer le métier et poursuivre les commandes à l’atelier.', activityEn: 'Repair the loom and continue workshop orders.' },
    ],
  },
  armand: {
    stepsFr: ['Prendre les mesures du client', 'Choisir le tissu et préparer le patron', 'Découper soigneusement les pièces', 'Assembler et coudre le vêtement', 'Faire essayer le vêtement et ajuster les finitions'],
    stepsEn: ['Take the customer’s measurements', 'Choose the fabric and prepare the pattern', 'Carefully cut the pieces', 'Assemble and sew the garment', 'Fit the garment and adjust the finishing details'],
    seasons: [
      { fr: 'Printemps', en: 'Spring', activityFr: 'Préparer des vêtements adaptés aux journées plus douces.', activityEn: 'Prepare garments suited to milder days.' },
      { fr: 'Été', en: 'Summer', activityFr: 'Coudre des vêtements légers et réparer les habits de travail.', activityEn: 'Sew light clothing and repair work garments.' },
      { fr: 'Automne', en: 'Autumn', activityFr: 'Prendre les commandes de manteaux et de vêtements chauds.', activityEn: 'Take orders for coats and warm clothing.' },
      { fr: 'Hiver', en: 'Winter', activityFr: 'Ajuster les manteaux et réparer les vêtements usés.', activityEn: 'Fit coats and repair worn clothing.' },
    ],
  },
  remi: {
    stepsFr: ['Examiner la chaussure abîmée', 'Choisir le cuir et les matériaux de réparation', 'Découdre ou retirer les parties usées', 'Réparer la semelle et recoudre les pièces', 'Polir et vérifier le confort de la chaussure'],
    stepsEn: ['Examine the damaged shoe', 'Choose leather and repair materials', 'Remove worn or damaged parts', 'Repair the sole and stitch the pieces', 'Polish the shoe and check its comfort'],
    seasons: [
      { fr: 'Printemps', en: 'Spring', activityFr: 'Réparer les chaussures avant les longs déplacements.', activityEn: 'Repair shoes before long journeys.' },
      { fr: 'Été', en: 'Summer', activityFr: 'Réparer les semelles usées par les chemins poussiéreux.', activityEn: 'Repair soles worn by dusty roads.' },
      { fr: 'Automne', en: 'Autumn', activityFr: 'Renforcer les chaussures avant les chemins boueux.', activityEn: 'Reinforce shoes before muddy weather.' },
      { fr: 'Hiver', en: 'Winter', activityFr: 'Réparer les coutures et protéger le cuir de l’humidité.', activityEn: 'Repair stitching and protect leather from dampness.' },
    ],
  },
  laurent: {
    stepsFr: ['Mesurer et tracer les pièces de bois', 'Sélectionner et couper le bois', 'Raboter et façonner les pièces', 'Assembler les pièces avec des chevilles ou des joints', 'Poncer et vérifier la solidité de l’ouvrage'],
    stepsEn: ['Measure and mark the wooden pieces', 'Select and cut the timber', 'Plane and shape the pieces', 'Join the pieces using pegs or joints', 'Smooth the surface and check the structure'],
    seasons: [
      { fr: 'Printemps', en: 'Spring', activityFr: 'Réparer les portes, clôtures et bâtiments après l’hiver.', activityEn: 'Repair doors, fences and buildings after winter.' },
      { fr: 'Été', en: 'Summer', activityFr: 'Construire et réparer les structures en bois du village.', activityEn: 'Build and repair the village’s wooden structures.' },
      { fr: 'Automne', en: 'Autumn', activityFr: 'Renforcer les portes et préparer les bâtiments au froid.', activityEn: 'Reinforce doors and prepare buildings for cold weather.' },
      { fr: 'Hiver', en: 'Winter', activityFr: 'Fabriquer des pièces en atelier et réparer les outils.', activityEn: 'Make parts indoors and repair tools.' },
    ],
  },
  marc: {
    stepsFr: ['Examiner le terrain et préparer les fondations', 'Transporter et sélectionner les pierres', 'Préparer le mortier', 'Poser les pierres en vérifiant l’alignement', 'Laisser prendre le mortier et contrôler la solidité du mur'],
    stepsEn: ['Inspect the site and prepare the foundations', 'Carry and select the stones', 'Prepare the mortar', 'Lay stones while checking alignment', 'Allow the mortar to set and inspect the wall'],
    seasons: [
      { fr: 'Printemps', en: 'Spring', activityFr: 'Inspecter les murs et reprendre les réparations nécessaires.', activityEn: 'Inspect walls and carry out necessary repairs.' },
      { fr: 'Été', en: 'Summer', activityFr: 'Construire les murs lorsque le temps permet au mortier de sécher.', activityEn: 'Build walls when conditions allow mortar to dry.' },
      { fr: 'Automne', en: 'Autumn', activityFr: 'Terminer les ouvrages et protéger les matériaux du mauvais temps.', activityEn: 'Finish structures and protect materials from bad weather.' },
      { fr: 'Hiver', en: 'Winter', activityFr: 'Préparer les pierres et les outils pour les chantiers à venir.', activityEn: 'Prepare stones and tools for upcoming building work.' },
    ],
  },
  mathieu: {
    stepsFr: ['Examiner la roue et mesurer les pièces nécessaires', 'Sélectionner le moyeu, les rayons et la jante', 'Façonner et assembler les rayons', 'Monter et ajuster la jante autour de la roue', 'Vérifier l’alignement et la rotation de la roue'],
    stepsEn: ['Inspect the wheel and measure the required parts', 'Select the hub, spokes and rim', 'Shape and assemble the spokes', 'Fit and adjust the rim around the wheel', 'Check wheel alignment and rotation'],
    seasons: [
      { fr: 'Printemps', en: 'Spring', activityFr: 'Réparer les roues des charrettes avant les travaux des champs.', activityEn: 'Repair cart wheels before fieldwork begins.' },
      { fr: 'Été', en: 'Summer', activityFr: 'Entretenir les roues utilisées pour transporter les récoltes.', activityEn: 'Maintain wheels used to transport crops.' },
      { fr: 'Automne', en: 'Autumn', activityFr: 'Renforcer les roues avant le transport des récoltes et des réserves.', activityEn: 'Strengthen wheels before hauling harvests and supplies.' },
      { fr: 'Hiver', en: 'Winter', activityFr: 'Fabriquer des roues et remplacer les pièces endommagées.', activityEn: 'Build wheels and replace damaged parts.' },
    ],
  },
  bernard: {
    stepsFr: ['Choisir et préparer les douelles de chêne', 'Façonner les douelles pour qu’elles s’ajustent', 'Assembler les douelles autour du fond', 'Chauffer ou cintrer le bois et poser les cercles', 'Vérifier l’étanchéité et la solidité du tonneau'],
    stepsEn: ['Select and prepare the oak staves', 'Shape the staves so they fit together', 'Assemble the staves around the base', 'Heat or bend the wood and fit the hoops', 'Check the barrel’s tightness and strength'],
    seasons: [
      { fr: 'Printemps', en: 'Spring', activityFr: 'Réparer les tonneaux et préparer le bois nécessaire.', activityEn: 'Repair barrels and prepare the required timber.' },
      { fr: 'Été', en: 'Summer', activityFr: 'Fabriquer des tonneaux pour les réserves et les échanges.', activityEn: 'Make barrels for storage and trade.' },
      { fr: 'Automne', en: 'Autumn', activityFr: 'Préparer des tonneaux pour les vendanges et les réserves.', activityEn: 'Prepare barrels for grape harvest and storage.' },
      { fr: 'Hiver', en: 'Winter', activityFr: 'Réparer les cercles et fabriquer des tonneaux en atelier.', activityEn: 'Repair hoops and build barrels in the workshop.' },
    ],
  },
  capitaine: {
    stepsFr: ['Vérifier la barque, les rames et les filets', 'Choisir un lieu de pêche sûr', 'Lancer les filets ou poser les lignes', 'Remonter les prises et trier les poissons', 'Nettoyer le matériel et conserver les prises'],
    stepsEn: ['Check the boat, oars and nets', 'Choose a safe fishing spot', 'Cast the nets or set the lines', 'Bring in the catch and sort the fish', 'Clean the equipment and preserve the catch'],
    seasons: [
      { fr: 'Printemps', en: 'Spring', activityFr: 'Vérifier les filets et reprendre la pêche lorsque la rivière le permet.', activityEn: 'Check nets and resume fishing when river conditions allow.' },
      { fr: 'Été', en: 'Summer', activityFr: 'Pêcher tôt et conserver les prises à l’abri de la chaleur.', activityEn: 'Fish early and keep the catch protected from heat.' },
      { fr: 'Automne', en: 'Autumn', activityFr: 'Entretenir la barque et préparer le matériel aux changements de temps.', activityEn: 'Maintain the boat and prepare gear for changing weather.' },
      { fr: 'Hiver', en: 'Winter', activityFr: 'Réparer les filets et éviter les sorties lorsque la rivière est dangereuse.', activityEn: 'Repair nets and avoid trips when the river is unsafe.' },
    ],
  },
  aveline: {
    stepsFr: ['Récolter et sélectionner les branches ou fibres adaptées', 'Trier et assouplir les matériaux', 'Préparer la base du panier', 'Tresser les côtés et renforcer le bord', 'Couper les extrémités et vérifier la solidité du panier'],
    stepsEn: ['Gather and select suitable branches or fibres', 'Sort and soften the materials', 'Prepare the basket base', 'Weave the sides and strengthen the rim', 'Trim the ends and check the basket’s strength'],
    seasons: [
      { fr: 'Printemps', en: 'Spring', activityFr: 'Récolter des matériaux souples et préparer les nouvelles fibres.', activityEn: 'Gather flexible materials and prepare new fibres.' },
      { fr: 'Été', en: 'Summer', activityFr: 'Tresser des paniers pour les récoltes et les usages quotidiens.', activityEn: 'Weave baskets for harvesting and everyday use.' },
      { fr: 'Automne', en: 'Autumn', activityFr: 'Fabriquer des paniers solides pour transporter les récoltes.', activityEn: 'Make sturdy baskets for carrying the harvest.' },
      { fr: 'Hiver', en: 'Winter', activityFr: 'Tresser à l’atelier et réparer les paniers usés.', activityEn: 'Weave indoors and repair worn baskets.' },
    ],
  },
  pierre: {
    stepsFr: ['Nettoyer la salle et préparer les tables', 'Vérifier les provisions et les ingrédients', 'Préparer les repas et les boissons commandés', 'Servir les voyageurs et les habitants', 'Nettoyer les ustensiles et organiser les réserves'],
    stepsEn: ['Clean the common room and prepare the tables', 'Check provisions and ingredients', 'Prepare ordered meals and drinks', 'Serve travellers and villagers', 'Clean utensils and organise supplies'],
    seasons: [
      { fr: 'Printemps', en: 'Spring', activityFr: 'Préparer l’auberge à accueillir les voyageurs de passage.', activityEn: 'Prepare the inn to welcome passing travellers.' },
      { fr: 'Été', en: 'Summer', activityFr: 'Organiser les repas et les chambres pendant les jours animés.', activityEn: 'Organise meals and rooms during busy days.' },
      { fr: 'Automne', en: 'Autumn', activityFr: 'Stocker les provisions et proposer des repas chauds.', activityEn: 'Store provisions and offer warm meals.' },
      { fr: 'Hiver', en: 'Winter', activityFr: 'Entretenir le foyer et accueillir les voyageurs à l’abri du froid.', activityEn: 'Maintain the hearth and shelter travellers from the cold.' },
    ],
  },
};


const defaultComments = (p: Professional): SocialComment[] => [
  {
    id: `${p.id}-comment-a`,
    author: 'Colette',
    text: 'Quel beau travail ! Merci de partager les nouvelles du village. ✨',
    englishText: 'What beautiful work! Thank you for sharing the village news. ✨',
    avatar: professionals[10].avatar,
  },
  {
    id: `${p.id}-comment-b`,
    author: 'Maître Pierre de Villon',
    text: 'Félicitations ! Nous sommes heureux de vous compter parmi nous.',
    englishText: 'Congratulations! We are happy to have you with us.',
    avatar: professionals[19].avatar,
  },
];

const makeProfessionalComments = (
  professional: Professional,
  professionalIndex: number
): SocialComment[] => {
  const frenchMessages = [
    'Quel magnifique travail ! Bravo pour ce beau savoir-faire. ✨',
    'Merci pour ces nouvelles du village. C’est très intéressant !',
    'Votre travail est vraiment admirable. Félicitations !',
    'Voilà une belle tradition de Villon qu’il faut préserver.',
    'J’aimerais beaucoup venir découvrir votre atelier un jour.',
    'Un travail réalisé avec patience et beaucoup de talent !',
    'Merci de partager votre quotidien avec toute la communauté.',
    'Quelle belle initiative pour les habitants de notre village !',
    'C’est toujours un plaisir de découvrir votre métier.',
    'Bravo ! Votre travail contribue à la vie de Villon. 🌿',
    'Les habitants du village ont de la chance de vous avoir !',
    'Une belle réalisation, faite avec soin et passion.',
    'J’espère pouvoir visiter votre établissement prochainement.',
    'Continuez à nous raconter les traditions de notre village !',
    'Félicitations pour ce travail remarquable. 👏',
  ];

  const englishMessages = [
    'What wonderful work! Congratulations on your craftsmanship. ✨',
    'Thank you for the village news. This is very interesting!',
    'Your work is truly admirable. Congratulations!',
    'This is a beautiful Villon tradition worth preserving.',
    'I would love to visit your workshop one day.',
    'Work completed with patience and great talent!',
    'Thank you for sharing your daily life with the community.',
    'What a lovely initiative for the people of our village!',
    'It is always a pleasure to discover your profession.',
    'Well done! Your work contributes to life in Villon. 🌿',
    'The villagers are lucky to have you!',
    'A beautiful creation, made with care and passion.',
    'I hope to visit your establishment soon.',
    'Keep sharing the traditions of our village with us!',
    'Congratulations on this remarkable work. 👏',
  ];

  const commentCount = professionalIndex % 2 === 0 ? 10 : 15;

  return Array.from({ length: commentCount }, (_, index) => {
    const otherProfessional =
      professionals[
        (professionalIndex + index + 1) % professionals.length
      ];

    const messageIndex =
      (professionalIndex * 3 + index) % frenchMessages.length;

    return {
      id: `${professional.id}-community-${index}`,
      author: otherProfessional.name,
      text: frenchMessages[messageIndex],
      englishText: englishMessages[messageIndex],
      avatar: otherProfessional.avatar,
    };
  });
};


export const SocialMedia: React.FC<SocialMediaProps> = ({ onClose }) => {
    const [dhakaDateKey, setDhakaDateKey] = useState(getDhakaDateKey);

  useEffect(() => {
    const timer = window.setInterval(() => {
      const today = getDhakaDateKey();
      setDhakaDateKey(previous => previous === today ? previous : today);
    }, 15000);

    return () => window.clearInterval(timer);
  }, []);

  
const dailyProfessionals = useMemo(() => {
  const day = Math.max(0, getVillonDayNumber(dhakaDateKey));
  const villonDate = getVillonDateKey(dhakaDateKey);

  return professionals.map((p, index) => {
    const [profession, category, dailyTitle] =
      dailyProfessionVariants[
        (index + day) % dailyProfessionVariants.length
      ];

    const professionSource = professionals.find(
      original => original.profession === profession
    );

    return {
      ...p,
      profession,
      category,
      postTitle: `${dailyTitle} — ${villonDate}`,
      postText:
        professionSource?.postText ??
        `${p.name} partage les nouvelles du village à ${p.building}.`,
      postImage: professionSource?.postImage ?? p.postImage,
    };
  });
}, [dhakaDateKey]);

  const [activeCategory, setActiveCategory] = useState('Tous');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostText, setNewPostText] = useState('');
  const [newPostSavoirFaire, setNewPostSavoirFaire] = useState('');
const [newPostSeasonalCalendar, setNewPostSeasonalCalendar] = useState('');
  const [newPostImage, setNewPostImage] = useState('');
  const [newPostImageName, setNewPostImageName] = useState('');
  const [expandedPosts, setExpandedPosts] = useState<Record<string, boolean>>({});
  const [translatedPosts, setTranslatedPosts] = useState<Record<string, boolean>>({});
  const [openArchive, setOpenArchive] = useState<{
  professionalId: string;
  type: 'savoir-faire' | 'saisons';
  postId?: string;
} | null>(null);

const [archiveEnglish, setArchiveEnglish] = useState(false);
 
const [openComments, setOpenComments] = useState<Record<string, boolean>>({});
const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});

const [translatedComments, setTranslatedComments] = useState<
  Record<string, boolean>
>({});

const [openReplies, setOpenReplies] = useState<Record<string, boolean>>({});
const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
const [commentReplies, setCommentReplies] = useState<
  Record<string, SocialComment[]>
>({});

  
const [comments, setComments] = useState<Record<string, SocialComment[]>>(() => {
  const seeded: Record<string, SocialComment[]> = {};

  professionals.forEach((p, index) => {
    seeded[`daily-${p.id}`] = makeProfessionalComments(p, index);
  });

  return seeded;
});

    const [posts, setPosts] = useState<SocialPost[]>(() =>
    professionals.map((p, i) => ({
      id: `daily-${p.id}`,
      professionalId: p.id,
      author: p.name,
      handle: p.handle,
      avatar: p.avatar,
      time: 'Aujourd’hui',
      title: p.postTitle,
      content: p.postText,
      image: p.postImage,
      likes: [34, 67, 28, 19, 42, 51, 16, 34, 23, 31, 18, 27, 15, 22, 39, 17, 21, 52, 14, 26][i],
      tag: `#${p.category.replace(/\s/g, '')}`,
      category: p.category,
    }))
  );
  const [unrollPhase, setUnrollPhase] = useState<'closed'|'unrolling'|'open'|'closing'>('open');
  const filteredProfessionals = useMemo(
    
    () =>
      dailyProfessionals.filter(p =>
        `${p.name} ${p.profession}`
          .toLowerCase()
          .includes(searchText.toLowerCase())
      ),
    [dailyProfessionals, searchText]
  );
  
  
useEffect(() => {
  setPosts(previous => {
    
    const personalPosts = previous.filter(
      post => !post.id.startsWith('daily-')
    );

    
    const villonDate = getVillonDateKey(dhakaDateKey);

  
    const freshDailyPosts: SocialPost[] = dailyProfessionals.map(
      (p, i) => ({
        id: `daily-${p.id}`,
        professionalId: p.id,
        author: p.name,
        handle: p.handle,
        avatar: p.avatar,
        time: `Villon • ${villonDate}`,
        title: p.postTitle,
        content: p.postText,
        image: p.postImage,
        likes: [
          34, 67, 28, 19, 42, 51, 16, 34, 23, 31,
          18, 27, 15, 22, 39, 17, 21, 52, 14, 26,
        ][i],
        tag: `#${p.category.replace(/\s/g, '')}`,
        category: p.category,
      })
    );

    return [...personalPosts, ...freshDailyPosts];
  });

  setSelectedProfessional(previous =>
    previous
      ? dailyProfessionals.find(p => p.id === previous.id) ?? null
      : null
  );

  setExpandedPosts({});
  setTranslatedPosts({});
  setOpenComments({});
  setCommentDrafts({});
}, [dhakaDateKey, dailyProfessionals]);


  const filteredPosts = useMemo(() => selectedProfessional ? posts.filter(p => p.professionalId === selectedProfessional.id) : activeCategory === 'Tous' ? posts : posts.filter(p => p.category === activeCategory), [posts, activeCategory, selectedProfessional]);

  const handleClose = () => { setUnrollPhase('closing'); window.setTimeout(onClose, 250); };
  const handleLike = (id: string) => setPosts(prev => prev.map(p => p.id === id ? {...p, likes:p.isLiked ? p.likes - 1 : p.likes + 1, isLiked:!p.isLiked} : p));
 
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    if (!file.type.startsWith('image/')) { alert('Veuillez sélectionner une image.'); return; }
    if (file.size > 5 * 1024 * 1024) { alert("L'image doit faire moins de 5 MB."); return; }
    const reader = new FileReader(); reader.onload = () => { if (typeof reader.result === 'string') { setNewPostImage(reader.result); setNewPostImageName(file.name); } };
    reader.readAsDataURL(file); e.target.value = '';
  };
  
const createPost = (e: React.FormEvent) => {
  e.preventDefault();

  if (
    !newPostTitle.trim() &&
    !newPostText.trim() &&
    !newPostImage &&
    !newPostSavoirFaire.trim() &&
    !newPostSeasonalCalendar.trim()
  ) return;

  const p = selectedProfessional
    ? dailyProfessionals.find(
        item => item.id === selectedProfessional.id
      ) ?? dailyProfessionals[0]
    : null;

  const newPost: SocialPost = {
    id: `post-${Date.now()}`,
    professionalId: p?.id ?? 'visitor',
    author: p?.name ?? 'Vous (Voyageur)',
    handle: p?.handle ?? '@voyageur_villon',
    avatar: p?.avatar ?? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    time: "à l'instant",
    title: newPostTitle.trim() || 'Nouvelle annonce',
    content: newPostText.trim(),
    image: newPostImage || undefined,

    savoirFaire: newPostSavoirFaire.trim() || undefined,
    seasonalCalendar: newPostSeasonalCalendar.trim() || undefined,

    likes: 0,
    tag: p ? `#${p.category.replace(/\s/g, '')}` : '#VillonWood',
    category: p?.category ?? 'Village'
  };

  setPosts(prev => [newPost, ...prev]);

  setNewPostTitle('');
  setNewPostText('');
  setNewPostImage('');
  setNewPostImageName('');
  setNewPostSavoirFaire('');
  setNewPostSeasonalCalendar('');
};

  
const addComment = (post: SocialPost) => {
  const text = (commentDrafts[post.id] ?? '').trim();
  if (!text) return;

  const comment: SocialComment = {
    id: `comment-${Date.now()}`,
    author: 'Vous',
    text,
    englishText: text,
    avatar:
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  };

  setComments(prev => ({
    ...prev,
    [post.id]: [...(prev[post.id] ?? []), comment],
  }));

  setCommentDrafts(prev => ({ ...prev, [post.id]: '' }));
  setOpenComments(prev => ({ ...prev, [post.id]: true }));
};

const addReply = (comment: SocialComment) => {
  const text = (replyDrafts[comment.id] ?? '').trim();
  if (!text) return;

  const reply: SocialComment = {
    id: `reply-${Date.now()}`,
    author: 'Vous',
    text,
    englishText: text,
    avatar:
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  };

  setCommentReplies(prev => ({
    
    ...prev,
    [comment.id]: [...(prev[comment.id] ?? []), reply],
  }));
  

  setReplyDrafts(prev => ({ ...prev, [comment.id]: '' }));
  setOpenReplies(prev => ({ ...prev, [comment.id]: true }));
};

 
 
const goToProfessional = (p: Professional) => {
  const current = dailyProfessionals.find(item => item.id === p.id);
  if (!current) return;

  setSelectedProfessional(current);
  setSearchOpen(false);
  setSearchText('');
  setActiveCategory('Tous');
};


  return <div onClick={handleClose} style={{position:'fixed',inset:0,zIndex:200,display:'flex',alignItems:'center',justifyContent:'center',padding:16,overflow:'hidden',backgroundImage:`linear-gradient(rgba(43,23,8,.72),rgba(43,23,8,.72)),url(${mapImage})`,backgroundSize:'cover',backgroundPosition:'center',opacity:unrollPhase==='closing'?0:1,transition:'opacity .25s ease'}}>
    <div className={`villon-scroll-wrapper relative z-10 phase-${unrollPhase}`} onClick={e=>e.stopPropagation()} style={{width:'min(980px,96vw)',maxHeight:'94vh',display:'flex',flexDirection:'column',marginLeft:0}}>
      <div className="scroll-roller scroll-roller-top"><div className="roller-finial finial-left"><div className="finial-tip"/><div className="finial-ball"/></div><div className="roller-bar"><div className="roller-brass-ring ring-left"/><div className="roller-wood-core"/><div className="roller-brass-ring ring-right"/></div><div className="roller-finial finial-right"><div className="finial-ball"/><div className="finial-tip"/></div></div>
      <div className="scroll-unfurl-container" style={{display:'flex',flexDirection:'column',overflow:'hidden',minHeight:0}}><div className="scroll-paper-curl-top"/>
        <div className="scroll-parchment-body" style={{display:'flex',flexDirection:'column',height:'100%',minHeight:0,overflow:'hidden'}}>
          <div className="scroll-wax-seal-ribbon"><div className="wax-ribbon ribbon-left"/><div className="wax-ribbon ribbon-right"/><div className="wax-seal-disc"><span className="wax-monogram">⚜</span></div></div>
          <div className="social-header scroll-header" style={{display:'flex',alignItems:'center',gap:12,flexWrap:'wrap'}}><div className="social-header-brand" style={{flex:'1 1 280px',minWidth:0}}><div className="scroll-icon-badge"><Scroll size={22}/></div><div><div className="scroll-pretitle">Chronique & Écrits Communaux • Anno 1784</div><h2 className="scroll-title">La Gazette de Villon <CheckCircle2 size={16} className="verified-crest"/></h2><p className="scroll-subtitle">Le Fil Social officiel du Village de Villon</p></div></div>{!selectedProfessional && <div className="social-category-bar" style={{display:'flex',alignItems:'center',justifyContent:'flex-end',gap:8,flexWrap:'wrap',flex:'0 1 auto',marginLeft:'auto'}}><button type="button" className={`category-pill ${activeCategory==='Tous'?'active':''}`} onClick={()=>setActiveCategory('Tous')}>Tous</button><button type="button" className="category-pill" onClick={()=>{setSearchOpen(v=>!v);setSearchText('');}}><Search size={14} style={{display:'inline',verticalAlign:'middle',marginRight:5}}/>Rechercher</button></div>}<button className="scroll-close-btn" onClick={handleClose} title="Enrouler le parchemin"><X size={18}/></button></div>
          {selectedProfessional && <div style={{display:'flex',alignItems:'center',gap:10,padding:'10px 18px',flexShrink:0}}><button type="button" className="gazette-nav-btn" onClick={()=>setSelectedProfessional(null)}><ArrowLeft size={16}/> Retour au fil Tous</button><span style={{fontSize:12,color:'#704321'}}>Profil professionnel</span></div>}
          {selectedProfessional && <div style={{margin:'0 16px 12px',border:'1px solid rgba(92,53,24,.3)',borderRadius:12,overflow:'hidden',background:'#f7e8c9',flexShrink:0}}>
            <div style={{height:150,backgroundImage:`linear-gradient(transparent,rgba(36,20,9,.52)),url(${selectedProfessional.cover})`,backgroundSize:'cover',backgroundPosition:'center',position:'relative'}}><span style={{position:'absolute',bottom:12,left:16,color:'#fff',fontWeight:800,fontSize:18,textShadow:'0 2px 4px #241409'}}>{selectedProfessional.building}</span></div>
            <div style={{display:'flex',alignItems:'center',gap:12,padding:'12px 16px'}}><img src={selectedProfessional.avatar} alt={selectedProfessional.name} style={{width:64,height:64,borderRadius:'50%',objectFit:'cover',border:'3px solid #d7b777',marginTop:-34,position:'relative',background:'#fff'}}/><div style={{flex:1,minWidth:0}}><div style={{fontWeight:800,fontSize:17,color:'#4d2c15'}}>{selectedProfessional.name}</div><div style={{fontSize:13,color:'#80532d'}}><BriefcaseBusiness size={13} style={{display:'inline',verticalAlign:'middle',marginRight:4}}/>{selectedProfessional.profession}</div><div style={{fontSize:12,color:'#80532d'}}>{selectedProfessional.handle}</div></div><span style={{fontSize:12,color:'#80532d',textAlign:'right'}}><MapPin size={13} style={{display:'inline',verticalAlign:'middle'}}/> Villon</span></div>
          </div>}
          {!selectedProfessional && <form onSubmit={createPost} className="create-post-card parchment-post-card"><div className="create-post-top"><img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80" alt="Vous" className="create-post-avatar parchment-avatar" style={{width:42,height:42,minWidth:42,objectFit:'cover',borderRadius:'50%'}}/><div className="parchment-input-wrapper"><input type="text" className="create-post-title-input parchment-input" placeholder="Titre de votre annonce..." value={newPostTitle} onChange={e=>setNewPostTitle(e.target.value)}/><textarea className="create-post-input parchment-input" rows={2} placeholder="Rédigez une missive pour la communauté..." value={newPostText} onChange={e=>setNewPostText(e.target.value)}/>{newPostImage && <div style={{position:'relative',marginTop:10,borderRadius:10,overflow:'hidden'}}><img src={newPostImage} alt="Aperçu" style={{display:'block',width:'100%',maxHeight:150,objectFit:'cover'}}/><div style={{display:'flex',justifyContent:'space-between',padding:7,fontSize:11}}><span>{newPostImageName}</span><button type="button" onClick={()=>{setNewPostImage('');setNewPostImageName('');}}><Trash2 size={14}/></button></div></div>}</div></div><div className="create-post-bottom parchment-post-bottom" style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:10,flexWrap:'wrap'}}><div style={{display:'flex',alignItems:'center',gap:10,flexWrap:'wrap'}}><label htmlFor="post-image-upload" title="Ajouter une image" style={{display:'inline-flex',alignItems:'center',gap:6,padding:'7px 11px',borderRadius:8,cursor:'pointer',fontSize:12,color:'#5c3518',border:'1px solid rgba(92,53,24,.35)'}}><ImagePlus size={15}/>Ajouter une image</label><input id="post-image-upload" type="file" accept="image/*" onChange={handleImageUpload} style={{display:'none'}}/><span className="create-post-tag parchment-tag"><Sparkles size={13}/> #VillonWood</span></div><button type="submit" className="post-submit-btn parchment-submit-btn" disabled={!newPostText.trim()}><Send size={13}/><span>Publier</span></button></div></form>}
          {searchOpen && <div style={{margin:'0 16px 12px',padding:14,border:'1px solid rgba(92,53,24,.3)',borderRadius:12,background:'#fff5df',boxShadow:'0 8px 24px #3b210e33',flexShrink:0}}><div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10}}><Search size={17}/><input autoFocus value={searchText} onChange={e=>setSearchText(e.target.value)} placeholder="Nom ou métier du professionnel..." style={{flex:1,minWidth:0,padding:'10px 12px',border:'1px solid #c8a978',borderRadius:8,background:'#fffaf0',color:'#4d2c15'}}/><button type="button" onClick={()=>setSearchOpen(false)} aria-label="Fermer la recherche"><X size={18}/></button></div><div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(205px,1fr))',gap:8,maxHeight:220,overflowY:'auto'}}>{filteredProfessionals.map(p=><button type="button" key={p.id} onClick={()=>goToProfessional(p)} style={{display:'flex',alignItems:'center',gap:10,textAlign:'left',padding:9,border:'1px solid #e0c89f',borderRadius:9,background:'#fffaf0',cursor:'pointer',color:'#4d2c15'}}><img src={p.avatar} alt="" style={{width:38,height:38,borderRadius:'50%',objectFit:'cover',flexShrink:0}}/><span style={{minWidth:0}}><strong style={{display:'block',fontSize:12}}>{p.name}</strong><small style={{display:'block',fontSize:11,color:'#80532d'}}>{p.profession}</small></span><ChevronRight size={15} style={{marginLeft:'auto',flexShrink:0}}/></button>)}</div>{filteredProfessionals.length===0&&<p style={{fontSize:13}}>Aucun professionnel trouvé.</p>}</div>}
          <div className="gazette-nav-bar" style={{flexShrink:0}}><span className="gazette-nav-counter">{selectedProfessional ? `Profil de ${selectedProfessional.name}` : `${filteredPosts.length} publications • ${professionals.length} professionnels`}</span><span style={{fontSize:12,color:'#80532d'}}>{selectedProfessional ? selectedProfessional.profession : 'Chroniques du village'}</span></div>
          <div className="social-feed-list parchment-feed-list" style={{minHeight:0,flex:1,overflowY:'auto',overscrollBehavior:'contain',padding:'0 14px 18px'}}>
            {filteredPosts.map(post=>{const isExpanded=!!expandedPosts[post.id];const professional =
  dailyProfessionals.find(p => p.id === post.professionalId) ?? professionals[0];const postComments = comments[post.id] ?? [];
const postCommentCount = postComments.reduce(
  (total, comment) =>
    total + 1 + (commentReplies[comment.id]?.length ?? 0),
  0
);
return <div key={post.id} className="feed-post-card parchment-notice-card" style={{padding:'24px',marginTop:20,marginBottom:20,border:'1px solid rgba(92,53,24,.28)',borderRadius:16,background:'#fffaf0',boxShadow:'0 4px 14px rgba(63,35,14,.16)',animation:'villonPostAppear .45s ease both',overflow:'visible'}}>
              <div className="post-header parchment-card-header" style={{display:'flex',alignItems:'center',gap:12,marginBottom:12,position:'relative'}}><button type="button" onClick={()=>goToProfessional(professional)} title={`Voir le profil de ${post.author}`} style={{padding:0,border:0,background:'transparent',cursor:'pointer',borderRadius:'50%'}}><img src={post.avatar} alt={post.author} className="post-author-avatar parchment-author-avatar" style={{width:44,height:44,minWidth:44,objectFit:'cover',borderRadius:'50%'}}/></button><div className="post-author-info" style={{flex:1,minWidth:0}}><button type="button" onClick={()=>goToProfessional(professional)} className="post-author-name parchment-author-name" style={{fontWeight:'bold',border:0,background:'transparent',padding:0,cursor:'pointer',textAlign:'left',color:'inherit'}}>{post.author}</button><div className="post-meta parchment-meta" style={{display:'flex',gap:8,fontSize:12,flexWrap:'wrap'}}><span>{post.handle}</span><span>•</span><span>{post.time}</span></div><div style={{fontSize:11,color:'#80532d',marginTop:2}}>{post.author} · {post.category}</div></div><span className="post-badge-tag parchment-badge-tag">{post.tag}</span></div>


<h3 className="parchment-post-title" style={{fontSize:22,lineHeight:1.4,margin:'10px 0 14px',color:'#4b2b16'}}>
  {translatedPosts[post.id] ? (englishTranslations[post.professionalId]?.title ?? post.title) : post.title}
</h3>

{post.image && (
  <div
    className="post-image-wrapper parchment-image-frame"
    style={{
      width: '100%',
      aspectRatio: '3 / 4',
      margin: '12px 0 16px',
      borderRadius: 12,
      overflow: 'hidden',
      background: '#f1e5d0',
      boxSizing: 'border-box',
      position: 'relative',
      flexShrink: 0
    }}
  >
    <img
      src={post.image}
      alt={post.title}
      className="post-image parchment-image"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        objectPosition: 'center',
        display: 'block'
      }}
    />
  </div>
)}

              <div className={`post-content parchment-content ${isExpanded?'expanded':'truncated'}`} style={{fontSize:15,lineHeight:1.75,overflowWrap:'anywhere',marginTop:12}}>{translatedPosts[post.id] ? (englishTranslations[post.professionalId]?.content ?? post.content) : post.content}</div><div style={{display:'flex',alignItems:'center',gap:12,flexWrap:'wrap',marginTop:8}}><button type="button" onClick={()=>setTranslatedPosts(prev=>({...prev,[post.id]:!prev[post.id]}))} style={{display:'inline-flex',alignItems:'center',gap:6,border:'1px solid #b78a50',borderRadius:20,padding:'6px 11px',background:'#fff3d8',color:'#68401f',fontSize:12,fontWeight:700,cursor:'pointer'}}>{translatedPosts[post.id] ? 'Voir en français' : 'Translate to English'}</button><button type="button" className="see-more-btn parchment-see-more" onClick={()=>setExpandedPosts(prev=>({...prev,[post.id]:!prev[post.id]}))}>{isExpanded?<><span>Voir moins</span><ChevronUp size={14}/></>:<><span>Voir la suite</span><ChevronDown size={14}/></>}</button></div>

<div
  className="post-actions-bar parchment-actions-bar"
  style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}
>
  <button
    type="button"
    className={`action-btn parchment-action-btn ${post.isLiked ? 'liked' : ''}`}
    onClick={() => handleLike(post.id)}
  >
    <Heart
      size={16}
      fill={post.isLiked ? 'currentColor' : 'none'}
    />
    <span>{post.likes} J’aime</span>
  </button>

  <button
    type="button"
    className="action-btn parchment-action-btn"
    onClick={() =>
      setOpenComments(prev => ({
        ...prev,
        [post.id]: !prev[post.id],
      }))
    }
  >
    <MessageSquare size={16} />
    <span>{postCommentCount} Commentaires</span>
  </button>

  <button
    type="button"
    className="action-btn parchment-action-btn"
    onClick={() => {
      setArchiveEnglish(false);
      setOpenArchive({
  professionalId: post.professionalId,
  type: 'savoir-faire',
  postId: post.id,
});
    }}
  >
    <ScrollText size={16} />
    <span>Le Savoir-faire</span>
  </button>

  <button
    type="button"
    className="action-btn parchment-action-btn"
    onClick={() => {
      setArchiveEnglish(false);
      setOpenArchive({
  professionalId: post.professionalId,
  type: 'saisons',
  postId: post.id,
});
    }}
  >
    <CalendarDays size={16} />
    <span>Le Calendrier des saisons</span>
  </button>
</div>




{openComments[post.id] && (
  <div
    onClick={e => {
      e.stopPropagation();
      setOpenComments(prev => ({
        ...prev,
        [post.id]: false,
      }));
    }}
    style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      background: 'rgba(35, 20, 10, 0.68)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
    }}
  >
    <div
      className="villon-comment-letter"
      onClick={e => e.stopPropagation()}
      style={{
        padding: '20px 16px',
        border: '2px solid #b89562',
        borderRadius: 8,
        background:
          'linear-gradient(135deg, #f8edcf 0%, #ead6ad 50%, #f8edcf 100%)',
        boxShadow: '0 12px 40px rgba(0,0,0,.35)',
        color: '#4d2c15',
        width: 'min(620px, 100%)',
        maxHeight: '80vh',
        overflowY: 'auto',
        transformOrigin: 'top center',
      }}
    >


    <h4 style={{ margin: '0 0 14px', fontSize: 15 }}>
      Commentaires de la communauté
    </h4>

    {postComments.map(comment => (
      <div
        key={comment.id}
        style={{
          display: 'flex',
          gap: 9,
          marginBottom: 16,
          alignItems: 'flex-start',
        }}
      >
        <img
          src={comment.avatar}
          alt={comment.author}
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            objectFit: 'cover',
            flexShrink: 0,
          }}
        />

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              background: '#f5e8cf',
              border: '1px solid rgba(92,53,24,.16)',
              borderRadius: '4px 14px 14px 14px',
              padding: '10px 12px',
            }}
          >
            <strong style={{ fontSize: 13 }}>
              {comment.author}
            </strong>

            <p
              style={{
                fontSize: 13,
                lineHeight: 1.65,
                margin: '5px 0 0',
                overflowWrap: 'anywhere',
              }}
            >
              {translatedComments[comment.id]
                ? comment.englishText ?? comment.text
                : comment.text}
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              gap: 14,
              flexWrap: 'wrap',
              margin: '6px 0 8px 8px',
            }}
          >
            <button
              type="button"
              onClick={() =>
                setTranslatedComments(prev => ({
                  ...prev,
                  [comment.id]: !prev[comment.id],
                }))
              }
              style={{
                border: 0,
                padding: 0,
                background: 'transparent',
                color: '#80532d',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {translatedComments[comment.id]
                ? 'Voir en français'
                : 'See English'}
            </button>

            <button
              type="button"
              onClick={() =>
                setOpenReplies(prev => ({
                  ...prev,
                  [comment.id]: !prev[comment.id],
                }))
              }
              style={{
                border: 0,
                padding: 0,
                background: 'transparent',
                color: '#80532d',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Reply
            </button>
          </div>

          {(commentReplies[comment.id] ?? []).map(reply => (
            <div
              key={reply.id}
              style={{
                display: 'flex',
                gap: 8,
                margin: '10px 0 10px 12px',
                alignItems: 'flex-start',
              }}
            >
              <img
                src={reply.avatar}
                alt={reply.author}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  flexShrink: 0,
                }}
              />

              <div
                style={{
                  background: '#fff5df',
                  border: '1px solid rgba(92,53,24,.15)',
                  borderRadius: '4px 12px 12px 12px',
                  padding: '8px 10px',
                  flex: 1,
                  minWidth: 0,
                }}
              >
                <strong style={{ fontSize: 12 }}>
                  {reply.author}
                </strong>

                <p
                  style={{
                    margin: '4px 0 0',
                    fontSize: 13,
                    lineHeight: 1.6,
                    overflowWrap: 'anywhere',
                  }}
                >
                  {reply.text}
                </p>
              </div>
            </div>
          ))}

          {openReplies[comment.id] && (
            <form
              onSubmit={e => {
                e.preventDefault();
                addReply(comment);
              }}
              style={{
                display: 'flex',
                gap: 7,
                alignItems: 'center',
                margin: '8px 0 8px 8px',
              }}
            >
              <input
                value={replyDrafts[comment.id] ?? ''}
                onChange={e =>
                  setReplyDrafts(prev => ({
                    ...prev,
                    [comment.id]: e.target.value,
                  }))
                }
                placeholder={`Répondre à ${comment.author}...`}
                aria-label={`Répondre à ${comment.author}`}
                style={{
                  flex: 1,
                  minWidth: 0,
                  padding: '9px 12px',
                  border: '1px solid #c8a978',
                  borderRadius: 20,
                  background: '#fffaf0',
                  color: '#4d2c15',
                }}
              />

              <button
                type="submit"
                disabled={!(replyDrafts[comment.id] ?? '').trim()}
                aria-label="Envoyer la réponse"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 34,
                  height: 34,
                  border: 0,
                  borderRadius: '50%',
                  background: '#7a4b24',
                  color: '#fff5df',
                  cursor: 'pointer',
                  opacity: (replyDrafts[comment.id] ?? '').trim()
                    ? 1
                    : 0.5,
                }}
              >
                <Send size={15} />
              </button>
            </form>
          )}
        </div>
      </div>
    ))}

    <form
      onSubmit={e => {
        e.preventDefault();
        addComment(post);
      }}
      style={{
        display: 'flex',
        gap: 8,
        alignItems: 'center',
        marginTop: 14,
      }}
    >
      <img
        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
        alt="Vous"
        style={{
          width: 34,
          height: 34,
          borderRadius: '50%',
          objectFit: 'cover',
          flexShrink: 0,
        }}
      />

      <input
        value={commentDrafts[post.id] ?? ''}
        onChange={e =>
          setCommentDrafts(prev => ({
            ...prev,
            [post.id]: e.target.value,
          }))
        }
        placeholder="Écrire un commentaire..."
        aria-label="Écrire un commentaire"
        style={{
          flex: 1,
          minWidth: 0,
          padding: '11px 14px',
          border: '1px solid #c8a978',
          borderRadius: 22,
          background: '#fffaf0',
          color: '#4d2c15',
        }}
      />

      <button
        type="submit"
        disabled={!(commentDrafts[post.id] ?? '').trim()}
        aria-label="Publier le commentaire"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 38,
          height: 38,
          border: 0,
          borderRadius: '50%',
          background: '#7a4b24',
          color: '#fff5df',
          cursor: 'pointer',
          opacity: (commentDrafts[post.id] ?? '').trim() ? 1 : 0.5,
        }}
      >
        <Send size={16} />
      </button>
    </form>
    </div>
  </div>
)}

            </div>;})}


{openArchive && (() => {
  const professional =
    dailyProfessionals.find(
      p => p.id === openArchive.professionalId
    ) ??
    professionals.find(
      p => p.id === openArchive.professionalId
    );

  const selectedPost = openArchive.postId
    ? posts.find(post => post.id === openArchive.postId)
    : undefined;

  const isVisitorPost =
    selectedPost?.professionalId === 'visitor' ||
    openArchive.professionalId === 'visitor';

  const work = professional
    ? professionalWork[professional.id]
    : undefined;

  if (!professional && !isVisitorPost) return null;
  if (!isVisitorPost && !work) return null;

  const isEnglish = archiveEnglish;

  return (
    <div
      onClick={() => setOpenArchive(null)}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'rgba(35, 20, 10, 0.72)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
    >
      <div
        className="villon-archive-letter"
        onClick={e => e.stopPropagation()}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 650,
          maxHeight: '88vh',
          overflowY: 'auto',
          padding: '28px 24px',
          background: '#f7e7c5',
          color: '#4b2b16',
          border: '3px solid #ad8751',
          borderRadius: 8,
          boxShadow: '0 15px 50px #0007',
          animation: 'villonLetterOpen 0.6s ease both',
          backgroundImage:
            'linear-gradient(135deg, rgba(255,255,255,.25), transparent 55%)',
        }}
      >
        <button
          type="button"
          onClick={() => setOpenArchive(null)}
          aria-label="Fermer"
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            width: 36,
            height: 36,
            border: '1px solid #ad8751',
            borderRadius: '50%',
            background: '#fff5df',
            color: '#4b2b16',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <X size={19} />
        </button>

        <div style={{ textAlign: 'center', padding: '8px 12px 18px' }}>
          <ScrollText
            size={34}
            style={{ margin: '0 auto 10px' }}
          />

          <h2
            style={{
              margin: '0 0 10px',
              fontFamily: 'Georgia, serif',
              fontSize: 25,
            }}
          >
            {openArchive.type === 'savoir-faire'
              ? 'Le Savoir-faire'
              : 'Le Calendrier des saisons'}
          </h2>

          <div
            style={{
              width: 100,
              height: 2,
              background: '#ad8751',
              margin: '0 auto 14px',
            }}
          />

          <h3 style={{ margin: '0 0 5px', fontSize: 20 }}>
            {selectedPost?.author ?? professional?.name ?? 'Voyageur'}
          </h3>

          <p style={{ margin: '0 0 5px', fontStyle: 'italic' }}>
            {isVisitorPost
              ? 'Voyageur de Villon'
              : professional?.profession}
          </p>

          <p style={{ margin: 0, fontSize: 13 }}>
            <MapPin
              size={14}
              style={{
                display: 'inline',
                verticalAlign: 'middle',
                marginRight: 4,
              }}
            />
            {professional?.building ?? 'Village de Villon'}
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: 22,
          }}
        >
          <button
            type="button"
            onClick={() => setArchiveEnglish(value => !value)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '9px 16px',
              border: '1px solid #ad8751',
              borderRadius: 20,
              background: '#fff5df',
              color: '#4b2b16',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            <Languages size={17} />
            {isEnglish ? 'Passer en français' : 'Read in English'}
          </button>
        </div>

        {isVisitorPost ? (
          <section>
            <h3
              style={{
                borderBottom: '1px solid #c8a978',
                paddingBottom: 10,
                fontSize: 19,
              }}
            >
              Information
            </h3>

            <p
              style={{
                padding: 18,
                border: '1px dashed #c8a978',
                borderRadius: 10,
                background: '#fff5df',
                textAlign: 'center',
                lineHeight: 1.8,
                whiteSpace: 'pre-wrap',
              }}
            >
              {isEnglish
                ? 'This feature is reserved for Villon professionals.'
                : 'Cette fonctionnalité est réservée aux professionnels de Villon.'}
            </p>
          </section>
        ) : openArchive.type === 'savoir-faire' ? (
          <section>
            <h3
              style={{
                borderBottom: '1px solid #c8a978',
                paddingBottom: 10,
                fontSize: 19,
              }}
            >
              {isEnglish
                ? 'The craft, step by step'
                : 'Les étapes du métier'}
            </h3>

            <ol style={{ paddingLeft: 24, lineHeight: 1.8 }}>
              {work!.stepsFr.map((step, index) => (
                <li key={index} style={{ marginBottom: 12 }}>
                  {isEnglish
                    ? (work!.stepsEn[index] ?? step)
                    : step}
                </li>
              ))}
            </ol>
          </section>
        ) : (
          <section>
            <h3
              style={{
                borderBottom: '1px solid #c8a978',
                paddingBottom: 10,
                fontSize: 19,
              }}
            >
              {isEnglish
                ? 'The village through the seasons'
                : 'Le village au fil des saisons'}
            </h3>

            {work!.seasons.map((season, index) => (
              <div
                key={season.fr}
                style={{
                  margin: '14px 0',
                  padding: 14,
                  border: '1px solid #c8a978',
                  borderRadius: 10,
                  background: '#fff5df',
                }}
              >
                <h3 style={{ margin: '0 0 8px', fontSize: 17 }}>
                  {index === 0
                    ? '🌱 '
                    : index === 1
                    ? '☀️ '
                    : index === 2
                    ? '🍂 '
                    : '❄️ '}
                  {isEnglish ? season.en : season.fr}
                </h3>

                <p style={{ margin: 0, lineHeight: 1.7 }}>
                  {isEnglish
                    ? season.activityEn
                    : season.activityFr}
                </p>
              </div>
            ))}
          </section>
        )}
     

        <div
          style={{
            textAlign: 'center',
            marginTop: 24,
            paddingTop: 14,
            borderTop: '1px solid #c8a978',
            fontFamily: 'Georgia, serif',
            fontStyle: 'italic',
          }}
        >
          {isEnglish
            ? 'The living heritage of Villon'
            : 'Le patrimoine vivant de Villon'}
        </div>
      </div>
    </div>
  );
})()}

            {filteredPosts.length===0&&<div className="empty-feed-notice"><p>Aucune publication pour le moment.</p></div>}
          </div>
        </div><div className="scroll-paper-curl-bottom"/></div>
      <div className="scroll-roller scroll-roller-bottom"><div className="roller-finial finial-left"><div className="finial-tip"/><div className="finial-ball"/></div><div className="roller-bar"><div className="roller-brass-ring ring-left"/><div className="roller-wood-core"/><div className="roller-brass-ring ring-right"/></div><div className="roller-finial finial-right"><div className="finial-ball"/><div className="finial-tip"/></div></div>
      <style>{`
      @keyframes villonLetterOpen {
  0% {
    opacity: 0;
    transform: scaleY(0.12) scaleX(0.94);
  }

  65% {
    opacity: 1;
    transform: scaleY(1.03) scaleX(1);
  }

  100% {
    opacity: 1;
    transform: scaleY(1) scaleX(1);
  }
}

.villon-archive-letter {
  scrollbar-width: thin;
  scrollbar-color: #ad8751 #f3e2c2;
}
@keyframes villonPostAppear {
  from { opacity: 0; transform: translateY(9px); }
  to { opacity: 1; transform: translateY(0); }
}

.parchment-feed-list {
  scroll-behavior: smooth;
}

.parchment-notice-card img {
  max-width: 100%;
}

.parchment-content {
  white-space: normal;
  overflow-wrap: anywhere;
}

.parchment-notice-card .post-image-wrapper.parchment-image-frame {
  display: block !important;
  width: 50% !important;
  height: auto !important;
  aspect-ratio: 4 / 4 !important;
  margin: 12px auto 16px !important;
  min-height: 0 !important;
  max-height: none !important;
  overflow: hidden !important;
  flex-shrink: 0 !important;
  position: relative !important;
}

.parchment-notice-card .post-image-wrapper.parchment-image-frame .post-image {
  display: block !important;
  width: 100% !important;
  height: 100% !important;
  aspect-ratio: auto !important;
  max-height: none !important;
  object-fit: cover !important;
  object-position: center !important;
}

@media (max-width: 300px) {
  .scroll-title { font-size: 20px !important; }
  .scroll-pretitle { font-size: 9px !important; }
  .social-header { gap: 8px !important; }
  .create-post-card { padding: 10px !important; }
  .post-actions-bar { gap: 4px !important; flex-wrap: wrap !important; }
  .action-btn { font-size: 11px !important; padding: 6px !important; }
  .post-badge-tag { display: none !important; }
}
`}</style>
    </div>
  </div>;
};

export default SocialMedia;
