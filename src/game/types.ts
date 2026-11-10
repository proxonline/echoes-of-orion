import { CharacterId } from '../types/game';

export interface PlayerState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  isGrounded: boolean;
  isJumping: boolean;
  isFalling: boolean;
  isLanding: boolean;
  landingTimer: number;
  isRunning: boolean;
  facing: 'left' | 'right';
  currentFrame: number;
  animTimer: number;
  characterId: CharacterId;
  health: number;
  maxHealth: number;
  coyoteTimer: number;
  jumpBufferTimer: number;
  footstepTimer: number;

  // Ability & Combat state
  hasEchoAbility: boolean;
  abilityCooldown: number; // in seconds (0 = ready)
  maxAbilityCooldown: number;
  isAttacking: boolean;
  attackTimer: number;
  resonanceEnergy: number; // 0 to 100
}

export interface Projectile {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  facing: 'left' | 'right';
  life: number;
  maxLife: number;
  isEmpowered: boolean;
}

export interface ImpactBurst {
  id: string;
  x: number;
  y: number;
  size: number;
  life: number;
  maxLife: number;
  rotation: number;
}

export interface DestructibleObject {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  hp: number;
  maxHp: number;
  isDestroyed: boolean;
  type: 'corrupted_crystal' | 'barrier_monolith' | 'ruin_debris';
  glowColor: string;
}

export type PlatformType = 'solid' | 'one-way' | 'floating';

export interface Platform {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: PlatformType;
  assetKey?: string;
  repeatX?: boolean;
  renderOffsetX?: number;
  renderOffsetY?: number;
  renderWidth?: number;
  renderHeight?: number;
}

export interface DecorativeProp {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  assetKey: string;
  layer: 'back' | 'mid' | 'fore';
  parallaxFactor?: number;
  alpha?: number;
  glow?: boolean;
  glowColor?: string;
}

export interface EchoPoint {
  id: string;
  x: number;
  y: number;
  radius: number;
  title: string;
  subTitle: string;
  abilityName: string;
  description: string;
  inherited: boolean;
  flameFrame: number;
  flameTimer: number;
}

export interface GameParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  type: 'ember' | 'ash' | 'leaf' | 'spectral' | 'dust' | 'rock';
  rotation?: number;
  rotSpeed?: number;
}

export interface LevelData {
  name: string;
  subTitle: string;
  width: number;
  height: number;
  spawnPoint: { x: number; y: number };
  platforms: Platform[];
  props: DecorativeProp[];
  echoPoints: EchoPoint[];
  destructibles: DestructibleObject[];
}

export interface CameraState {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  viewportWidth: number;
  viewportHeight: number;
  shakeX: number;
  shakeY: number;
  shakeIntensity: number;
  shakeTimer: number;
}

export interface InputState {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
  jump: boolean;
  run: boolean;
  attack: boolean;
  interact: boolean;
  pause: boolean;
}
