export type ScreenState = 
  | 'TITLE'
  | 'CHARACTER_SELECT'
  | 'PROLOGUE'
  | 'LOAD_GAME'
  | 'SETTINGS'
  | 'EXTRAS'
  | 'EXIT_CONFIRM';

export type CharacterId = 'kiyoji' | 'hanetsu';

export interface CharacterInfo {
  id: CharacterId;
  name: string;
  kanji: string;
  title: string;
  gender: string;
  role: string;
  weapon: string;
  weaponType: string;
  specialty: string;
  ability: string;
  description: string;
  personality: string;
  quote: string;
  stats: {
    resonance: number;
    bladeProficiency: number;
    spectralAffinity: number;
    resilience: number;
  };
  startingEcho: {
    title: string;
    origin: string;
    abilityName: string;
    description: string;
  };
  imagePath: string;
}

export interface SaveSlot {
  id: number;
  isEmpty: boolean;
  character?: CharacterId;
  characterName?: string;
  chapter?: string;
  location?: string;
  playtimeMinutes?: number;
  echoesCount?: number;
  lastPlayed?: string;
  difficulty?: 'Normal' | 'Hard' | 'Ethereal';
}

export interface GameSettings {
  display: {
    resolution: string;
    fullscreen: boolean;
    graphicsQuality: 'Low' | 'Medium' | 'High' | 'Cinematic';
    vsync: boolean;
    cameraParallax: boolean;
    ambientFog: boolean;
  };
  audio: {
    masterVolume: number; // 0 to 100
    musicVolume: number;
    sfxVolume: number;
    ambientVolume: number;
    isMuted: boolean;
  };
  interface: {
    uiScale: 'Small' | 'Normal' | 'Large';
    subtitles: boolean;
    textSize: 'Compact' | 'Standard' | 'Elevated';
  };
  game: {
    language: 'English' | 'Japanese' | 'French' | 'German';
    combatPacing: 'Deliberate' | 'Dynamic';
    echoTutorials: boolean;
  };
}

export interface LoreEntry {
  id: string;
  category: 'World' | 'Divine' | 'Echoes' | 'Factions';
  title: string;
  subtitle: string;
  content: string[];
}
