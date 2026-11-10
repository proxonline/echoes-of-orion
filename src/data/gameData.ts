import { CharacterInfo, GameSettings, LoreEntry, SaveSlot } from '../types/game';

export const ASSET_PATHS = {
  titleEnvironment: '/src/assets/images/title_screen_environment_1794334662644.jpg',
  settingsChamber: '/src/assets/images/settings_chamber_environment_1794335773864.jpg',
  characterSelectEnvironment: '/src/assets/images/character_select_environment_1794335774503.jpg',
  kiyojiCharacter: '/src/assets/images/kiyoji_character_art_1794334665628.jpg',
  hanetsuCharacter: '/src/assets/images/hanetsu_character_art_1794334666473.jpg',
  orionSigil: '/src/assets/images/orion_celestial_sigil_1794334665859.jpg',
};

export const CHARACTERS: Record<'kiyoji' | 'hanetsu', CharacterInfo> = {
  kiyoji: {
    id: 'kiyoji',
    name: 'KIYOJI',
    kanji: '清司',
    title: 'The Silent Wanderer',
    gender: 'Male',
    role: 'Protagonist',
    weapon: 'Weathered Katana of the Sinking Sun',
    weaponType: 'Ancient Forged Steel Katana',
    specialty: 'Precision Blade Arts & Counter-Severing',
    ability: 'Echo Inheritance',
    description:
      'A survivor of the divine destruction. His past is buried beneath the ashes, but the echoes of the fallen answer his call.',
    personality: 'Reserved, observant, and bound by unspoken vows of remembrance.',
    quote: 'The ashes remember every life extinguished here. I will carry their silence until the heavens answer.',
    stats: {
      resonance: 88,
      bladeProficiency: 92,
      spectralAffinity: 84,
      resilience: 80,
    },
    startingEcho: {
      title: 'Echo of the Village Swordsmith',
      origin: 'Fallen artisan discovered in the burned courtyard',
      abilityName: 'Folded Steel Parry',
      description: 'Absorbs ancestral muscle memory, granting flawless deflections against celestial strikes.',
    },
    imagePath: ASSET_PATHS.kiyojiCharacter,
  },
  hanetsu: {
    id: 'hanetsu',
    name: 'HANETSU',
    kanji: '羽津',
    title: 'The Crescent Sentinel',
    gender: 'Female',
    role: 'Protagonist',
    weapon: 'Crescent Moon Glaive of the High Shrines',
    weaponType: 'Celestial Polearm & Crescent Edge',
    specialty: 'Sweeping Reach & Spectral Arc Weaving',
    ability: 'Echo Inheritance',
    description:
      'Born into the silence of a fallen village. Her path through the world will be written by the voices of the dead.',
    personality: 'Intense, resolute, and unwavering in the face of impossible divine power.',
    quote: 'They did not die to become forgotten dust. Their spirits will carve our path through the dark.',
    stats: {
      resonance: 90,
      bladeProficiency: 85,
      spectralAffinity: 94,
      resilience: 78,
    },
    startingEcho: {
      title: 'Echo of the Shrine Oracle',
      origin: 'Fallen seer discovered at the broken pagoda steps',
      abilityName: 'Veil of the Crescent Rift',
      description: 'Channels spiritual wisps into sweeping arc strikes that expose dimensional weak points.',
    },
    imagePath: ASSET_PATHS.hanetsuCharacter,
  },
};

export const DEFAULT_SETTINGS: GameSettings = {
  display: {
    displayMode: 'Borderless Window',
    resolution: '1920x1080 (16:9)',
    refreshRate: '60 Hz',
    vsync: true,
    frameRateLimit: '60 FPS',
    brightness: 50,
    fov: 90,
    cameraParallax: 'Dynamic',
  },
  graphics: {
    preset: 'High',
    resolutionScale: 100,
    textureQuality: 'High',
    shadowQuality: 'High',
    effectsQuality: 'High',
    postProcessing: 'High',
    antiAliasing: 'TAA',
    ambientOcclusion: 'SSAO',
    anisotropicFiltering: '8x',
    motionBlur: 'Low',
    depthOfField: true,
    vegetationDensity: 'High',
    environmentDetail: 'High',
    volumetricFog: 'High',
  },
  audio: {
    masterVolume: 80,
    musicVolume: 75,
    sfxVolume: 85,
    ambientVolume: 70,
    voiceVolume: 90,
    isMuted: false,
    dynamicRange: 'Full Studio',
  },
  gameplay: {
    difficulty: 'Normal',
    damageNumbers: true,
    subtitles: true,
    subtitleSize: 'Medium',
    cameraShake: 'Normal',
    cameraSensitivity: 5,
    combatPacing: 'Deliberate',
    tutorialHints: true,
    interactionPrompts: true,
    autoCameraAdjustment: true,
  },
  controls: {
    bindings: {
      moveForward: 'W',
      moveBackward: 'S',
      moveLeft: 'A',
      moveRight: 'D',
      jump: 'Space',
      interact: 'E',
      attack: 'Left Mouse',
      heavyAttack: 'Right Mouse',
      dodge: 'Shift',
      block: 'Q',
      echoRelease: 'R',
      inventory: 'I',
      pause: 'Escape',
    },
    invertY: false,
    mouseSensitivity: 5,
    controllerLayout: 'Standard',
  },
  accessibility: {
    highContrastUI: false,
    reducedMotion: false,
    cameraShakeIntensity: 100,
    uiScale: '100% (Standard)',
    subtitleBackground: 'Translucent',
    colorIndependentIndicators: true,
    sprintBehavior: 'Hold',
    blockBehavior: 'Hold',
  },
};

// Initial clean save slots — all empty on fresh install (no fake progress)
export const INITIAL_SAVE_SLOTS: SaveSlot[] = [
  {
    id: 1,
    isEmpty: true,
  },
  {
    id: 2,
    isEmpty: true,
  },
  {
    id: 3,
    isEmpty: true,
  },
];

export const LORE_ENTRIES: LoreEntry[] = [
  {
    id: 'world_minakami',
    category: 'World',
    title: 'The Fallen Village of Minakami',
    subtitle: 'Where the silent catastrophe began',
    content: [
      'Minakami was once a tranquil mountain sanctuary perched along the mist-draped terraced valleys beneath Mount Oritake. Revered for its thousand-year timber pagodas, master swordsmiths, and stone shrines, it stood as a testament to an ancient civilization deeply attuned to spiritual harmony.',
      'Without warning, the heavens ruptured. In a single night of violent celestial descent, an unfathomable divine presence tore the sky asunder. Stone pathways shattered, ancestral homes burned to charcoal, and the entire populace fell in an instant of unnatural stillness.',
      'Now, only the wind stirs the drifting ash, and the spirits of those who perished remain trapped between this world and the rupture above.',
    ],
  },
  {
    id: 'echo_system',
    category: 'Echoes',
    title: 'The Echo Inheritance',
    subtitle: 'Memory, martial talent, and ancestral power',
    content: [
      'When living beings are extinguished by divine forces, their spiritual essence does not merely disperse. Instead, their deepest mortal memories, battle instincts, and unfulfilled resolves coalesce into luminous spectral wisps known as Echoes.',
      'Only those who have awakened beneath the rupture possess the vessel to commune with these fragments. By approaching the fallen and accepting their Echoes, the protagonist permanently weaves the deceased’s martial proficiency and supernatural arts into their own spirit.',
      'Every absorbed Echo whispers a fragment of truth: the nature of the catastrophe, the identity of the cosmic entity above, and the secret technique needed to pierce celestial armor.',
    ],
  },
  {
    id: 'celestial_rupture',
    category: 'Divine',
    title: 'The Heavenly Rift & The Colossus',
    subtitle: 'The cosmic phenomenon dominating the heavens',
    content: [
      'Looking upward from the devastation, one does not see stars. A titanic circular vortex pulses across the night firmament, rimmed in pale moonlight and spiraling storm clouds.',
      'Through this tear in reality looms the silhouette of a multi-armed divine entity of terrifying scale. Neither demon nor mortal, it gazes down upon the ruined realm with indifferent cosmic serenity.',
      'Ancient texts preserved in the high pagoda refer to the rupture as the Orion Conjunction—an era when the boundary between mortal kingdoms and cosmic judges is shattered.',
    ],
  },
  {
    id: 'protagonists_archive',
    category: 'Factions',
    title: 'The Unbroken Survivors',
    subtitle: 'Kiyoji and Hanetsu',
    content: [
      'Kiyoji and Hanetsu were both discovered alive in the aftermath, each carrying the mark of the Echo Inheritance on their skin—a faint, pulsing pale-blue fracture that mirrors the rift in the sky.',
      'Though their martial temperaments differ—Kiyoji wielding the focused precision of the katana and Hanetsu commanding the wide, rhythmic arcs of the crescent glaive—both are bound by the same destiny: to bear the burden of every fallen soul in Minakami and ascend toward the temple summit.',
    ],
  },
];

export const CREDITS_DATA = [
  { role: 'Creative & Art Direction', name: 'Original Production Studio' },
  { role: 'World Building & Narrative Lore', name: 'Echoes of Orion Narrative Council' },
  { role: 'Lead Character & Concept Design', name: 'Visual Development Atelier' },
  { role: 'Atmospheric & Soundscape Engineering', name: 'Procedural Audio Architecture' },
  { role: 'UI/UX Game Direction', name: 'AAA Title Frontend Division' },
  { role: 'Engine & Runtime Environment', name: 'Web Game Shell Framework' },
  { role: 'Special Thanks', name: 'To all who seek the memories of the fallen.' },
];
