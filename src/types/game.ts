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
  difficulty?: 'Story' | 'Easy' | 'Normal' | 'Hard' | 'Nightmare';
}

export type SettingsCategory = 
  | 'DISPLAY' 
  | 'GRAPHICS' 
  | 'AUDIO' 
  | 'GAMEPLAY' 
  | 'CONTROLS' 
  | 'ACCESSIBILITY';

export interface KeyBindings {
  moveForward: string;
  moveBackward: string;
  moveLeft: string;
  moveRight: string;
  jump: string;
  interact: string;
  attack: string;
  heavyAttack: string;
  dodge: string;
  block: string;
  echoRelease: string;
  inventory: string;
  pause: string;
}

export interface GameSettings {
  display: {
    displayMode: 'Fullscreen' | 'Borderless Window' | 'Windowed';
    resolution: string;
    refreshRate: '60 Hz' | '120 Hz' | '144 Hz' | '240 Hz';
    vsync: boolean;
    frameRateLimit: '30 FPS' | '45 FPS' | '60 FPS' | '90 FPS' | '120 FPS' | 'Unlimited';
    brightness: number; // 0 to 100
    fov: number; // 75 to 110
    cameraParallax: 'Off' | 'Subtle' | 'Dynamic';
  };
  graphics: {
    preset: 'Very Low' | 'Low' | 'Medium' | 'High' | 'Ultra' | 'Custom';
    resolutionScale: number; // 50 to 100
    textureQuality: 'Low' | 'Medium' | 'High' | 'Ultra';
    shadowQuality: 'Low' | 'Medium' | 'High' | 'Ultra';
    effectsQuality: 'Low' | 'Medium' | 'High' | 'Ultra';
    postProcessing: 'Low' | 'Medium' | 'High' | 'Ultra';
    antiAliasing: 'Off' | 'FXAA' | 'TAA';
    ambientOcclusion: 'Off' | 'SSAO' | 'HBAO+';
    anisotropicFiltering: 'Off' | '2x' | '4x' | '8x' | '16x';
    motionBlur: 'Off' | 'Low' | 'High';
    depthOfField: boolean;
    vegetationDensity: 'Low' | 'Medium' | 'High';
    environmentDetail: 'Low' | 'Medium' | 'High';
    volumetricFog: 'Off' | 'Low' | 'High';
  };
  audio: {
    masterVolume: number; // 0 to 100
    musicVolume: number;
    sfxVolume: number;
    ambientVolume: number;
    voiceVolume: number;
    isMuted: boolean;
    dynamicRange: 'Full Studio' | 'Midnight' | 'Headphones';
  };
  gameplay: {
    difficulty: 'Story' | 'Easy' | 'Normal' | 'Hard' | 'Nightmare';
    damageNumbers: boolean;
    subtitles: boolean;
    subtitleSize: 'Small' | 'Medium' | 'Large';
    cameraShake: 'Off' | 'Low' | 'Normal';
    cameraSensitivity: number; // 1 to 10
    combatPacing: 'Deliberate' | 'Dynamic';
    tutorialHints: boolean;
    interactionPrompts: boolean;
    autoCameraAdjustment: boolean;
  };
  controls: {
    bindings: KeyBindings;
    invertY: boolean;
    mouseSensitivity: number; // 1 to 10
    controllerLayout: 'Standard' | 'Alternative' | 'Tactical';
  };
  accessibility: {
    highContrastUI: boolean;
    reducedMotion: boolean;
    cameraShakeIntensity: 0 | 50 | 100;
    uiScale: '90% (Compact)' | '100% (Standard)' | '110% (Elevated)';
    subtitleBackground: 'None' | 'Translucent' | 'Solid Black';
    colorIndependentIndicators: boolean;
    sprintBehavior: 'Hold' | 'Toggle';
    blockBehavior: 'Hold' | 'Toggle';
  };
}

export interface LoreEntry {
  id: string;
  category: 'World' | 'Divine' | 'Echoes' | 'Factions';
  title: string;
  subtitle: string;
  content: string[];
}
