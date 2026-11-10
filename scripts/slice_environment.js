import fs from 'fs';
import path from 'path';
import { PNG } from 'pngjs';

const envData = fs.readFileSync('public/assets/aistudio/7858cb36-8a7a-4005-96e3-13fbc5e04edd_eb4c9aa8.png');
const png = PNG.sync.read(envData);

const envDir = 'public/assets/game/environment';
const effectsDir = 'public/assets/game/effects';
fs.mkdirSync(envDir, { recursive: true });
fs.mkdirSync(effectsDir, { recursive: true });

// Function to extract a bounding box, tightly crop to non-transparent pixels, and save
function extractAsset(name, x1, y1, x2, y2, outDir = envDir, alphaThresh = 15) {
  // Clamp coordinates
  x1 = Math.max(0, Math.min(x1, png.width - 1));
  x2 = Math.max(0, Math.min(x2, png.width - 1));
  y1 = Math.max(0, Math.min(y1, png.height - 1));
  y2 = Math.max(0, Math.min(y2, png.height - 1));

  // Find tight bounds of non-transparent pixels
  let minX = x2, maxX = x1, minY = y2, maxY = y1;
  let hasPixels = false;

  for (let y = y1; y <= y2; y++) {
    for (let x = x1; x <= x2; x++) {
      const idx = (y * png.width + x) << 2;
      if (png.data[idx + 3] > alphaThresh) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
        hasPixels = true;
      }
    }
  }

  if (!hasPixels) {
    console.warn(`[SKIP] No pixels found for ${name} in (${x1},${y1}) to (${x2},${y2})`);
    return null;
  }

  const w = maxX - minX + 1;
  const h = maxY - minY + 1;

  const outPng = new PNG({ width: w, height: h });
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const srcIdx = ((minY + y) * png.width + (minX + x)) << 2;
      const dstIdx = (y * w + x) << 2;
      outPng.data[dstIdx] = png.data[srcIdx];
      outPng.data[dstIdx + 1] = png.data[srcIdx + 1];
      outPng.data[dstIdx + 2] = png.data[srcIdx + 2];
      outPng.data[dstIdx + 3] = png.data[srcIdx + 3];
    }
  }

  const outPath = path.join(outDir, `${name}.png`);
  fs.writeFileSync(outPath, PNG.sync.write(outPng));
  console.log(`Saved ${outPath}: ${w}x${h}`);
  return { name, w, h, outPath };
}

console.log('--- EXTRACTING ENVIRONMENT & PROPS ---');

// 1. Architecture & Background Landmarks
extractAsset('grand_shrine_pagoda', 270, 10, 1120, 365);
extractAsset('watchtower_ruin', 6, 10, 270, 365);
extractAsset('floating_shrine_island', 1080, 120, 1440, 370);
extractAsset('high_dead_tree_island', 1430, 45, 1665, 370);

// 2. Playable Platforms & Rocks
extractAsset('platform_stone_small', 5, 380, 135, 500);
extractAsset('platform_stone_narrow', 135, 380, 225, 495);
extractAsset('platform_stone_medium', 225, 380, 370, 480);
extractAsset('platform_stone_steps', 370, 380, 505, 480);
extractAsset('platform_floating_large', 505, 380, 690, 520);
extractAsset('platform_stone_wide_a', 690, 380, 785, 480);
extractAsset('platform_stone_wide_b', 785, 380, 875, 480);
extractAsset('platform_bridge_stairs', 875, 380, 995, 545);
extractAsset('platform_floating_cliff', 995, 450, 1150, 580);
extractAsset('platform_crag_island', 185, 500, 315, 645);
extractAsset('platform_echo_altar', 840, 690, 985, 875);

// 3. Torii Gates & Wooden Structures
extractAsset('torii_gate_red', 305, 510, 420, 685);
extractAsset('torii_gate_weathered', 420, 510, 515, 685);
extractAsset('torii_gate_stone', 520, 510, 610, 685);
extractAsset('shrine_awning_roof', 610, 525, 720, 585);
extractAsset('wooden_temple_doors', 725, 550, 775, 685);
extractAsset('sliding_wooden_door', 775, 570, 815, 685);
extractAsset('lantern_post_timber', 850, 555, 915, 685);
extractAsset('scaffolding_timber_gate', 5, 530, 100, 690);

// 4. Statues, Trees & Landmarks
extractAsset('shrine_buddha_cliff', 5, 670, 100, 870);
extractAsset('tree_autumn_maple', 85, 620, 220, 870);
extractAsset('stone_tomb_marker', 215, 750, 275, 870);
extractAsset('shrine_sanctuary_hut', 275, 680, 390, 870);
extractAsset('stone_buddha_head', 675, 690, 715, 800);
extractAsset('stone_lantern_lit', 645, 705, 675, 800);
extractAsset('standing_stone_pillar', 610, 705, 635, 800);
extractAsset('stone_lantern_toro', 915, 595, 945, 685);
extractAsset('stone_brazier_blue_fire', 945, 520, 995, 685);

// 5. Props, Obstacles & Debris
extractAsset('weapons_spears_rack', 390, 740, 425, 870);
extractAsset('wooden_crates', 485, 710, 520, 790);
extractAsset('wagon_wheel_debris', 425, 795, 535, 870);
extractAsset('wooden_lattice_fence', 715, 685, 815, 800);
extractAsset('rubble_debris_pile', 790, 810, 855, 870);
extractAsset('mini_stone_lanterns', 605, 800, 755, 870);
extractAsset('wooden_picket_fence', 685, 905, 755, 941);

// 6. Spectral Echo & Environmental Effects
extractAsset('spectral_blue_orb', 320, 885, 380, 941, effectsDir);
extractAsset('spectral_wisps', 120, 885, 320, 941, effectsDir);
extractAsset('falling_red_leaves', 545, 880, 605, 941, effectsDir);
extractAsset('ground_smoke_mist', 765, 885, 995, 941, effectsDir);

// 7. Individual Spectral Flame Frames for Echo Animation
for (let i = 0; i < 8; i++) {
  const fx1 = Math.round(5 + (i * 14.5));
  const fx2 = Math.round(fx1 + 16);
  extractAsset(`spectral_flame_${i}`, fx1, 890, fx2, 941, effectsDir);
}

console.log('--- EXTRACTION COMPLETE ---');
