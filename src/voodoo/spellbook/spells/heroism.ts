import { SpellFunction } from '../spellbook';
import { getSpellAttributes } from '../experience';
import { spawnFrom } from '../spawnFrom';
import { Prefab } from 'att-string-transcoder';
import { spawn } from '../spawn';
import { getNearbySoulbonds } from '../getNearbySoulbonds';

export const heroism: SpellFunction = async (voodoo, accountId, upgradeConfigs) => {
  const upgrades = voodoo.getSpellUpgrades({ accountId, spell: 'heroism' });
  const attributes = getSpellAttributes(upgrades, upgradeConfigs);

  const player = await voodoo.getPlayerDetailed({ accountId });
  const { position, rotation } = spawnFrom(player, 'rightPalm', 0.05);

  spawn(voodoo, accountId, {
    prefabObject: {
      hash: Prefab.Potion_Medium.hash,
      position,
      rotation
    },
    components: {
      NetworkRigidbody: {
        position,
        rotation
      },
      LiquidContainer: {}
    }
  });

  const multiplier = 1 + attributes.intensify / 100;
  const duration = attributes.concentration;
  const searchRadius = attributes.projection;

  let nearbySoulbondIds: number[] = [];

  if (searchRadius > 0) {
    const nearbySoulbonds = await getNearbySoulbonds(voodoo, accountId, searchRadius);
    nearbySoulbondIds = nearbySoulbonds.map(soulbond => soulbond.id);
  }

  const playerIds = [accountId, ...nearbySoulbondIds];

  for (const playerId of playerIds) {
    const [baseMaxHealth, currentHealth] = await Promise.all([
      voodoo.getPlayerCheckStatBase({ accountId: playerId, stat: 'maxhealth' }),
      voodoo.getPlayerCheckStatCurrent({ accountId: playerId, stat: 'health' })
    ]);

    let buffedMaxHealth = 0,
      healthDelta = 0;

    /* Raise max health. */
    if (baseMaxHealth) {
      buffedMaxHealth = baseMaxHealth * multiplier;
      healthDelta = buffedMaxHealth - baseMaxHealth;
    }

    if (buffedMaxHealth && healthDelta) {
      voodoo.command({
        accountId,
        command: `player modify-stat ${playerId} maxhealth ${healthDelta} ${duration} false`
      });

      voodoo.command({
        accountId,
        command: `player modify-stat ${playerId} health ${healthDelta} ${duration} false`
      });
    }
  }

  const { name, serverId, serverName } = voodoo.players[accountId];
  console.log(`[${serverName ?? serverId} | ${name}] cast Heroism`);
};
