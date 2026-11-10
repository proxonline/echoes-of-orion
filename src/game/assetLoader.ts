import { CharacterId } from '../types/game';

class AssetLoader {
  private images: Map<string, HTMLImageElement> = new Map();
  private loaded = false;
  private loadPromise: Promise<void> | null = null;

  public async preloadAll(): Promise<void> {
    if (this.loaded) return;
    if (this.loadPromise) return this.loadPromise;

    const assetList: { key: string; src: string }[] = [];

    // 1. Character frames for Kiyoji & Hanetsu
    const characters: CharacterId[] = ['kiyoji', 'hanetsu'];
    for (const char of characters) {
      assetList.push({
        key: `${char}_idle`,
        src: `/assets/game/characters/${char}/idle.png`,
      });
      assetList.push({
        key: `${char}_jump`,
        src: `/assets/game/characters/${char}/jump.png`,
      });
      assetList.push({
        key: `${char}_fall`,
        src: `/assets/game/characters/${char}/fall.png`,
      });

      for (let i = 0; i < 8; i++) {
        assetList.push({
          key: `${char}_walk_${i}`,
          src: `/assets/game/characters/${char}/walk_${i}.png`,
        });
      }
    }

    // 2. High-Fidelity Backdrop & Environment Assets
    assetList.push({
      key: 'moonlit_sky_backdrop',
      src: '/assets/game/environment/moonlit_sky_backdrop.jpg',
    });

    const envAssets = [
      'grand_shrine_pagoda',
      'watchtower_ruin',
      'floating_shrine_island',
      'high_dead_tree_island',
      'platform_stone_small',
      'platform_stone_narrow',
      'platform_stone_medium',
      'platform_stone_steps',
      'platform_floating_large',
      'platform_stone_wide_a',
      'platform_stone_wide_b',
      'platform_bridge_stairs',
      'platform_floating_cliff',
      'platform_crag_island',
      'platform_echo_altar',
      'torii_gate_red',
      'torii_gate_weathered',
      'torii_gate_stone',
      'shrine_awning_roof',
      'wooden_temple_doors',
      'sliding_wooden_door',
      'lantern_post_timber',
      'scaffolding_timber_gate',
      'shrine_buddha_cliff',
      'tree_autumn_maple',
      'stone_tomb_marker',
      'shrine_sanctuary_hut',
      'stone_buddha_head',
      'stone_lantern_lit',
      'standing_stone_pillar',
      'stone_lantern_toro',
      'stone_brazier_blue_fire',
      'weapons_spears_rack',
      'wooden_crates',
      'wagon_wheel_debris',
      'wooden_lattice_fence',
      'rubble_debris_pile',
      'mini_stone_lanterns',
      'wooden_picket_fence',
    ];

    for (const asset of envAssets) {
      assetList.push({
        key: asset,
        src: `/assets/game/environment/${asset}.png`,
      });
    }

    // 3. Combat VFX & Effects
    assetList.push({
      key: 'echo_blade_slash',
      src: '/assets/game/effects/echo_blade_slash.jpg',
    });
    assetList.push({
      key: 'echo_impact_burst',
      src: '/assets/game/effects/echo_impact_burst.jpg',
    });
    assetList.push({
      key: 'echo_power_skill_icon',
      src: '/assets/game/effects/echo_power_skill_icon.jpg',
    });

    const effectAssets = [
      'spectral_blue_orb',
      'spectral_wisps',
      'falling_red_leaves',
      'ground_smoke_mist',
    ];
    for (const eff of effectAssets) {
      assetList.push({
        key: eff,
        src: `/assets/game/effects/${eff}.png`,
      });
    }

    // Spectral flame frames 0-7
    for (let i = 0; i < 8; i++) {
      assetList.push({
        key: `spectral_flame_${i}`,
        src: `/assets/game/effects/spectral_flame_${i}.png`,
      });
    }

    this.loadPromise = new Promise<void>((resolve) => {
      let remaining = assetList.length;
      if (remaining === 0) {
        this.loaded = true;
        resolve();
        return;
      }

      for (const item of assetList) {
        const img = new Image();
        img.src = item.src;
        img.onload = () => {
          this.images.set(item.key, img);
          remaining--;
          if (remaining <= 0) {
            this.loaded = true;
            resolve();
          }
        };
        img.onerror = () => {
          console.warn(`[AssetLoader] Failed to load ${item.src}`);
          remaining--;
          if (remaining <= 0) {
            this.loaded = true;
            resolve();
          }
        };
      }
    });

    return this.loadPromise;
  }

  public getImage(key: string): HTMLImageElement | undefined {
    return this.images.get(key);
  }

  public isLoaded(): boolean {
    return this.loaded;
  }
}

export const assetLoader = new AssetLoader();
