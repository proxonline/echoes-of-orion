import React, { useEffect, useRef, useState, useCallback } from 'react';
import { CharacterId } from '../types/game';
import { PlayerState, InputState, CameraState, Projectile } from '../game/types';
import { CANVAS_VIRTUAL_WIDTH, CANVAS_VIRTUAL_HEIGHT } from '../game/constants';
import { LEVEL_MINAKAMI } from '../game/levelData';
import { createInitialPlayer, updatePhysics } from '../game/physics';
import { GameRenderer } from '../game/renderer';
import { assetLoader } from '../game/assetLoader';
import { soundEngine } from '../audio/soundEngine';
import {
  ArrowLeft,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Play,
  Swords,
  Check,
  Zap,
} from 'lucide-react';

interface PlayableLevelProps {
  initialCharacterId: CharacterId;
  onReturnToTitle: () => void;
}

export const PlayableLevel: React.FC<PlayableLevelProps> = ({
  initialCharacterId,
  onReturnToTitle,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Engine Refs
  const playerRef = useRef<PlayerState>(
    createInitialPlayer(LEVEL_MINAKAMI.spawnPoint.x, LEVEL_MINAKAMI.spawnPoint.y, initialCharacterId)
  );
  const cameraRef = useRef<CameraState>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    viewportWidth: CANVAS_VIRTUAL_WIDTH,
    viewportHeight: CANVAS_VIRTUAL_HEIGHT,
    shakeX: 0,
    shakeY: 0,
    shakeIntensity: 0,
    shakeTimer: 0,
  });
  const inputRef = useRef<InputState>({
    left: false,
    right: false,
    up: false,
    down: false,
    jump: false,
    run: false,
    attack: false,
    interact: false,
    pause: false,
  });
  const projectilesRef = useRef<Projectile[]>([]);
  const rendererRef = useRef<GameRenderer>(new GameRenderer());
  const levelRef = useRef(JSON.parse(JSON.stringify(LEVEL_MINAKAMI)));

  // UI Reactive States
  const [characterId, setCharacterId] = useState<CharacterId>(initialCharacterId);
  const [isNearEcho, setIsNearEcho] = useState<boolean>(false);
  const [hasEchoPower, setHasEchoPower] = useState<boolean>(false);
  const [activeEchoDialog, setActiveEchoDialog] = useState<{
    title: string;
    subTitle: string;
    abilityName: string;
    description: string;
  } | null>(null);
  const [echoesCount, setEchoesCount] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [showHelp, setShowHelp] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [bannerNotice, setBannerNotice] = useState<string | null>(null);
  const [abilityCooldownPct, setAbilityCooldownPct] = useState<number>(0);

  // Switch Character
  const switchCharacter = useCallback((newId?: CharacterId) => {
    soundEngine.playSelect();
    const nextChar = newId || (playerRef.current.characterId === 'kiyoji' ? 'hanetsu' : 'kiyoji');
    playerRef.current.characterId = nextChar;
    setCharacterId(nextChar);
  }, []);

  // Preload Assets
  useEffect(() => {
    let mounted = true;
    assetLoader.preloadAll().then(() => {
      if (mounted) {
        setIsLoaded(true);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Trigger attack from button or key
  const triggerAttack = useCallback(() => {
    inputRef.current.attack = true;
    setTimeout(() => {
      inputRef.current.attack = false;
    }, 50);
  }, []);

  // Keyboard Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeEchoDialog) {
        if (e.key === 'Enter' || e.key === 'e' || e.key === 'E' || e.key === 'Escape') {
          e.preventDefault();
          soundEngine.playConfirm();
          setActiveEchoDialog(null);
        }
        return;
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        soundEngine.playBack();
        setIsPaused((prev) => !prev);
        return;
      }

      if (isPaused) {
        if (e.key === 'Tab') {
          e.preventDefault();
          switchCharacter();
        } else if (e.key === 'r' || e.key === 'R') {
          e.preventDefault();
          restartLevel();
        }
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'a':
        case 'arrowleft':
          inputRef.current.left = true;
          break;
        case 'd':
        case 'arrowright':
          inputRef.current.right = true;
          break;
        case 'w':
        case 'arrowup':
          inputRef.current.up = true;
          break;
        case 's':
        case 'arrowdown':
          inputRef.current.down = true;
          break;
        case ' ':
          inputRef.current.jump = true;
          break;
        case 'shift':
          inputRef.current.run = true;
          break;
        case 'f':
        case 'j':
          inputRef.current.attack = true;
          break;
        case 'e':
          inputRef.current.interact = true;
          checkEchoInteraction();
          break;
        case 'tab':
          e.preventDefault();
          switchCharacter();
          break;
        case 'h':
          setShowHelp((prev) => !prev);
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'a':
        case 'arrowleft':
          inputRef.current.left = false;
          break;
        case 'd':
        case 'arrowright':
          inputRef.current.right = false;
          break;
        case 'w':
        case 'arrowup':
          inputRef.current.up = false;
          break;
        case 's':
        case 'arrowdown':
          inputRef.current.down = false;
          break;
        case ' ':
          inputRef.current.jump = false;
          break;
        case 'shift':
          inputRef.current.run = false;
          break;
        case 'f':
        case 'j':
          inputRef.current.attack = false;
          break;
        case 'e':
          inputRef.current.interact = false;
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [activeEchoDialog, isPaused, switchCharacter]);

  // Echo Interaction
  const checkEchoInteraction = () => {
    const player = playerRef.current;
    const level = levelRef.current;
    const playerCenterX = player.x + player.width / 2;
    const playerCenterY = player.y + player.height / 2;

    for (const echo of level.echoPoints) {
      if (echo.inherited) continue;
      const dx = playerCenterX - echo.x;
      const dy = playerCenterY - echo.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= echo.radius) {
        soundEngine.playEchoAbsorb();
        rendererRef.current.addEchoBurst(echo.x, echo.y);
        echo.inherited = true;

        // Empower player ability
        player.hasEchoAbility = true;
        setHasEchoPower(true);
        setEchoesCount((prev) => prev + 1);

        setBannerNotice('POWER AWAKENED: STONE-PIERCING CELESTIAL STRIKE [PRESS F OR J]');
        setTimeout(() => setBannerNotice(null), 4500);

        setActiveEchoDialog({
          title: echo.title,
          subTitle: echo.subTitle,
          abilityName: echo.abilityName,
          description: echo.description,
        });
        break;
      }
    }
  };

  const restartLevel = () => {
    soundEngine.playSelect();
    playerRef.current = createInitialPlayer(
      LEVEL_MINAKAMI.spawnPoint.x,
      LEVEL_MINAKAMI.spawnPoint.y,
      playerRef.current.characterId
    );
    levelRef.current = JSON.parse(JSON.stringify(LEVEL_MINAKAMI));
    projectilesRef.current = [];
    setEchoesCount(0);
    setHasEchoPower(false);
    setIsPaused(false);
    setBannerNotice(null);
  };

  // Main Game Loop
  useEffect(() => {
    if (!isLoaded) return;

    let animationFrameId: number;
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.05);
      lastTime = currentTime;

      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          if (!isPaused && !activeEchoDialog) {
            // Update Camera Shake timer
            const camera = cameraRef.current;
            if (camera.shakeTimer > 0) {
              camera.shakeTimer = Math.max(0, camera.shakeTimer - dt);
            }

            // Update Physics
            const { landed } = updatePhysics(
              playerRef.current,
              inputRef.current,
              levelRef.current,
              projectilesRef.current,
              camera,
              dt,
              (x, y, isEmpowered) => {
                rendererRef.current.addImpact(x, y, isEmpowered);
              },
              (near) => setIsNearEcho(near)
            );

            if (landed) {
              rendererRef.current.addStepDust(
                playerRef.current.x + playerRef.current.width / 2,
                playerRef.current.y + playerRef.current.height,
                0
              );
            }

            // Sync ability cooldown
            if (playerRef.current.abilityCooldown > 0) {
              setAbilityCooldownPct(
                playerRef.current.abilityCooldown / playerRef.current.maxAbilityCooldown
              );
            } else {
              setAbilityCooldownPct(0);
            }

            // Camera Following (Smooth Exponential Lerp)
            const targetCamX = playerRef.current.x + playerRef.current.width / 2 - camera.viewportWidth * 0.42;
            const targetCamY = playerRef.current.y + playerRef.current.height / 2 - camera.viewportHeight * 0.62;

            const minCamX = 0;
            const maxCamX = Math.max(0, levelRef.current.width - camera.viewportWidth);
            const minCamY = 0;
            const maxCamY = Math.max(0, levelRef.current.height - camera.viewportHeight);

            const clampedTargetX = Math.max(minCamX, Math.min(targetCamX, maxCamX));
            const clampedTargetY = Math.max(minCamY, Math.min(targetCamY, maxCamY));

            const lerpFactor = 1 - Math.exp(-8 * dt);
            camera.x += (clampedTargetX - camera.x) * lerpFactor;
            camera.y += (clampedTargetY - camera.y) * lerpFactor;

            rendererRef.current.update(dt);
          }

          // Render Frame
          rendererRef.current.render(
            ctx,
            playerRef.current,
            levelRef.current,
            cameraRef.current,
            projectilesRef.current,
            isNearEcho
          );
        }
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isLoaded, isPaused, activeEchoDialog, isNearEcho]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black select-none flex items-center justify-center">
      {/* 16:9 Letterboxed Game Canvas Container */}
      <div className="relative w-full h-full max-w-[1920px] max-h-[1080px] aspect-video flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={CANVAS_VIRTUAL_WIDTH}
          height={CANVAS_VIRTUAL_HEIGHT}
          onClick={triggerAttack}
          className="w-full h-full object-contain block bg-[#070d18] cursor-crosshair"
        />

        {/* Loading Veil */}
        {!isLoaded && (
          <div className="absolute inset-0 bg-[#070b13] flex flex-col items-center justify-center gap-4 z-50">
            <div className="w-10 h-10 rotate-45 border-2 border-[#38bdf8] border-t-transparent animate-spin" />
            <span className="font-title text-sm tracking-[0.25em] text-[#ede8dc] uppercase">
              ENTERING ASHES OF MINAKAMI...
            </span>
          </div>
        )}

        {/* TOP BANNER NOTIFICATION */}
        {bannerNotice && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none animate-fadeIn">
            <div className="px-6 py-2.5 bg-[#0a1220]/90 border border-[#38bdf8] shadow-[0_0_25px_rgba(56,189,248,0.4)] flex items-center gap-3">
              <Zap className="w-4 h-4 text-[#38bdf8] animate-bounce" />
              <span className="font-title text-xs tracking-[0.2em] font-bold text-[#f8fafc] uppercase">
                {bannerNotice}
              </span>
            </div>
          </div>
        )}

        {/* MINIMAL GAME HUD */}
        {isLoaded && (
          <div className="absolute inset-0 pointer-events-none p-6 sm:p-8 flex flex-col justify-between z-20">
            {/* Top Row */}
            <div className="flex items-start justify-between pointer-events-auto">
              {/* Left: Active Hero Card, Vitality & Ability Trigger */}
              <div className="flex items-center gap-4 bg-black/65 backdrop-blur-md border border-[#223249] p-3 px-4 shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
                <div className="w-11 h-11 border border-[#c5a059]/70 overflow-hidden bg-[#07090e] shrink-0">
                  <img
                    src={`/assets/game/characters/${characterId}/idle.png`}
                    alt={characterId}
                    className="w-full h-full object-cover object-top filter brightness-110"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-title text-xs tracking-[0.2em] font-bold text-[#ede8dc] uppercase">
                      {characterId === 'kiyoji' ? 'KIYOJI' : 'HANETSU'}
                    </span>
                    <button
                      type="button"
                      onClick={() => switchCharacter()}
                      className="text-[9px] font-mono tracking-wider text-[#c5a059] hover:text-white border border-[#c5a059]/40 hover:border-[#c5a059] px-2 py-0.5 transition-colors cursor-pointer"
                      title="Switch Character (Key: Tab)"
                    >
                      [TAB] SWITCH
                    </button>
                  </div>

                  {/* Health Bar */}
                  <div className="flex items-center gap-2">
                    <div className="w-36 h-2 bg-[#141b29] overflow-hidden border border-[#233147]">
                      <div className="h-full bg-gradient-to-r from-[#991b1b] to-[#ef4444] w-full" />
                    </div>
                    <span className="text-[10px] font-mono text-[#94a3b8]">100</span>
                  </div>
                </div>

                {/* Skill Icon Slot */}
                <div className="h-8 w-[1px] bg-[#223249]" />

                <button
                  type="button"
                  onClick={triggerAttack}
                  className={`group relative flex items-center gap-3 p-1.5 px-3 border transition-all cursor-pointer ${
                    hasEchoPower
                      ? 'border-[#38bdf8] bg-[#38bdf8]/15 hover:bg-[#38bdf8]/25 shadow-[0_0_12px_rgba(56,189,248,0.3)]'
                      : 'border-[#334155] bg-[#0f172a]/60 hover:bg-[#0f172a]'
                  }`}
                  title="Unleash Blade Strike (Key: F or J)"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-[#38bdf8]/70 shrink-0 relative bg-black">
                    <img
                      src="/assets/game/effects/echo_power_skill_icon.jpg"
                      alt="Stone-Piercing Strike"
                      className="w-full h-full object-cover filter brightness-110"
                    />
                    {abilityCooldownPct > 0 && (
                      <div
                        className="absolute inset-0 bg-black/70 flex items-center justify-center text-[9px] font-mono font-bold text-white"
                        style={{ height: `${abilityCooldownPct * 100}%` }}
                      />
                    )}
                  </div>

                  <div className="text-left space-y-0.5">
                    <span className="text-[9px] font-ui tracking-wider text-[#94a3b8] uppercase block">
                      {hasEchoPower ? 'CELESTIAL STRIKE' : 'BLADE SLASH'}
                    </span>
                    <span className="text-[10px] font-title font-bold text-[#f8fafc] uppercase block">
                      [F / J / CLICK]
                    </span>
                  </div>
                </button>
              </div>

              {/* Right: Level & Echoes Status */}
              <div className="flex items-center gap-4 bg-black/65 backdrop-blur-md border border-[#223249] p-3 px-4 text-right shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
                <div className="space-y-0.5">
                  <span className="text-[9px] font-ui tracking-[0.25em] text-[#38bdf8] uppercase block font-semibold">
                    LEVEL PROTOTYPE
                  </span>
                  <h3 className="font-title text-xs sm:text-sm tracking-[0.2em] font-bold text-[#ede8dc] uppercase">
                    ASHES OF MINAKAMI
                  </h3>
                </div>

                <div className="h-6 w-[1px] bg-[#223249]" />

                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#38bdf8] animate-pulse" />
                  <span className="font-mono text-xs font-bold text-[#38bdf8]">
                    {echoesCount} / 1 ECHO
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playSelect();
                    setIsPaused(true);
                  }}
                  className="px-3 py-1.5 border border-[#2e3442] hover:border-[#c5a059] text-[10px] font-ui text-[#94a3b8] hover:text-[#ede8dc] uppercase tracking-wider transition-colors cursor-pointer"
                >
                  [ESC] PAUSE
                </button>
              </div>
            </div>

            {/* Bottom Controls Strip */}
            <div className="flex items-end justify-between pointer-events-auto">
              <div className="flex items-center gap-3 text-[10px] font-mono text-[#94a3b8] bg-black/60 backdrop-blur-md border border-[#223249] px-4 py-2">
                <span>
                  <strong className="text-[#38bdf8]">[A / D]</strong> MOVE
                </span>
                <span>·</span>
                <span>
                  <strong className="text-[#38bdf8]">[SPACE]</strong> JUMP
                </span>
                <span>·</span>
                <span>
                  <strong className="text-[#38bdf8]">[SHIFT]</strong> SPRINT
                </span>
                <span>·</span>
                <span>
                  <strong className="text-[#38bdf8]">[F / J / CLICK]</strong> UNLEASH POWER
                </span>
                <span>·</span>
                <span>
                  <strong className="text-[#38bdf8]">[E]</strong> INHERIT ECHO
                </span>
                <span>·</span>
                <span>
                  <strong className="text-[#38bdf8]">[TAB]</strong> SWITCH
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowHelp((prev) => !prev)}
                  className="p-2.5 bg-black/60 hover:bg-black/85 border border-[#223249] text-[#94a3b8] hover:text-[#ede8dc] transition-colors cursor-pointer"
                  title="Toggle Controls Guide (Key: H)"
                >
                  <HelpCircle className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ECHO INHERITANCE MODAL */}
        {activeEchoDialog && (
          <div className="absolute inset-0 z-40 bg-black/85 backdrop-blur-md flex items-center justify-center p-6 animate-fadeIn">
            <div className="max-w-lg w-full bg-[#0a1220] border-2 border-[#38bdf8] p-6 sm:p-8 space-y-5 shadow-[0_0_60px_rgba(56,189,248,0.4)] text-center">
              <div className="w-14 h-14 rotate-45 border-2 border-[#38bdf8] bg-[#0c1626] mx-auto flex items-center justify-center shadow-[0_0_20px_#38bdf8]">
                <Sparkles className="w-7 h-7 text-[#38bdf8] -rotate-45 animate-pulse" />
              </div>

              <div className="space-y-1">
                <span className="font-ui text-[10px] tracking-[0.3em] text-[#38bdf8] uppercase font-semibold block">
                  CELESTIAL ECHO INHERITED
                </span>
                <h3 className="font-title text-xl sm:text-2xl font-bold tracking-[0.2em] text-[#f8fafc] uppercase">
                  {activeEchoDialog.title}
                </h3>
                <span className="font-ui text-xs text-[#94a3b8] block">
                  {activeEchoDialog.subTitle}
                </span>
              </div>

              <div className="p-3 bg-[#060b13] border border-[#1e293b] text-left text-xs font-ui">
                <div className="flex justify-between items-center text-[#38bdf8] font-bold">
                  <span>UNLOCKED POWER:</span>
                  <span className="tracking-wider">{activeEchoDialog.abilityName}</span>
                </div>
              </div>

              <p className="font-ui text-xs sm:text-sm text-[#cbd5e1] leading-relaxed whitespace-pre-line text-left">
                {activeEchoDialog.description}
              </p>

              <button
                type="button"
                onClick={() => {
                  soundEngine.playConfirm();
                  setActiveEchoDialog(null);
                }}
                className="w-full py-3 border border-[#38bdf8] bg-[#38bdf8]/20 hover:bg-[#38bdf8]/35 text-[#f8fafc] font-title text-xs tracking-[0.22em] uppercase font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(56,189,248,0.3)]"
              >
                <Check className="w-4 h-4 text-[#38bdf8]" />
                [ENTER / E] ASSUME THE POWER & UNLEASH [F / J]
              </button>
            </div>
          </div>
        )}

        {/* PAUSE MENU MODAL */}
        {isPaused && (
          <div className="absolute inset-0 z-40 bg-black/85 backdrop-blur-md flex items-center justify-center p-6 animate-fadeIn">
            <div className="max-w-md w-full bg-[#0a101d] border border-[#223249] p-8 space-y-6 text-center shadow-[0_10px_40px_rgba(0,0,0,0.9)]">
              <div className="space-y-1">
                <span className="font-ui text-[10px] tracking-[0.3em] text-[#38bdf8] uppercase font-semibold">
                  ECHOES OF ORION
                </span>
                <h3 className="font-title text-2xl font-bold tracking-[0.25em] text-[#ede8dc] uppercase">
                  GAME PAUSED
                </h3>
              </div>

              <div className="space-y-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playSelect();
                    setIsPaused(false);
                  }}
                  className="w-full py-2.5 border border-[#38bdf8] bg-[#38bdf8]/15 hover:bg-[#38bdf8]/25 text-[#ede8dc] font-title text-xs tracking-[0.2em] uppercase font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  RESUME JOURNEY [ESC]
                </button>

                <button
                  type="button"
                  onClick={() => switchCharacter()}
                  className="w-full py-2.5 border border-[#223249] bg-[#070b13] hover:border-[#38bdf8] hover:bg-[#0f172a] text-[#94a3b8] hover:text-[#ede8dc] font-ui text-xs tracking-[0.18em] uppercase font-semibold transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Swords className="w-3.5 h-3.5" />
                  SWITCH TO {characterId === 'kiyoji' ? 'HANETSU' : 'KIYOJI'} [TAB]
                </button>

                <button
                  type="button"
                  onClick={restartLevel}
                  className="w-full py-2.5 border border-[#223249] bg-[#070b13] hover:border-[#38bdf8] hover:bg-[#0f172a] text-[#94a3b8] hover:text-[#ede8dc] font-ui text-xs tracking-[0.18em] uppercase font-semibold transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  RESTART LEVEL [R]
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playBack();
                    onReturnToTitle();
                  }}
                  className="w-full py-2.5 border border-[#8a242a] bg-[#8a242a]/15 hover:bg-[#8a242a]/30 text-[#ede8dc] font-ui text-xs tracking-[0.18em] uppercase font-semibold transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  RETURN TO TITLE MENU
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CONTROLS GUIDE DRAWER */}
        {showHelp && (
          <div className="absolute top-24 right-8 z-30 w-80 bg-[#09101d]/95 border border-[#223249] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.85)] space-y-3 font-ui text-xs">
            <div className="flex items-center justify-between border-b border-[#1e293b] pb-2">
              <span className="font-title text-[11px] font-bold text-[#38bdf8] tracking-wider uppercase">
                CONTROLS GUIDE
              </span>
              <button
                type="button"
                onClick={() => setShowHelp(false)}
                className="text-[#94a3b8] hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-[#94a3b8]">
              <div className="flex justify-between items-center">
                <span>Unleash Power / Slash</span>
                <span className="font-mono text-[#38bdf8] font-bold">F / J / Left Click</span>
              </div>
              <div className="flex justify-between">
                <span>Move Left / Right</span>
                <span className="font-mono text-[#ded9cd]">A / D / ← →</span>
              </div>
              <div className="flex justify-between">
                <span>Jump (Variable Height)</span>
                <span className="font-mono text-[#ded9cd]">Space</span>
              </div>
              <div className="flex justify-between">
                <span>Sprint</span>
                <span className="font-mono text-[#ded9cd]">Shift</span>
              </div>
              <div className="flex justify-between">
                <span>Interact (Echo Altar)</span>
                <span className="font-mono text-[#ded9cd]">E</span>
              </div>
              <div className="flex justify-between">
                <span>Switch Protagonist</span>
                <span className="font-mono text-[#ded9cd]">Tab</span>
              </div>
              <div className="flex justify-between">
                <span>Pause Menu</span>
                <span className="font-mono text-[#ded9cd]">Escape</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
