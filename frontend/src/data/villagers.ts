import type { VillagerProfession } from '../types/village';

export const VILLAGERS_DATA: VillagerProfession[] = [
  {
    id: 'farmer',
    name: 'Ferme & Champs',
    frenchTitle: 'La Ferme & Les Champs',
    characterName: 'Maître Bertrand',
    structureName: 'Grange à blé et fermes de Villon',
    category: 'Alimentation et agriculture',
    x: 18,
    y: 76,
    bgImage: '/pictures/farmer.png',
    description: 'Cultive les terres fertiles autour du village et récolte le blé, le seigle et l’orge pour la boulangerie.',
    defaultQuote: 'La brume matinale annonce la pluie pour la récolte du blé. Bienvenue dans nos champs !',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Bertrand',
    iconName: 'Wheat',
    activeOccupantsCount: 5,
    sampleMessages: [
      { id: 'm1', sender: 'Maître Bertrand', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Bertrand', time: '10:12', text: 'Bonjour à tous ! La récolte de seigle donne 30 sacs aujourd’hui.', role: 'Fermier' },
      { id: 'm2', sender: 'Lucie', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Lucie', time: '10:14', text: 'Avez-vous besoin d’aide pour botteler la paille vers midi ?' },
      { id: 'm3', sender: 'Pierre', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Pierre', time: '10:15', text: 'J’arrive avec deux chevaux pour charger la charrette à grains !' }
    ]
  },
  {
    id: 'vigneron',
    name: 'Vignoble',
    frenchTitle: 'Le Vignoble',
    characterName: 'Jacques du Clos',
    structureName: 'Vignoble ensoleillé et caves des coteaux',
    category: 'Alimentation et agriculture',
    x: 74,
    y: 27,
    bgImage: '/pictures/winery.png',
    description: 'Entretient les vignes anciennes des coteaux, presse les grands crus à la main et élève le vin en fûts de chêne.',
    defaultQuote: 'Le soleil et le calcaire créent le plus beau nectar rouge de VillonWood.',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Jacques',
    iconName: 'Wine',
    activeOccupantsCount: 4,
    sampleMessages: [
      { id: 'm1', sender: 'Jacques du Clos', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Jacques', time: '09:40', text: 'Les raisins de pinot sont mûrs ! La dégustation commence au coucher du soleil dans la cave.', role: 'Vigneron' },
      { id: 'm2', sender: 'Gaspard', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Gaspard', time: '09:45', text: 'Gardez deux carafes pour l’aubergiste ce soir !' }
    ]
  },
  {
    id: 'shepherd',
    name: 'Bergerie',
    frenchTitle: 'La Bergerie',
    characterName: 'Guillaume',
    structureName: 'Bergerie des hauts pâturages',
    category: 'Alimentation et agriculture',
    x: 82,
    y: 72,
    bgImage: '/pictures/sheepFarm.png',
    description: 'Guide le troupeau sur les collines, récolte la laine brute et le protège des loups de la forêt.',
    defaultQuote: 'Mon fidèle chien et moi veillons pendant que le village dort sous les étoiles.',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Guillaume',
    iconName: 'Cloud',
    activeOccupantsCount: 3,
    sampleMessages: [
      { id: 'm1', sender: 'Guillaume', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Guillaume', time: '08:15', text: 'Le troupeau broute paisiblement près de la crête. La laine tondue est prête pour la tisserande.', role: 'Berger' },
      { id: 'm2', sender: 'Colette', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Colette', time: '08:30', text: 'Parfait, je viens chercher cinq toisons !' }
    ]
  },
  {
    id: 'cattle_herder',
    name: 'Ferme Bovine',
    frenchTitle: 'La Ferme Bovine',
    characterName: 'Étienne',
    structureName: 'Pâturages et enclos du bétail',
    category: 'Alimentation et agriculture',
    x: 12,
    y: 46,
    bgImage: '/pictures/cattleFarm.png',
    description: 'S’occupe des bœufs de trait et des troupeaux laitiers essentiels aux labours et à la livraison du lait frais.',
    defaultQuote: 'Des bœufs robustes facilitent le travail de tout le village.',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Etienne',
    iconName: 'Shield',
    activeOccupantsCount: 2,
    sampleMessages: [
      { id: 'm1', sender: 'Étienne', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Etienne', time: '07:30', text: 'Les seaux de lait frais du matin sont prêts pour le fromager !', role: 'Bouvier' }
    ]
  },
  {
    id: 'miller',
    name: 'Moulin à Vent',
    frenchTitle: 'Le Moulin à Vent',
    characterName: 'Maître Charles',
    structureName: 'Moulin à vent et à grains de la rivière',
    category: 'Alimentation et agriculture',
    x: 32,
    y: 34,
    bgImage: '/pictures/windmill.png',
    description: 'Utilise les roues du vent et de l’eau pour moudre le seigle, l’orge et le blé en sacs de farine dorée.',
    defaultQuote: 'Écoutez tourner les lourdes meules ! Une farine pure pour chaque foyer.',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Charles',
    iconName: 'Wind',
    activeOccupantsCount: 6,
    sampleMessages: [
      { id: 'm1', sender: 'Maître Charles', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Charles', time: '11:00', text: 'Le courant est parfait aujourd’hui. Je mouds 50 sacs de farine blanche.', role: 'Meunier' },
      { id: 'm2', sender: 'Boulanger', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=JeanBoulanger', time: '11:05', text: 'J’envoie mon apprenti chercher dix sacs immédiatement !' }
    ]
  },
  {
    id: 'blacksmith',
    name: 'Forge',
    frenchTitle: 'La Forge',
    characterName: 'Maître forgeron Vulcain',
    structureName: 'Grande forge et enclume du village',
    category: 'Artisanat et construction',
    x: 48,
    y: 54,
    bgImage: '/pictures/forge.png',
    description: 'Façonne le fer incandescent sur les braises et fabrique des outils, des lames, des cerclages et des charnières.',
    defaultQuote: 'Il faut battre le fer tant qu’il est rouge ! La force naît dans la flamme.',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Vulcan',
    iconName: 'Flame',
    activeOccupantsCount: 8,
    sampleMessages: [
      { id: 'm1', sender: 'Maître forgeron Vulcain', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Vulcan', time: '10:45', text: 'De nouveaux socs et des haches sortent de l’enclume ! Qui a commandé des clous ?', role: 'Forgeron' },
      { id: 'm2', sender: 'Marc le Maçon', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Marc', time: '10:50', text: 'J’ai besoin de vingt lourds ciseaux à pierre reforgés aujourd’hui.' }
    ]
  },
  {
    id: 'barber',
    name: 'Salon du Barbier',
    frenchTitle: 'Le Barbier',
    characterName: 'Maître Antoine',
    structureName: 'Échoppe et salon du barbier',
    category: 'Métiers et artisanat',
    x: 61,
    y: 50,
    bgImage: '/pictures/barrerShop.png',
    description: 'Offre des soins de barbe raffinés, des coupes de cheveux et des baumes artisanaux préparés à partir d’herbes locales.',
    defaultQuote: 'Une barbe bien taillée et une coiffure élégante redonnent de l’assurance à chaque voyageur.',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=AntoineBarber',
    iconName: 'Scissors',
    activeOccupantsCount: 4,
    sampleMessages: [
      { id: 'm1', sender: 'Maître Antoine', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=AntoineBarber', time: '09:15', text: 'Les serviettes chaudes et les baumes au romarin sont prêts pour les clients du matin !', role: 'Barbier' }
    ]
  },
  {
    id: 'baker',
    name: 'Boulangerie',
    frenchTitle: 'La Boulangerie',
    characterName: 'Jean-Luc Boulanger',
    structureName: 'Boulangerie en pierre et fours à bois',
    category: 'Alimentation et agriculture',
    x: 43,
    y: 45,
    bgImage: '/pictures/bakery.png',
    description: 'Allume les fours à bois avant l’aube pour cuire des pains au levain, des brioches et des baguettes rustiques.',
    defaultQuote: 'Suivez le doux parfum du levain chaud sorti du four en pierre !',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=JeanBoulanger',
    iconName: 'Cake',
    activeOccupantsCount: 9,
    sampleMessages: [
      { id: 'm1', sender: 'Jean-Luc', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=JeanBoulanger', time: '07:00', text: 'La première fournée de pains rustiques au levain est chaude et prête !', role: 'Boulanger' },
      { id: 'm2', sender: 'Marie', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Marie', time: '07:05', text: 'Gardez trois pains pour l’aubergiste, s’il vous plaît !' }
    ]
  },
  {
    id: 'cheesemaker',
    name: 'Fromagerie',
    frenchTitle: 'La Fromagerie',
    characterName: 'Madame Simone',
    structureName: 'Cave à fromages et fromagerie artisanale',
    category: 'Alimentation et agriculture',
    x: 25,
    y: 61,
    bgImage: '/pictures/cheeseShop.png',
    description: 'Fabrique du comté affiné, du brie doux et des fromages de chèvre dans des caves souterraines fraîches.',
    defaultQuote: 'Un bon fromage demande de la patience, des herbes de printemps et des siècles de tradition.',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Simone',
    iconName: 'Disc',
    activeOccupantsCount: 5,
    sampleMessages: [
      { id: 'm1', sender: 'Madame Simone', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Simone', time: '08:50', text: 'Les meules de comté affinées douze mois sont découpées ! Dégustation disponible.', role: 'Fromager' }
    ]
  },
  {
    id: 'brewer',
    name: 'Brasserie',
    frenchTitle: 'La Brasserie',
    characterName: 'Gaston',
    structureName: 'Brasserie aux chaudrons de cuivre',
    category: 'Alimentation et agriculture',
    x: 62,
    y: 35,
    bgImage: '/pictures/brewery.png',
    description: 'Brasse des bières blondes riches et des hydromels aux herbes avec l’eau de la rivière, de l’orge maltée et du houblon frais.',
    defaultQuote: 'À la santé, aux amis sincères et aux chopes de bière bien fraîches !',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Gaston',
    iconName: 'Beer',
    activeOccupantsCount: 7,
    sampleMessages: [
      { id: 'm1', sender: 'Gaston', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Gaston', time: '11:30', text: 'Un fût de bière d’automne épicée vient d’être ouvert dans la cour !', role: 'Brasseur' }
    ]
  },
  {
    id: 'weaver',
    name: 'Atelier de Tissage',
    frenchTitle: 'L’Atelier de Tissage',
    characterName: 'Colette',
    structureName: 'Maison des métiers à tisser et teinturerie',
    category: 'Métiers et artisanat',
    x: 82,
    y: 52,
    bgImage: '/pictures/weaverShop.png',
    description: 'Transforme la laine en fil et tisse des tapisseries colorées, des draps de lin et des couvertures chaudes.',
    defaultQuote: 'Chaque fil tissé raconte une histoire de VillonWood.',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Colette',
    iconName: 'Scissors',
    activeOccupantsCount: 4,
    sampleMessages: [
      { id: 'm1', sender: 'Colette', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Colette', time: '10:00', text: 'La teinture de laine bleu indigo est terminée ! Je tisse des châles chauds pour l’hiver.', role: 'Tisserande' }
    ]
  },
  {
    id: 'tailor',
    name: 'Atelier du Tailleur',
    frenchTitle: 'L’Atelier du Tailleur',
    characterName: 'Monsieur Armand',
    structureName: 'Boutique et atelier du tailleur',
    category: 'Métiers et artisanat',
    x: 55,
    y: 65,
    bgImage: '/pictures/tailorShop.png',
    description: 'Prend les mesures et coud des vêtements nobles, des capes à capuche, des pantalons solides et des tuniques brodées.',
    defaultQuote: 'L’habit fait le villageois : une coupe précise et des coutures durables.',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Armand',
    iconName: 'Scissors',
    activeOccupantsCount: 3,
    sampleMessages: [
      { id: 'm1', sender: 'Monsieur Armand', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Armand', time: '11:15', text: 'Les tuniques de velours et les capes de laine sont prêtes pour les essayages.', role: 'Tailleur' }
    ]
  },
  {
    id: 'shoemaker',
    name: 'Cordonnerie',
    frenchTitle: 'La Cordonnerie',
    characterName: 'Rémi',
    structureName: 'Boutique du cordonnier en cuir',
    category: 'Métiers et artisanat',
    x: 38,
    y: 67,
    bgImage: '/pictures/shoeShop.png',
    description: 'Fabrique des bottes en cuir, des sabots en bois et répare les semelles usées des voyageurs du village.',
    defaultQuote: 'Marchez confortablement sur toutes les routes grâce à un cuir robuste.',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Remi',
    iconName: 'Footprints',
    activeOccupantsCount: 3,
    sampleMessages: [
      { id: 'm1', sender: 'Rémi', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Remi', time: '09:20', text: 'Des bottes de voyage solides réparées avec une double couture !', role: 'Cordonnier' }
    ]
  },
  {
    id: 'carpenter',
    name: 'Charpenterie',
    frenchTitle: 'La Charpenterie',
    characterName: 'Laurent',
    structureName: 'Parc à bois et atelier de menuiserie',
    category: 'Artisanat et construction',
    x: 30,
    y: 48,
    bgImage: '/pictures/carpenterShop.png',
    description: 'Abat les chênes, façonne les poutres de toit, construit des meubles et bâtit des maisons en bois.',
    defaultQuote: 'Le chêne massif soutient le toit de chaque maison de Villon.',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Laurent',
    iconName: 'Wrench',
    activeOccupantsCount: 5,
    sampleMessages: [
      { id: 'm1', sender: 'Laurent', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Laurent', time: '10:30', text: 'Je taille les poutres pour l’agrandissement du nouveau moulin.', role: 'Charpentier' }
    ]
  },
  {
    id: 'mason',
    name: 'Maçonnerie',
    frenchTitle: 'La Maçonnerie',
    characterName: 'Marc le Bâtisseur',
    structureName: 'Carrière et chantier des tailleurs de pierre',
    category: 'Artisanat et construction',
    x: 58,
    y: 20,
    bgImage: '/pictures/masonShop.png',
    description: 'Taille le granit et le calcaire pour bâtir les murs du village, les cheminées et les arches de l’église.',
    defaultQuote: 'Une pierre bien posée restera solide pendant cinq cents ans.',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Marc',
    iconName: 'Box',
    activeOccupantsCount: 4,
    sampleMessages: [
      { id: 'm1', sender: 'Marc le Bâtisseur', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Marc', time: '08:40', text: 'Le mortier est prêt ! Je répare le mur de la tour de garde est.', role: 'Maçon' }
    ]
  },
  {
    id: 'wheelwright',
    name: 'Charronnerie',
    frenchTitle: 'La Charronnerie',
    characterName: 'Mathieu',
    structureName: 'Atelier des charrettes et des roues',
    category: 'Artisanat et construction',
    x: 73,
    y: 43,
    bgImage: '/pictures/wagonShop.png',
    description: 'Fabrique des roues de charrette équilibrées et pose des bandages de fer pour un transport régulier.',
    defaultQuote: 'Sans roues solides, aucune récolte n’atteint le marché.',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Mathieu',
    iconName: 'Circle',
    activeOccupantsCount: 3,
    sampleMessages: [
      { id: 'm1', sender: 'Mathieu', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Mathieu', time: '09:50', text: 'Les lourdes roues de chêne renforcées sont prêtes pour la charrette à grains du meunier.', role: 'Charron' }
    ]
  },
  {
    id: 'fisherman',
    name: 'Pêcherie & Port',
    frenchTitle: 'La Pêcherie',
    characterName: 'Capitaine Jean et équipage',
    structureName: 'Quai de la rivière et bateau de pêche',
    category: 'Accueil et nature',
    x: 32,
    y: 29,
    bgImage: '/pictures/fishery.png',
    description: 'Navigue sur la rivière sinueuse à bord du bateau du village et jette ses filets pour pêcher truites, saumons et anguilles.',
    defaultQuote: 'Bienvenue à bord du bateau de la rivière Villon ! Larguons les amarres pour une belle pêche sur les eaux calmes.',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=CaptainJean',
    iconName: 'Anchor',
    activeOccupantsCount: 11,
    sampleMessages: [
      { id: 'm1', sender: 'Capitaine Jean', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=CaptainJean', time: '11:40', text: 'À bord ! Nous venons de remonter un filet plein de truites fraîches de la rivière !', role: 'Capitaine pêcheur' },
      { id: 'm2', sender: 'Visiteur Antoine', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Antoine', time: '11:42', text: 'La brise de la rivière est magnifique à la proue du bateau !' },
      { id: 'm3', sender: 'Pêcheur Luc', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Luc', time: '11:45', text: 'Jetez l’ancre près des roseaux, les brochets mordent !' }
    ]
  },
  {
    id: 'innkeeper',
    name: 'Auberge',
    frenchTitle: 'L’Auberge',
    characterName: 'Maître Pierre de Villon',
    structureName: 'Auberge et taverne du Sanglier d’or',
    category: 'Accueil et nature',
    x: 46,
    y: 37,
    bgImage: '/pictures/inn.png',
    description: 'Accueille les voyageurs autour d’un feu chaleureux, d’un ragoût fumant, de chopes fraîches et de chambres douillettes.',
    defaultQuote: 'Entrez, il fait froid dehors ! Remplissez votre verre, réchauffez vos pieds et racontez vos histoires.',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=PierreInn',
    iconName: 'Utensils',
    activeOccupantsCount: 14,
    sampleMessages: [
      { id: 'm1', sender: 'Maître Pierre', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=PierreInn', time: '12:00', text: 'Le ragoût de sanglier mijote sur le grand foyer ! Venez prendre une assiette.', role: 'Aubergiste' },
      { id: 'm2', sender: 'Ménestrel Claude', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Claude', time: '12:05', text: 'J’accorde mon luth pour les chansons de la taverne ce soir !' }
    ]
  }
];
