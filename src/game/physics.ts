import {
  PlayerState,
  InputState,
  LevelData,
  Projectile,
  CameraState,
} from './types';
import {
  GRAVITY,
  WALK_SPEED,
  RUN_SPEED,
  JUMP_VELOCITY,
  GROUND_ACCEL,
  AIR_ACCEL,
  GROUND_FRICTION,
  MAX_FALL_SPEED,
  COYOTE_TIME,
  JUMP_BUFFER_TIME,
  JUMP_CUT_MULTIPLIER,
  WALK_FRAME_DURATION,
  RUN_FRAME_DURATION,
  WALK_STEP_INTERVAL,
  RUN_STEP_INTERVAL,
  PLAYER_BOX_WIDTH,
  PLAYER_BOX_HEIGHT,
  PROJECTILE_SPEED,
  PROJECTILE_WIDTH,
  PROJECTILE_HEIGHT,
  PROJECTILE_MAX_LIFE,
  ABILITY_COOLDOWN_TIME,
} from './constants';
import { soundEngine } from '../audio/soundEngine';

export function createInitialPlayer(spawnX: number, spawnY: number, characterId: 'kiyoji' | 'hanetsu'): PlayerState {
  return {
    x: spawnX,
    y: spawnY,
    vx: 0,
    vy: 0,
    width: PLAYER_BOX_WIDTH,
    height: PLAYER_BOX_HEIGHT,
    isGrounded: false,
    isJumping: false,
    isFalling: false,
    isLanding: false,
    landingTimer: 0,
    isRunning: false,
    facing: 'right',
    currentFrame: 0,
    animTimer: 0,
    characterId,
    health: 100,
    maxHealth: 100,
    coyoteTimer: 0,
    jumpBufferTimer: 0,
    footstepTimer: 0,
    hasEchoAbility: false,
    abilityCooldown: 0,
    maxAbilityCooldown: ABILITY_COOLDOWN_TIME,
    isAttacking: false,
    attackTimer: 0,
    resonanceEnergy: 100,
  };
}

export function updatePhysics(
  player: PlayerState,
  input: InputState,
  level: LevelData,
  projectiles: Projectile[],
  camera: CameraState,
  dt: number,
  onImpact?: (x: number, y: number, isEmpowered: boolean) => void,
  onEchoNear?: (isNear: boolean) => void
): { landed: boolean; fallenOff: boolean; abilityTriggered: boolean } {
  const delta = Math.min(dt, 0.05);

  let landed = false;
  let fallenOff = false;
  let abilityTriggered = false;

  const prevX = player.x;
  const prevY = player.y;
  const wasGrounded = player.isGrounded;

  // 1. Timers
  if (player.isGrounded) {
    player.coyoteTimer = COYOTE_TIME;
  } else {
    player.coyoteTimer = Math.max(0, player.coyoteTimer - delta);
  }

  if (input.jump) {
    player.jumpBufferTimer = JUMP_BUFFER_TIME;
  } else {
    player.jumpBufferTimer = Math.max(0, player.jumpBufferTimer - delta);
  }

  if (player.landingTimer > 0) {
    player.landingTimer = Math.max(0, player.landingTimer - delta);
    if (player.landingTimer === 0) {
      player.isLanding = false;
    }
  }

  if (player.attackTimer > 0) {
    player.attackTimer = Math.max(0, player.attackTimer - delta);
    if (player.attackTimer === 0) {
      player.isAttacking = false;
    }
  }

  if (player.abilityCooldown > 0) {
    player.abilityCooldown = Math.max(0, player.abilityCooldown - delta);
  }

  // 2. Attack & Power Execution Logic
  if (input.attack && player.attackTimer <= 0 && player.abilityCooldown <= 0) {
    player.isAttacking = true;
    player.attackTimer = 0.22;
    player.abilityCooldown = player.hasEchoAbility ? 0.35 : 0.55;
    abilityTriggered = true;

    // Spawn Crescent Blade Wave Projectile
    const spawnX =
      player.facing === 'right'
        ? player.x + player.width + 5
        : player.x - PROJECTILE_WIDTH - 5;
    const spawnY = player.y + 12;

    projectiles.push({
      id: `proj_${Date.now()}_${Math.random()}`,
      x: spawnX,
      y: spawnY,
      vx: player.facing === 'right' ? PROJECTILE_SPEED : -PROJECTILE_SPEED,
      vy: 0,
      width: PROJECTILE_WIDTH,
      height: PROJECTILE_HEIGHT,
      facing: player.facing,
      life: 0,
      maxLife: PROJECTILE_MAX_LIFE,
      isEmpowered: player.hasEchoAbility,
    });

    soundEngine.playBladeSlash();

    // Trigger subtle player recoil and camera tremor
    camera.shakeTimer = 0.12;
    camera.shakeIntensity = player.hasEchoAbility ? 7 : 4;
  }

  // 3. Horizontal Movement
  player.isRunning = input.run && player.isGrounded;
  const targetSpeed = player.isRunning ? RUN_SPEED : WALK_SPEED;
  let moveDir = 0;
  if (input.left && !input.right) {
    moveDir = -1;
    player.facing = 'left';
  } else if (input.right && !input.left) {
    moveDir = 1;
    player.facing = 'right';
  }

  const accel = player.isGrounded ? GROUND_ACCEL : AIR_ACCEL;

  if (moveDir !== 0) {
    const targetVx = moveDir * targetSpeed;
    if (player.vx < targetVx) {
      player.vx = Math.min(targetVx, player.vx + accel * delta);
    } else if (player.vx > targetVx) {
      player.vx = Math.max(targetVx, player.vx - accel * delta);
    }
  } else {
    if (player.isGrounded) {
      if (player.vx > 0) {
        player.vx = Math.max(0, player.vx - GROUND_FRICTION * delta);
      } else if (player.vx < 0) {
        player.vx = Math.min(0, player.vx + GROUND_FRICTION * delta);
      }
    } else {
      player.vx *= 0.98;
    }
  }

  // 4. Jump Handling
  if (player.jumpBufferTimer > 0 && player.coyoteTimer > 0) {
    player.vy = JUMP_VELOCITY;
    player.isGrounded = false;
    player.isJumping = true;
    player.coyoteTimer = 0;
    player.jumpBufferTimer = 0;
    soundEngine.playJump();
  }

  if (!input.jump && player.vy < -150) {
    player.vy *= JUMP_CUT_MULTIPLIER;
  }

  // 5. Gravity & Vertical Movement
  player.vy = Math.min(MAX_FALL_SPEED, player.vy + GRAVITY * delta);

  player.x += player.vx * delta;

  // Solid platform horizontal collisions
  for (const plat of level.platforms) {
    if (plat.type !== 'solid') continue;

    if (
      player.x < plat.x + plat.width &&
      player.x + player.width > plat.x &&
      player.y < plat.y + plat.height &&
      player.y + player.height > plat.y
    ) {
      if (player.vx > 0 && prevX + player.width <= plat.x) {
        player.x = plat.x - player.width;
        player.vx = 0;
      } else if (player.vx < 0 && prevX >= plat.x + plat.width) {
        player.x = plat.x + plat.width;
        player.vx = 0;
      }
    }
  }

  player.y += player.vy * delta;
  player.isGrounded = false;

  // Vertical Collisions
  for (const plat of level.platforms) {
    const xOverlap =
      player.x + player.width > plat.x &&
      player.x < plat.x + plat.width;

    if (!xOverlap) continue;

    if (plat.type === 'solid') {
      if (player.vy < 0) {
        if (
          player.y < plat.y + plat.height &&
          prevY >= plat.y + plat.height - 10
        ) {
          player.y = plat.y + plat.height;
          player.vy = 0;
        }
      } else if (player.vy >= 0) {
        if (
          player.y + player.height >= plat.y &&
          prevY + player.height <= plat.y + 20
        ) {
          player.y = plat.y - player.height;
          player.vy = 0;
          player.isGrounded = true;
          if (!wasGrounded) {
            landed = true;
            player.isLanding = true;
            player.landingTimer = 0.08;
            soundEngine.playLand();
          }
        }
      }
    } else if (plat.type === 'one-way') {
      if (player.vy >= 0) {
        const feetPrev = prevY + player.height;
        const feetNow = player.y + player.height;

        if (feetPrev <= plat.y + 12 && feetNow >= plat.y) {
          player.y = plat.y - player.height;
          player.vy = 0;
          player.isGrounded = true;
          if (!wasGrounded) {
            landed = true;
            player.isLanding = true;
            player.landingTimer = 0.08;
            soundEngine.playLand();
          }
        }
      }
    }
  }

  // World bounds clamping
  if (player.x < 10) {
    player.x = 10;
    player.vx = 0;
  } else if (player.x + player.width > level.width - 10) {
    player.x = level.width - 10 - player.width;
    player.vx = 0;
  }

  // Fall-off check (bottom void)
  if (player.y > level.height + 40) {
    player.x = level.spawnPoint.x;
    player.y = level.spawnPoint.y;
    player.vx = 0;
    player.vy = 0;
    fallenOff = true;
    soundEngine.playBack();
  }

  // 6. Update Projectiles & Destructible Interactions
  for (let i = projectiles.length - 1; i >= 0; i--) {
    const proj = projectiles[i];
    proj.life += delta;
    proj.x += proj.vx * delta;

    // Check hit against destructibles
    let hitObject = false;
    for (const dest of level.destructibles) {
      if (dest.isDestroyed) continue;

      if (
        proj.x < dest.x + dest.width &&
        proj.x + proj.width > dest.x &&
        proj.y < dest.y + dest.height &&
        proj.y + proj.height > dest.y
      ) {
        // Hit!
        hitObject = true;
        const damage = proj.isEmpowered ? 60 : 30;
        dest.hp -= damage;

        if (onImpact) {
          onImpact(dest.x + dest.width / 2, dest.y + dest.height / 2, proj.isEmpowered);
        }

        soundEngine.playStoneShatter();
        camera.shakeTimer = 0.28;
        camera.shakeIntensity = proj.isEmpowered ? 16 : 8;

        if (dest.hp <= 0) {
          dest.isDestroyed = true;
        }
        break;
      }
    }

    if (hitObject || proj.life >= proj.maxLife) {
      projectiles.splice(i, 1);
    }
  }

  // 7. Animation State
  player.isFalling = !player.isGrounded && player.vy > 60;
  player.isJumping = !player.isGrounded && player.vy <= 60;

  if (player.isGrounded && Math.abs(player.vx) > 15) {
    const frameDuration = player.isRunning ? RUN_FRAME_DURATION : WALK_FRAME_DURATION;
    player.animTimer += delta;
    if (player.animTimer >= frameDuration) {
      player.animTimer -= frameDuration;
      player.currentFrame = (player.currentFrame + 1) % 8;
    }

    player.footstepTimer += delta;
    const stepInterval = player.isRunning ? RUN_STEP_INTERVAL : WALK_STEP_INTERVAL;
    if (player.footstepTimer >= stepInterval) {
      player.footstepTimer = 0;
      soundEngine.playStep();
    }
  } else if (player.isGrounded) {
    player.currentFrame = 0;
    player.animTimer = 0;
    player.footstepTimer = 0;
  }

  // 8. Echo Proximity Check
  if (onEchoNear) {
    let isNearEcho = false;
    const playerCenterX = player.x + player.width / 2;
    const playerCenterY = player.y + player.height / 2;

    for (const echo of level.echoPoints) {
      if (echo.inherited) continue;
      const dx = playerCenterX - echo.x;
      const dy = playerCenterY - echo.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= echo.radius) {
        isNearEcho = true;
        break;
      }
    }
    onEchoNear(isNearEcho);
  }

  return { landed, fallenOff, abilityTriggered };
}
