export const CANVAS_VIRTUAL_WIDTH = 1920;
export const CANVAS_VIRTUAL_HEIGHT = 1080;

// Physics parameters
export const GRAVITY = 1800; // px/s²
export const WALK_SPEED = 300; // px/s
export const RUN_SPEED = 480; // px/s
export const JUMP_VELOCITY = -770; // px/s
export const AIR_ACCEL = 1450; // px/s²
export const GROUND_ACCEL = 2900; // px/s²
export const GROUND_FRICTION = 2400; // px/s²
export const MAX_FALL_SPEED = 960; // px/s
export const COYOTE_TIME = 0.14; // 140ms
export const JUMP_BUFFER_TIME = 0.14; // 140ms
export const JUMP_CUT_MULTIPLIER = 0.45;

// Player bounding box
export const PLAYER_BOX_WIDTH = 44;
export const PLAYER_BOX_HEIGHT = 96;

// Character sprite rendering
export const SPRITE_ORIGINAL_WIDTH = 180;
export const SPRITE_ORIGINAL_HEIGHT = 320;
export const SPRITE_DRAW_SCALE = 0.44;
export const SPRITE_DRAW_WIDTH = Math.round(SPRITE_ORIGINAL_WIDTH * SPRITE_DRAW_SCALE);
export const SPRITE_DRAW_HEIGHT = Math.round(SPRITE_ORIGINAL_HEIGHT * SPRITE_DRAW_SCALE);
export const SPRITE_OFFSET_X = -Math.round((SPRITE_DRAW_WIDTH - PLAYER_BOX_WIDTH) / 2);
export const SPRITE_OFFSET_Y = -Math.round(SPRITE_DRAW_HEIGHT - PLAYER_BOX_HEIGHT + 3);

// Animation speeds
export const WALK_FRAME_DURATION = 0.09;
export const RUN_FRAME_DURATION = 0.06;

// Sound step intervals
export const WALK_STEP_INTERVAL = 0.36;
export const RUN_STEP_INTERVAL = 0.22;

// Combat & Ability constants
export const ABILITY_COOLDOWN_TIME = 1.2; // seconds between power releases
export const PROJECTILE_SPEED = 920; // px/s
export const PROJECTILE_WIDTH = 140;
export const PROJECTILE_HEIGHT = 80;
export const PROJECTILE_MAX_LIFE = 1.1; // seconds
export const SCREEN_SHAKE_DECAY = 8.0;
