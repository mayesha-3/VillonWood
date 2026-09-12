import type { VillagerProfession } from '../types/village';

export const VILLAGERS_DATA: VillagerProfession[] = [
  {
    id: 'farmer',
    name: 'Fermier / Paysan',
    frenchTitle: 'Le Paysan & Fermier',
    characterName: 'Maître Bertrand',
    structureName: 'Grange à blé et fermes de Villon',
    category: 'Alimentation et agriculture',
    x: 18,
    y: 76,
    description: 'Cultive les terres fertiles autour du village et récolte le blé, le seigle et l’orge pour la boulangerie.',
    defaultQuote: 'La brume matinale annonce la pluie pour la récolte du blé. Bienvenue dans nos champs !',
    avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
    iconName: 'Wheat',
    activeOccupantsCount: 5,
    sampleMessages: [
      { id: 'm1', sender: 'Maître Bertrand', avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80', time: '10:12', text: 'Bonjour à tous ! La récolte de seigle donne 30 sacs aujourd’hui.', role: 'Fermier' },
      { id: 'm2', sender: 'Lucie', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', time: '10:14', text: 'Avez-vous besoin d’aide pour botteler la paille vers midi ?' },
      { id: 'm3', sender: 'Pierre', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', time: '10:15', text: 'J’arrive avec deux chevaux pour charger la charrette à grains !' }
    ]
  },
  {
    id: 'vigneron',
    name: 'Vigneron',
    frenchTitle: 'Le Vigneron',
    characterName: 'Jacques du Clos',
    structureName: 'Vignoble ensoleillé et caves des coteaux',
    category: 'Alimentation et agriculture',
    x: 74,
    y: 27,
    description: 'Entretient les vignes anciennes des coteaux, presse les grands crus à la main et élève le vin en fûts de chêne.',
    defaultQuote: 'Le soleil et le calcaire créent le plus beau nectar rouge de VillonWood.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    iconName: 'Wine',
    activeOccupantsCount: 4,
    sampleMessages: [
      { id: 'm1', sender: 'Jacques du Clos', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', time: '09:40', text: 'Les raisins de pinot sont mûrs ! La dégustation commence au coucher du soleil dans la cave.', role: 'Vigneron' },
      { id: 'm2', sender: 'Gaspard', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80', time: '09:45', text: 'Gardez deux carafes pour l’aubergiste ce soir !' }
    ]
  },
  {
    id: 'shepherd',
    name: 'Berger',
    frenchTitle: 'Le Berger',
    characterName: 'Guillaume',
    structureName: 'Bergerie des hauts pâturages',
    category: 'Alimentation et agriculture',
    x: 82,
    y: 72,
    description: 'Guide le troupeau sur les collines, récolte la laine brute et le protège des loups de la forêt.',
    defaultQuote: 'Mon fidèle chien et moi veillons pendant que le village dort sous les étoiles.',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    iconName: 'Cloud',
    activeOccupantsCount: 3,
    sampleMessages: [
      { id: 'm1', sender: 'Guillaume', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80', time: '08:15', text: 'Le troupeau broute paisiblement près de la crête. La laine tondue est prête pour la tisserande.', role: 'Berger' },
      { id: 'm2', sender: 'Colette', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', time: '08:30', text: 'Parfait, je viens chercher cinq toisons !' }
    ]
  },
  {
    id: 'cattle_herder',
    name: 'Bouvier',
    frenchTitle: 'Le Bovier / Bouvier',
    characterName: 'Etienne',
    structureName: 'Pâturages et enclos du bétail',
    category: 'Alimentation et agriculture',
    x: 12,
    y: 46,
    description: 'S’occupe des bœufs de trait et des troupeaux laitiers essentiels aux labours et à la livraison du lait frais.',
    defaultQuote: 'Des bœufs robustes facilitent le travail de tout le village.',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    iconName: 'Shield',
    activeOccupantsCount: 2,
    sampleMessages: [
      { id: 'm1', sender: 'Etienne', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80', time: '07:30', text: 'Les seaux de lait frais du matin sont prêts pour le fromager !', role: 'Bouvier' }
    ]
  },
  {
    id: 'miller',
    name: 'Miller',
    frenchTitle: 'Le Meunier',
    characterName: 'Maître Charles',
    structureName: 'Moulin à vent et à grains de la rivière',
    category: 'Alimentation et agriculture',
    x: 32,
    y: 34,
    description: 'Utilise les roues du vent et de l’eau pour moudre le seigle, l’orge et le blé en sacs de farine dorée.',
    defaultQuote: 'Écoutez tourner les lourdes meules ! Une farine pure pour chaque foyer.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    iconName: 'Wind',
    activeOccupantsCount: 6,
    sampleMessages: [
      { id: 'm1', sender: 'Maître Charles', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', time: '11:00', text: 'Le courant est parfait aujourd’hui. Je mouds 50 sacs de farine blanche.', role: 'Meunier' },
      { id: 'm2', sender: 'Boulanger', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80', time: '11:05', text: 'J’envoie mon apprenti chercher dix sacs immédiatement !' }
    ]
  },
  {
    id: 'blacksmith',
    name: 'Forgeron',
    frenchTitle: 'Le Forgeron',
    characterName: 'Maître forgeron Vulcain',
    structureName: 'Grande forge et enclume du village',
    category: 'Artisanat et construction',
    x: 48,
    y: 54,
    description: 'Façonne le fer incandescent sur les braises et fabrique des outils, des lames, des cerclages et des charnières.',
    defaultQuote: 'Il faut battre le fer tant qu’il est rouge ! La force naît dans la flamme.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    iconName: 'Flame',
    activeOccupantsCount: 8,
    sampleMessages: [
      { id: 'm1', sender: 'Maître forgeron Vulcain', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', time: '10:45', text: 'De nouveaux socs et des haches sortent de l’enclume ! Qui a commandé des clous ?', role: 'Forgeron' },
      { id: 'm2', sender: 'Marc le Maçon', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80', time: '10:50', text: 'J’ai besoin de vingt lourds ciseaux à pierre reforgés aujourd’hui.' }
    ]
  },
  {
    id: 'farrier',
    name: 'Maréchal-ferrant',
    frenchTitle: 'Le Maréchal-ferrant',
    characterName: 'Thibault',
    structureName: 'Écuries et atelier de ferrage',
    category: 'Métiers et artisanat',
    x: 61,
    y: 50,
    description: 'Ajuste les fers métalliques et soigne les sabots des chevaux de trait et des montures.',
    defaultQuote: 'Un bon fer garantit un voyage solide à travers le royaume.',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    iconName: 'Hammer',
    activeOccupantsCount: 4,
    sampleMessages: [
      { id: 'm1', sender: 'Thibault', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80', time: '09:15', text: 'Je ferre l’étalon du seigneur Villon. Les chevaux de la charrette ensuite !', role: 'Maréchal-ferrant' }
    ]
  },
  {
    id: 'baker',
    name: 'Boulanger',
    frenchTitle: 'Le Boulanger',
    characterName: 'Jean-Luc Boulanger',
    structureName: 'Boulangerie en pierre et fours à bois',
    category: 'Alimentation et agriculture',
    x: 43,
    y: 45,
    description: 'Allume les fours à bois avant l’aube pour cuire des pains au levain, des brioches et des baguettes rustiques.',
    defaultQuote: 'Suivez le doux parfum du levain chaud sorti du four en pierre !',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    iconName: 'Cake',
    activeOccupantsCount: 9,
    sampleMessages: [
      { id: 'm1', sender: 'Jean-Luc', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80', time: '07:00', text: 'La première fournée de pains rustiques au levain est chaude et prête !', role: 'Boulanger' },
      { id: 'm2', sender: 'Marie', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', time: '07:05', text: 'Gardez trois pains pour l’aubergiste, s’il vous plaît !' }
    ]
  },
  {
    id: 'cheesemaker',
    name: 'Fromager',
    frenchTitle: 'Le Fromager',
    characterName: 'Madame Simone',
    structureName: 'Cave à fromages et fromagerie artisanale',
    category: 'Alimentation et agriculture',
    x: 25,
    y: 61,
    description: 'Fabrique du comté affiné, du brie doux et des fromages de chèvre dans des caves souterraines fraîches.',
    defaultQuote: 'Un bon fromage demande de la patience, des herbes de printemps et des siècles de tradition.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    iconName: 'Disc',
    activeOccupantsCount: 5,
    sampleMessages: [
      { id: 'm1', sender: 'Madame Simone', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', time: '08:50', text: 'Les meules de comté affinées douze mois sont découpées ! Dégustation disponible.', role: 'Fromager' }
    ]
  },
  {
    id: 'brewer',
    name: 'Brasseur',
    frenchTitle: 'Le Brasseur',
    characterName: 'Gaston',
    structureName: 'Brasserie aux chaudrons de cuivre',
    category: 'Alimentation et agriculture',
    x: 62,
    y: 35,
    description: 'Brasse des bières blondes riches et des hydromels aux herbes avec l’eau de la rivière, de l’orge maltée et du houblon frais.',
    defaultQuote: 'À la santé, aux amis sincères et aux chopes de bière bien fraîches !',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    iconName: 'Beer',
    activeOccupantsCount: 7,
    sampleMessages: [
      { id: 'm1', sender: 'Gaston', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', time: '11:30', text: 'Un fût de bière d’automne épicée vient d’être ouvert dans la cour !', role: 'Brasseur' }
    ]
  },
  {
    id: 'weaver',
    name: 'Tisserande',
    frenchTitle: 'La Tisserande',
    characterName: 'Colette',
    structureName: 'Maison des métiers à tisser et teinturerie',
    category: 'Métiers et artisanat',
    x: 82,
    y: 52,
    description: 'Transforme la laine en fil et tisse des tapisseries colorées, des draps de lin et des couvertures chaudes.',
    defaultQuote: 'Chaque fil tissé raconte une histoire de VillonWood.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    iconName: 'Scissors',
    activeOccupantsCount: 4,
    sampleMessages: [
      { id: 'm1', sender: 'Colette', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', time: '10:00', text: 'La teinture de laine bleu indigo est terminée ! Je tisse des châles chauds pour l’hiver.', role: 'Tisserande' }
    ]
  },
  {
    id: 'tailor',
    name: 'Tailleur',
    frenchTitle: 'Le Tailleur',
    characterName: 'Monsieur Armand',
    structureName: 'Boutique et atelier du tailleur',
    category: 'Métiers et artisanat',
    x: 55,
    y: 65,
    description: 'Prend les mesures et coud des vêtements nobles, des capes à capuche, des pantalons solides et des tuniques brodées.',
    defaultQuote: 'L’habit fait le villageois : une coupe précise et des coutures durables.',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    iconName: 'Scissors',
    activeOccupantsCount: 3,
    sampleMessages: [
      { id: 'm1', sender: 'Monsieur Armand', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80', time: '11:15', text: 'Les tuniques de velours et les capes de laine sont prêtes pour les essayages.', role: 'Tailleur' }
    ]
  },
  {
    id: 'shoemaker',
    name: 'Cordonnier',
    frenchTitle: 'Le Cordonnier',
    characterName: 'Remi',
    structureName: 'Boutique du cordonnier en cuir',
    category: 'Métiers et artisanat',
    x: 38,
    y: 67,
    description: 'Fabrique des bottes en cuir, des sabots en bois et répare les semelles usées des voyageurs du village.',
    defaultQuote: 'Marchez confortablement sur toutes les routes grâce à un cuir robuste.',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    iconName: 'Footprints',
    activeOccupantsCount: 3,
    sampleMessages: [
      { id: 'm1', sender: 'Rémi', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80', time: '09:20', text: 'Des bottes de voyage solides réparées avec une double couture !', role: 'Cordonnier' }
    ]
  },
  {
    id: 'carpenter',
    name: 'Charpentier',
    frenchTitle: 'Le Charpentier',
    characterName: 'Laurent',
    structureName: 'Parc à bois et atelier de menuiserie',
    category: 'Artisanat et construction',
    x: 30,
    y: 48,
    description: 'Abat les chênes, façonne les poutres de toit, construit des meubles et bâtit des maisons en bois.',
    defaultQuote: 'Le chêne massif soutient le toit de chaque maison de Villon.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    iconName: 'Wrench',
    activeOccupantsCount: 5,
    sampleMessages: [
      { id: 'm1', sender: 'Laurent', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', time: '10:30', text: 'Je taille les poutres pour l’agrandissement du nouveau moulin.', role: 'Charpentier' }
    ]
  },
  {
    id: 'mason',
    name: 'Maçon',
    frenchTitle: 'Le Maçon',
    characterName: 'Marc le Batisseur',
    structureName: 'Carrière et chantier des tailleurs de pierre',
    category: 'Artisanat et construction',
    x: 58,
    y: 20,
    description: 'Taille le granit et le calcaire pour bâtir les murs du village, les cheminées et les arches de l’église.',
    defaultQuote: 'Une pierre bien posée restera solide pendant cinq cents ans.',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    iconName: 'Box',
    activeOccupantsCount: 4,
    sampleMessages: [
      { id: 'm1', sender: 'Marc le Bâtisseur', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80', time: '08:40', text: 'Le mortier est prêt ! Je répare le mur de la tour de garde est.', role: 'Maçon' }
    ]
  },
  {
    id: 'wheelwright',
    name: 'Charron',
    frenchTitle: 'Le Charron',
    characterName: 'Mathieu',
    structureName: 'Atelier des charrettes et des roues',
    category: 'Artisanat et construction',
    x: 73,
    y: 43,
    description: 'Fabrique des roues de charrette équilibrées et pose des bandages de fer pour un transport régulier.',
    defaultQuote: 'Sans roues solides, aucune récolte n’atteint le marché.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    iconName: 'Circle',
    activeOccupantsCount: 3,
    sampleMessages: [
      { id: 'm1', sender: 'Mathieu', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', time: '09:50', text: 'Les lourdes roues de chêne renforcées sont prêtes pour la charrette à grains du meunier.', role: 'Charron' }
    ]
  },
  {
    id: 'cooper',
    name: 'Tonnelier',
    frenchTitle: 'Le Tonnelier',
    characterName: 'Bernard',
    structureName: 'Tonnellerie et atelier des barriques',
    category: 'Métiers et artisanat',
    x: 76,
    y: 42,
    description: 'Assemble des barriques étanches en chêne cerclées de fer pour le vin, la bière et le poisson salé.',
    defaultQuote: 'Pas une goutte ne se renverse ! Des barriques de chêne étanches faites à la main.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    iconName: 'Archive',
    activeOccupantsCount: 4,
    sampleMessages: [
      { id: 'm1', sender: 'Bernard', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80', time: '10:05', text: 'J’ai livré douze nouvelles barriques de vin à la cave du vignoble aujourd’hui.', role: 'Tonnelier' }
    ]
  },
  {
    id: 'fisherman',
    name: 'Pêcheur (bateau et quais)',
    frenchTitle: 'Le Pêcheur sur le Bateau',
    characterName: 'Capitaine Jean et équipage',
    structureName: 'Quai de la rivière et bateau de pêche',
    category: 'Accueil et nature',
    x: 32,
    y: 29,
    description: 'Navigue sur la rivière sinueuse à bord du bateau du village et jette ses filets pour pêcher truites, saumons et anguilles.',
    defaultQuote: 'Bienvenue à bord du bateau de la rivière Villon ! Larguons les amarres pour une belle pêche sur les eaux calmes.',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    iconName: 'Anchor',
    activeOccupantsCount: 11,
    sampleMessages: [
      { id: 'm1', sender: 'Capitaine Jean', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80', time: '11:40', text: 'À bord ! Nous venons de remonter un filet plein de truites fraîches de la rivière !', role: 'Capitaine pêcheur' },
      { id: 'm2', sender: 'Visiteur Antoine', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', time: '11:42', text: 'La brise de la rivière est magnifique à la proue du bateau !' },
      { id: 'm3', sender: 'Pêcheur Luc', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80', time: '11:45', text: 'Jetez l’ancre près des roseaux, les brochets mordent !' }
    ]
  },
  {
    id: 'basket_weaver',
    name: 'Vannier',
    frenchTitle: 'Le Vannier',
    characterName: 'Aveline',
    structureName: 'Atelier de vannerie et d’osier',
    category: 'Métiers et artisanat',
    x: 22,
    y: 37,
    description: 'Tresse les brins de saule et les roseaux de la rivière en paniers légers, nasses et corbeilles de rangement.',
    defaultQuote: 'Tressées ensemble, les branches souples de saule deviennent des contenants incassables.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    iconName: 'Feather',
    activeOccupantsCount: 2,
    sampleMessages: [
      { id: 'm1', sender: 'Aveline', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', time: '09:10', text: 'Les paniers à baies et les nasses sortent de l’étuve à saule.', role: 'Vannière' }
    ]
  },
  {
    id: 'innkeeper',
    name: 'Aubergiste',
    frenchTitle: 'L’Aubergiste',
    characterName: 'Maître Pierre de Villon',
    structureName: 'Auberge et taverne du Sanglier d’or',
    category: 'Accueil et nature',
    x: 46,
    y: 37,
    description: 'Accueille les voyageurs autour d’un feu chaleureux, d’un ragoût fumant, de chopes fraîches et de chambres douillettes.',
    defaultQuote: 'Entrez, il fait froid dehors ! Remplissez votre verre, réchauffez vos pieds et racontez vos histoires.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    iconName: 'Utensils',
    activeOccupantsCount: 14,
    sampleMessages: [
      { id: 'm1', sender: 'Maître Pierre', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', time: '12:00', text: 'Le ragoût de sanglier mijote sur le grand foyer ! Venez prendre une assiette.', role: 'Aubergiste' },
      { id: 'm2', sender: 'Ménestrel Claude', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80', time: '12:05', text: 'J’accorde mon luth pour les chansons de la taverne ce soir !' }
    ]
  }
];
