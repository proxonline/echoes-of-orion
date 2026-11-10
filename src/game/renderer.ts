import {
  PlayerState,
  LevelData,
  CameraState,
  GameParticle,
  Platform,
  EchoPoint,
  Projectile,
  ImpactBurst,
  DestructibleObject,
} from './types';
import {
  CANVAS_VIRTUAL_WIDTH,
  CANVAS_VIRTUAL_HEIGHT,
  SPRITE_DRAW_WIDTH,
  SPRITE_DRAW_HEIGHT,
} from './constants';
import { assetLoader } from './assetLoader';

export class GameRenderer {
  private particles: GameParticle[] = [];
  private impactBursts: ImpactBurst[] = [];
  private celestialRiftPulse = 0;

  constructor() {
    this.initAmbientParticles();
  }

  private initAmbientParticles() {
    this.particles = [];
    for (let i = 0; i < 75; i++) {
      this.particles.push(this.createParticle(Math.random() * 5300, Math.random() * 1100));
    }
  }

  private createParticle(x: number, y: number): GameParticle {
    const isLeaf = Math.random() > 0.6;
    const isEmber = !isLeaf && Math.random() > 0.45;
    const isSpectral = !isLeaf && !isEmber && Math.random() > 0.6;

    return {
      x,
      y,
      vx: isLeaf ? -25 - Math.random() * 35 : (Math.random() - 0.5) * 20,
      vy: isLeaf ? 20 + Math.random() * 30 : isEmber ? -15 - Math.random() * 25 : 10 + Math.random() * 15,
      size: isLeaf ? 4 + Math.random() * 4 : isEmber ? 1.5 + Math.random() * 2.5 : 1 + Math.random() * 2,
      color: isLeaf ? '#dc2626' : isEmber ? '#f59e0b' : isSpectral ? '#38bdf8' : '#cbd5e1',
      alpha: 0.4 + Math.random() * 0.5,
      life: 0,
      maxLife: 6 + Math.random() * 8,
      type: isLeaf ? 'leaf' : isEmber ? 'ember' : isSpectral ? 'spectral' : 'ash',
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 2,
    };
  }

  public addStepDust(x: number, y: number, dir: number) {
    for (let i = 0; i < 4; i++) {
      this.particles.push({
        x: x + (Math.random() - 0.5) * 14,
        y: y - 2,
        vx: -dir * (25 + Math.random() * 40),
        vy: -10 - Math.random() * 25,
        size: 2 + Math.random() * 3,
        color: '#94a3b8',
        alpha: 0.6,
        life: 0,
        maxLife: 0.35 + Math.random() * 0.25,
        type: 'dust',
      });
    }
  }

  public addEchoBurst(x: number, y: number) {
    for (let i = 0; i < 55; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 70 + Math.random() * 220;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 3 + Math.random() * 5,
        color: Math.random() > 0.4 ? '#38bdf8' : '#c5a059',
        alpha: 0.95,
        life: 0,
        maxLife: 1.2 + Math.random() * 0.8,
        type: 'spectral',
      });
    }
  }

  public addImpact(x: number, y: number, isEmpowered: boolean) {
    // Add visual impact burst sprite
    this.impactBursts.push({
      id: `impact_${Date.now()}_${Math.random()}`,
      x,
      y,
      size: isEmpowered ? 160 : 110,
      life: 0,
      maxLife: 0.38,
      rotation: Math.random() * Math.PI * 2,
    });

    // Add rock shatter fragments
    for (let i = 0; i < (isEmpowered ? 20 : 12); i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 80 + Math.random() * (isEmpowered ? 260 : 160);
      this.particles.push({
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 20,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 60,
        size: 3 + Math.random() * 5,
        color: Math.random() > 0.5 ? '#64748b' : isEmpowered ? '#38bdf8' : '#cbd5e1',
        alpha: 0.9,
        life: 0,
        maxLife: 0.6 + Math.random() * 0.4,
        type: 'rock',
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 8,
      });
    }
  }

  public update(dt: number) {
    this.celestialRiftPulse += dt * 1.6;

    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life += dt;
      if (p.life >= p.maxLife) {
        if (p.type === 'dust' || p.type === 'rock') {
          this.particles.splice(i, 1);
        } else {
          this.particles[i] = this.createParticle(Math.random() * 5300, Math.random() * 1100);
        }
        continue;
      }

      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (p.type === 'rock') {
        p.vy += 800 * dt; // gravity on debris
      }
      if (p.rotation !== undefined && p.rotSpeed !== undefined) {
        p.rotation += p.rotSpeed * dt;
      }
    }

    // Update impact bursts
    for (let i = this.impactBursts.length - 1; i >= 0; i--) {
      const b = this.impactBursts[i];
      b.life += dt;
      if (b.life >= b.maxLife) {
        this.impactBursts.splice(i, 1);
      }
    }
  }

  public render(
    ctx: CanvasRenderingContext2D,
    player: PlayerState,
    level: LevelData,
    camera: CameraState,
    projectiles: Projectile[],
    isNearEcho: boolean
  ) {
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // 1. SKY & MOONLIT BACKDROP LAYER (High Visibility!)
    const backdropImg = assetLoader.getImage('moonlit_sky_backdrop');
    if (backdropImg) {
      // Parallax scrolling for the moonlit scenery
      const bgFactor = 0.08;
      const bgOffsetX = -(camera.x * bgFactor) % CANVAS_VIRTUAL_WIDTH;

      // Draw background across the viewport
      ctx.drawImage(backdropImg, bgOffsetX, 0, CANVAS_VIRTUAL_WIDTH, CANVAS_VIRTUAL_HEIGHT);
      if (bgOffsetX > 0) {
        ctx.drawImage(backdropImg, bgOffsetX - CANVAS_VIRTUAL_WIDTH, 0, CANVAS_VIRTUAL_WIDTH, CANVAS_VIRTUAL_HEIGHT);
      } else if (bgOffsetX < 0) {
        ctx.drawImage(backdropImg, bgOffsetX + CANVAS_VIRTUAL_WIDTH, 0, CANVAS_VIRTUAL_WIDTH, CANVAS_VIRTUAL_HEIGHT);
      }
    } else {
      // Clean luminous twilight sky fallback
      const skyGrad = ctx.createLinearGradient(0, 0, 0, CANVAS_VIRTUAL_HEIGHT);
      skyGrad.addColorStop(0, '#0a1020');
      skyGrad.addColorStop(0.4, '#14223d');
      skyGrad.addColorStop(0.8, '#1e335a');
      skyGrad.addColorStop(1, '#111e33');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, CANVAS_VIRTUAL_WIDTH, CANVAS_VIRTUAL_HEIGHT);
    }

    // Soft Ambient Moonlit Fog overlay across top
    const moonGlow = ctx.createRadialGradient(
      CANVAS_VIRTUAL_WIDTH * 0.65 - camera.x * 0.05,
      CANVAS_VIRTUAL_HEIGHT * 0.22,
      20,
      CANVAS_VIRTUAL_WIDTH * 0.65 - camera.x * 0.05,
      CANVAS_VIRTUAL_HEIGHT * 0.22,
      450
    );
    moonGlow.addColorStop(0, 'rgba(186, 230, 253, 0.35)');
    moonGlow.addColorStop(0.4, 'rgba(56, 189, 248, 0.15)');
    moonGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = moonGlow;
    ctx.fillRect(0, 0, CANVAS_VIRTUAL_WIDTH, CANVAS_VIRTUAL_HEIGHT);

    // Apply Camera Translation with Screen Shake
    ctx.save();
    const shakeOffsetX = (Math.random() - 0.5) * camera.shakeIntensity * (camera.shakeTimer > 0 ? 1 : 0);
    const shakeOffsetY = (Math.random() - 0.5) * camera.shakeIntensity * (camera.shakeTimer > 0 ? 1 : 0);
    ctx.translate(-camera.x + shakeOffsetX, -camera.y + shakeOffsetY);

    // 2. PARALLAX SILHOUETTES & FAR RUINS (Layer: 'back')
    for (const prop of level.props) {
      if (prop.layer !== 'back') continue;
      const factor = prop.parallaxFactor ?? 0.16;
      const screenX = prop.x - (camera.x * factor);
      const screenY = prop.y - (camera.y * factor);

      const img = assetLoader.getImage(prop.assetKey);
      if (img) {
        ctx.save();
        ctx.globalAlpha = prop.alpha ?? 0.85;
        ctx.drawImage(img, screenX, screenY, prop.width, prop.height);
        ctx.restore();
      }
    }

    // 3. MIDGROUND PROPS & TORCH LIGHTING
    for (const prop of level.props) {
      if (prop.layer !== 'mid') continue;
      const img = assetLoader.getImage(prop.assetKey);
      if (!img) continue;

      // Bright warm halo for lanterns and braziers
      if (prop.glow) {
        const glowX = prop.x + prop.width / 2;
        const glowY = prop.y + prop.height * 0.35;
        const radius = prop.assetKey.includes('brazier') ? 140 : 100;
        const glowGrad = ctx.createRadialGradient(glowX, glowY, 4, glowX, glowY, radius);
        glowGrad.addColorStop(0, prop.glowColor ? `${prop.glowColor}aa` : 'rgba(251, 191, 36, 0.7)');
        glowGrad.addColorStop(0.5, prop.glowColor ? `${prop.glowColor}44` : 'rgba(245, 158, 11, 0.25)');
        glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(glowX, glowY, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.drawImage(img, prop.x, prop.y, prop.width, prop.height);
    }

    // 4. DESTRUCTIBLE CORRUPTED TARGETS & BARRIERS
    for (const dest of level.destructibles) {
      this.renderDestructible(ctx, dest);
    }

    // 5. PLAYABLE PLATFORMS & VISIBLE TERRAIN
    for (const plat of level.platforms) {
      this.renderPlatform(ctx, plat);
    }

    // 6. INTERACTIVE ECHO POINT
    for (const echo of level.echoPoints) {
      this.renderEchoPoint(ctx, echo, isNearEcho);
    }

    // 7. ACTIVE PROJECTILES (Spectral Crescent Slashes!)
    this.renderProjectiles(ctx, projectiles);

    // 8. IMPACT BURSTS
    this.renderImpactBursts(ctx);

    // 9. PLAYER CHARACTER
    this.renderPlayer(ctx, player);

    // 10. DYNAMIC PARTICLES
    for (const p of this.particles) {
      const alpha = p.alpha * (1 - p.life / p.maxLife);
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
      ctx.fillStyle = p.color;

      if (p.type === 'leaf' && p.rotation !== undefined) {
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      } else if (p.type === 'spectral') {
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === 'rock' && p.rotation !== undefined) {
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      } else {
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
      }
      ctx.restore();
    }

    // 11. FOREGROUND FRAMING PROPS
    for (const prop of level.props) {
      if (prop.layer !== 'fore') continue;
      const img = assetLoader.getImage(prop.assetKey);
      if (!img) continue;

      ctx.save();
      if (prop.alpha) ctx.globalAlpha = prop.alpha;
      ctx.drawImage(img, prop.x, prop.y, prop.width, prop.height);
      ctx.restore();
    }

    ctx.restore(); // End camera space

    // 12. SUBTLE CINEMATIC VIGNETTE (Restrained, crystal-clear center visibility!)
    const vigGrad = ctx.createRadialGradient(
      CANVAS_VIRTUAL_WIDTH / 2,
      CANVAS_VIRTUAL_HEIGHT / 2,
      CANVAS_VIRTUAL_WIDTH * 0.45,
      CANVAS_VIRTUAL_WIDTH / 2,
      CANVAS_VIRTUAL_HEIGHT / 2,
      CANVAS_VIRTUAL_WIDTH * 0.75
    );
    vigGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vigGrad.addColorStop(1, 'rgba(4, 7, 14, 0.35)');
    ctx.fillStyle = vigGrad;
    ctx.fillRect(0, 0, CANVAS_VIRTUAL_WIDTH, CANVAS_VIRTUAL_HEIGHT);
  }

  private renderPlatform(ctx: CanvasRenderingContext2D, plat: Platform) {
    const img = plat.assetKey ? assetLoader.getImage(plat.assetKey) : undefined;
    const rx = plat.x + (plat.renderOffsetX ?? 0);
    const ry = plat.y + (plat.renderOffsetY ?? 0);
    const rw = plat.renderWidth ?? plat.width;
    const rh = plat.renderHeight ?? plat.height;

    if (img) {
      if (plat.repeatX) {
        const tileW = img.width;
        const tileH = img.height;
        let curX = rx;
        while (curX < rx + rw) {
          const drawW = Math.min(tileW, rx + rw - curX);
          ctx.drawImage(img, 0, 0, drawW, tileH, curX, ry, drawW, tileH);
          curX += tileW;
        }

        // Stone core fill
        if (plat.height > tileH) {
          ctx.fillStyle = '#111827';
          ctx.fillRect(plat.x, plat.y + tileH - 12, plat.width, plat.height - tileH + 12);
        }
      } else {
        ctx.drawImage(img, rx, ry, rw, rh);
      }
    } else {
      // Crisp stone block
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(plat.x, plat.y, plat.width, 3);
    }

    // Top Surface Highlighting for crystal-clear readability
    ctx.save();
    ctx.strokeStyle = 'rgba(186, 230, 253, 0.25)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(plat.x, plat.y);
    ctx.lineTo(plat.x + plat.width, plat.y);
    ctx.stroke();
    ctx.restore();
  }

  private renderDestructible(ctx: CanvasRenderingContext2D, dest: DestructibleObject) {
    if (dest.isDestroyed) return;

    ctx.save();
    const cx = dest.x + dest.width / 2;
    const cy = dest.y + dest.height / 2;

    // Glowing aura
    const pulse = Math.sin(this.celestialRiftPulse * 3) * 0.2 + 0.8;
    const grad = ctx.createRadialGradient(cx, cy, 6, cx, cy, dest.width * 0.9 * pulse);
    grad.addColorStop(0, `${dest.glowColor}99`);
    grad.addColorStop(0.6, `${dest.glowColor}22`);
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, dest.width * 0.9 * pulse, 0, Math.PI * 2);
    ctx.fill();

    // Sharp crystalline / monolith shape
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = dest.glowColor;
    ctx.lineWidth = 2.5;

    ctx.beginPath();
    ctx.moveTo(cx, dest.y);
    ctx.lineTo(dest.x + dest.width, dest.y + dest.height * 0.4);
    ctx.lineTo(dest.x + dest.width * 0.85, dest.y + dest.height);
    ctx.lineTo(dest.x + dest.width * 0.15, dest.y + dest.height);
    ctx.lineTo(dest.x, dest.y + dest.height * 0.4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Internal crack lines
    ctx.strokeStyle = dest.glowColor;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx, dest.y + 10);
    ctx.lineTo(cx - 8, cy);
    ctx.lineTo(cx + 6, cy + 18);
    ctx.lineTo(cx, dest.y + dest.height - 10);
    ctx.stroke();

    // HP Bar if damaged
    if (dest.hp < dest.maxHp) {
      const barW = dest.width + 10;
      const barH = 5;
      const barX = cx - barW / 2;
      const barY = dest.y - 12;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(barX, barY, barW, barH);
      const hpPct = Math.max(0, dest.hp / dest.maxHp);
      ctx.fillStyle = dest.glowColor;
      ctx.fillRect(barX, barY, barW * hpPct, barH);
    }

    ctx.restore();
  }

  private renderProjectiles(ctx: CanvasRenderingContext2D, projectiles: Projectile[]) {
    const slashImg = assetLoader.getImage('echo_blade_slash');

    for (const proj of projectiles) {
      ctx.save();
      const cx = proj.x + proj.width / 2;
      const cy = proj.y + proj.height / 2;

      ctx.translate(cx, cy);
      if (proj.facing === 'left') {
        ctx.scale(-1, 1);
      }

      // Additive / Screen blending for luminous magical energy arc!
      ctx.globalCompositeOperation = 'screen';

      if (slashImg) {
        ctx.drawImage(
          slashImg,
          -proj.width / 2,
          -proj.height / 2,
          proj.width,
          proj.height
        );
      } else {
        // Fallback glowing arc
        ctx.strokeStyle = proj.isEmpowered ? '#38bdf8' : '#e0e7ff';
        ctx.lineWidth = 8;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(0, 0, 45, -Math.PI / 3, Math.PI / 3);
        ctx.stroke();
      }

      // Trailing celestial energy sparks
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = proj.isEmpowered ? '#38bdf8' : '#f59e0b';
      for (let s = 0; s < 3; s++) {
        const sparkX = -proj.width / 2 + (Math.random() - 0.5) * 20;
        const sparkY = (Math.random() - 0.5) * 30;
        ctx.fillRect(sparkX, sparkY, 3, 3);
      }

      ctx.restore();
    }
  }

  private renderImpactBursts(ctx: CanvasRenderingContext2D) {
    const burstImg = assetLoader.getImage('echo_impact_burst');

    for (const b of this.impactBursts) {
      const progress = b.life / b.maxLife;
      const alpha = 1 - progress;
      const scale = 0.5 + progress * 0.9;

      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(b.rotation);
      ctx.scale(scale, scale);
      ctx.globalAlpha = Math.max(0, alpha);
      ctx.globalCompositeOperation = 'screen';

      if (burstImg) {
        ctx.drawImage(
          burstImg,
          -b.size / 2,
          -b.size / 2,
          b.size,
          b.size
        );
      } else {
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(0, 0, b.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  private renderEchoPoint(ctx: CanvasRenderingContext2D, echo: EchoPoint, isNear: boolean) {
    if (echo.inherited) return;

    echo.flameTimer += 0.016;
    if (echo.flameTimer >= 0.09) {
      echo.flameTimer = 0;
      echo.flameFrame = (echo.flameFrame + 1) % 8;
    }

    const flameImg = assetLoader.getImage(`spectral_flame_${echo.flameFrame}`);
    const orbImg = assetLoader.getImage('spectral_blue_orb');

    // 1. Ethereal Blue Glow Halo
    const auraPulse = Math.sin(this.celestialRiftPulse * 2.5) * 0.25 + 0.85;
    const auraGrad = ctx.createRadialGradient(echo.x, echo.y, 10, echo.x, echo.y, 150 * auraPulse);
    auraGrad.addColorStop(0, 'rgba(56, 189, 248, 0.6)');
    auraGrad.addColorStop(0.5, 'rgba(2, 132, 199, 0.25)');
    auraGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = auraGrad;
    ctx.beginPath();
    ctx.arc(echo.x, echo.y, 150 * auraPulse, 0, Math.PI * 2);
    ctx.fill();

    // 2. Swirling Soul Orb
    if (orbImg) {
      const orbW = 52;
      const orbH = 34;
      const bobY = Math.sin(this.celestialRiftPulse * 3) * 8;
      ctx.drawImage(orbImg, echo.x - orbW / 2, echo.y - orbH / 2 + bobY, orbW, orbH);
    }

    // 3. Central Spectral Flame
    if (flameImg) {
      const flameW = 28;
      const flameH = 44;
      ctx.drawImage(flameImg, echo.x - flameW / 2, echo.y - flameH - 8, flameW, flameH);
    }

    // 4. Floating Interaction Prompt
    if (isNear) {
      const promptY = echo.y - 85 + Math.sin(this.celestialRiftPulse * 4) * 4;
      ctx.save();
      ctx.shadowColor = '#000';
      ctx.shadowBlur = 12;

      ctx.fillStyle = 'rgba(6, 9, 14, 0.95)';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      const text = '[E] INHERIT CELESTIAL ECHO';
      ctx.font = 'bold 13px "Cinzel", serif';
      const tw = ctx.measureText(text).width;
      const pw = tw + 32;
      const ph = 30;

      ctx.beginPath();
      ctx.rect(echo.x - pw / 2, promptY - ph / 2, pw, ph);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#f8fafc';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, echo.x, promptY);
      ctx.restore();
    }
  }

  private renderPlayer(ctx: CanvasRenderingContext2D, player: PlayerState) {
    // 1. Ground Contact Shadow
    if (player.isGrounded) {
      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
      ctx.beginPath();
      ctx.ellipse(
        player.x + player.width / 2,
        player.y + player.height - 1,
        player.width * 0.75,
        7,
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.restore();
    }

    // 2. Select Sprite Asset Key based on State
    const char = player.characterId;
    let spriteKey = `${char}_idle`;

    if (player.isJumping) {
      spriteKey = `${char}_jump`;
    } else if (player.isFalling) {
      spriteKey = `${char}_fall`;
    } else if (player.isGrounded && Math.abs(player.vx) > 15) {
      spriteKey = `${char}_walk_${player.currentFrame}`;
    }

    const spriteImg = assetLoader.getImage(spriteKey) || assetLoader.getImage(`${char}_idle`);

    ctx.save();

    const centerX = player.x + player.width / 2;
    const bottomY = player.y + player.height;

    ctx.translate(centerX, bottomY);

    if (player.facing === 'left') {
      ctx.scale(-1, 1);
    }

    // Landing squash & stretch animation
    if (player.landingTimer > 0) {
      const progress = player.landingTimer / 0.08;
      const squashX = 1 + 0.12 * progress;
      const squashY = 1 - 0.1 * progress;
      ctx.scale(squashX, squashY);
    }

    // Attack slash posture lunge
    if (player.isAttacking) {
      ctx.rotate(0.08);
      ctx.scale(1.05, 1.0);
    }

    if (spriteImg) {
      const drawX = -SPRITE_DRAW_WIDTH / 2;
      const drawY = -SPRITE_DRAW_HEIGHT + 3;
      ctx.drawImage(spriteImg, drawX, drawY, SPRITE_DRAW_WIDTH, SPRITE_DRAW_HEIGHT);
    } else {
      ctx.fillStyle = char === 'kiyoji' ? '#38bdf8' : '#f43f5e';
      ctx.fillRect(-player.width / 2, -player.height, player.width, player.height);
    }

    // Weapon Aura Glow if Echo is Inherited!
    if (player.hasEchoAbility) {
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(player.facing === 'right' ? 12 : -12, -45, 18, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    ctx.restore();
  }
}
