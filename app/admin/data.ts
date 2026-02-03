import { AppData, CategoryInfo, Content, Profile } from './types';

export const profile: Profile = {
  id: '1',
  firstName: 'Alexandre',
  lastName: 'Dubois',
  title: 'Philosophe & Juriste',
  bio: "Passionné par les grandes questions qui façonnent notre humanité, je partage ici mes réflexions sur la philosophie, le droit, et la littérature. Mon objectif est de rendre accessible la pensée complexe et d'ouvrir des espaces de dialogue intellectuel.",
  formations: [
    'Doctorat en Philosophie - Sorbonne Paris',
    'Master en Droit Public - Sciences Po',
    'Agrégation de Philosophie',
  ],
  motivations: [
    'Vulgariser les concepts philosophiques complexes',
    'Créer des ponts entre disciplines intellectuelles',
    'Stimuler la réflexion critique',
    'Partager le plaisir de penser',
  ],
  imageUrl: '/profile.jpg',
  socialLinks: {
    twitter: 'https://twitter.com',
    linkedin: 'https://linkedin.com',
    email: 'contact@podcast.com',
  },
};

export const categories: CategoryInfo[] = [
  {
    id: 'philosophie',
    label: 'Philosophie',
    description: 'Explorations des grandes questions existentielles',
    icon: '🎭',
  },
  {
    id: 'droit',
    label: 'Droit',
    description: 'Analyses juridiques et enjeux de société',
    icon: '⚖️',
  },
  {
    id: 'litterature',
    label: 'Littérature',
    description: 'Lectures et critiques littéraires',
    icon: '📚',
  },
  {
    id: 'reflexions',
    label: 'Réflexions Personnelles',
    description: 'Pensées et méditations sur le quotidien',
    icon: '💭',
  },
  {
    id: 'autres',
    label: 'Autres',
    description: 'Sujets variés et découvertes',
    icon: '✨',
  },
];

export const contents: Content[] = [
  {
    id: '1',
    title: 'Nietzsche et la volonté de puissance',
    description: 'Une exploration approfondie du concept central de la philosophie nietzschéenne, souvent mal compris et détourné de son sens originel.',
    type: 'video',
    category: 'philosophie',
    mediaUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: '/placeholder.svg',
    transcription: "La volonté de puissance chez Nietzsche n'est pas une simple soif de domination. C'est un élan vital, une force créatrice qui pousse l'être humain à se dépasser, à créer de nouvelles valeurs. Nietzsche critique la morale traditionnelle qui, selon lui, étouffe cette force vitale. Le surhomme n'est pas un tyran, mais un créateur de valeurs nouvelles, quelqu'un qui dit 'oui' à la vie dans toute sa complexité.",
    duration: '45:30',
    publishedAt: '2024-01-15',
    tags: ['Nietzsche', 'Philosophie allemande', 'Morale'],
  },
  {
    id: '2',
    title: 'Les fondements du contrat social',
    description: 'Analyse comparative des théories de Hobbes, Locke et Rousseau sur le pacte social fondateur de nos sociétés modernes.',
    type: 'audio',
    category: 'droit',
    mediaUrl: '/audio-sample.mp3',
    thumbnailUrl: '/placeholder.svg',
    transcription: "Le contrat social est cette fiction juridique qui légitime le pouvoir politique. Pour Hobbes, c'est la peur qui nous pousse à abandonner notre liberté naturelle. Pour Locke, c'est la protection de notre propriété. Pour Rousseau, c'est la volonté générale qui doit primer. Ces trois visions continuent de façonner nos démocraties contemporaines.",
    duration: '32:15',
    publishedAt: '2024-01-10',
    tags: ['Contrat social', 'Rousseau', 'Hobbes'],
  },
  {
    id: '3',
    title: "L'absurde chez Camus",
    description: "Méditation sur le Mythe de Sisyphe et la réponse camusienne à l'absurdité de l'existence.",
    type: 'text',
    category: 'litterature',
    textContent: `# L'absurde chez Camus

"Il faut imaginer Sisyphe heureux." Cette phrase conclusive du Mythe de Sisyphe résume à elle seule la philosophie de l'absurde chez Camus.

## Le constat de l'absurde

L'absurde naît de la confrontation entre notre désir de sens et le silence du monde. Nous cherchons des réponses, mais l'univers reste muet. Cette disproportion entre notre attente et la réalité crée ce sentiment d'étrangeté fondamentale.

## La révolte comme réponse

Face à l'absurde, Camus refuse le suicide et la foi. Il propose une troisième voie : la révolte. Vivre l'absurde, c'est l'accepter sans s'y résigner. C'est créer du sens malgré le non-sens.

## Sisyphe comme héros

Sisyphe, condamné à rouler éternellement son rocher, devient le héros absurde par excellence. Dans son effort même, dans sa conscience de la futilité, il trouve sa grandeur.`,
    publishedAt: '2024-01-05',
    tags: ['Camus', 'Absurde', 'Existentialisme'],
  },
  {
    id: '4',
    title: 'Sur la lenteur',
    description: 'Réflexion personnelle sur notre rapport au temps dans une société de l\'accélération perpétuelle.',
    type: 'text',
    category: 'reflexions',
    textContent: `# Sur la lenteur

Dans notre monde hyperconnecté, prendre le temps de penser devient un acte de résistance.

## L'accélération sociale

Hartmut Rosa a brillamment analysé cette accélération qui caractérise notre modernité tardive. Nous courons après le temps, mais il nous échappe toujours. Plus nous gagnons du temps, moins nous en avons.

## Éloge de la contemplation

Il y a une sagesse dans la lenteur. Les Grecs distinguaient le chronos (temps quantitatif) du kairos (moment propice). Nous avons perdu le sens du kairos, absorbés que nous sommes par le chronos.

## Retrouver le temps

Méditer, lire lentement, écouter vraiment : autant de pratiques qui nous reconnectent à une temporalité plus humaine.`,
    publishedAt: '2024-01-01',
    tags: ['Temps', 'Méditation', 'Société'],
  },
  {
    id: '5',
    title: 'Introduction au stoïcisme',
    description: 'Les principes fondamentaux de la philosophie stoïcienne et leur pertinence pour notre époque.',
    type: 'video',
    category: 'philosophie',
    mediaUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: '/placeholder.svg',
    transcription: "Le stoïcisme nous enseigne une leçon fondamentale : distinguer ce qui dépend de nous de ce qui n'en dépend pas. Seuls nos jugements, nos désirs et nos actions sont véritablement en notre pouvoir. Le reste — la maladie, la mort, l'opinion des autres — échappe à notre contrôle. La sagesse consiste à concentrer notre énergie sur ce que nous pouvons changer.",
    duration: '38:45',
    publishedAt: '2023-12-28',
    tags: ['Stoïcisme', 'Épictète', 'Marc Aurèle'],
  },
  {
    id: '6',
    title: 'La justice selon Rawls',
    description: 'Présentation de la théorie de la justice de John Rawls et du voile d\'ignorance.',
    type: 'audio',
    category: 'droit',
    mediaUrl: '/audio-sample.mp3',
    thumbnailUrl: '/placeholder.svg',
    transcription: "Imaginez que vous devez concevoir les règles d'une société sans savoir quelle place vous y occuperez. C'est le voile d'ignorance de Rawls. Dans cette position originelle, nous choisirions des principes justes : la liberté pour tous et l'amélioration de la situation des plus défavorisés. Une théorie révolutionnaire de la justice.",
    duration: '28:00',
    publishedAt: '2023-12-20',
    tags: ['Rawls', 'Justice', 'Philosophie politique'],
  },
];

export const appData: AppData = {
  profile,
  categories,
  contents,
};
