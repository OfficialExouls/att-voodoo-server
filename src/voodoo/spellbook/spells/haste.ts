import { SpellFunction } from '../spellbook';
import { getSpellAttributes } from '../experience';
import { spawnFrom } from '../spawnFrom';
import { PrefabHash } from 'att-string-transcoder';
import { spawn } from '../spawn';
import { getNearbySoulbonds } from '../getNearbySoulbonds';

export const haste: SpellFunction = async (voodoo, accountId, upgradeConfigs) => {
  const upgrades = voodoo.getSpellUpgrades({ accountId, spell: 'haste' });
  const attributes = getSpellAttributes(upgrades, upgradeConfigs);

  const player = await voodoo.getPlayerDetailed({ accountId });
  const { position, rotation } = spawnFrom(player, 'rightPalm', 0.05);

  spawn(voodoo, accountId, {
    prefabObject: {
      hash: PrefabHash.Potion_Medium,
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

  const value = 1 + attributes.intensify / 100;
  const duration = attributes.concentration;
  const searchRadius = attributes.projection;

  let nearbySoulbondIds: number[] = [];

  if (searchRadius > 0) {
    const nearbySoulbonds = await getNearbySoulbonds(voodoo, accountId, searchRadius);
    nearbySoulbondIds = nearbySoulbonds.map(soulbond => soulbond.id);
  }

  const playerList = [accountId, ...nearbySoulbondIds].join(',');

  voodoo.command({
    accountId,
    command: `player modify-stat ${playerList} speed ${value} ${duration} true`
  });

  const { name, serverId, serverName } = voodoo.players[accountId];
  voodoo.logger.success(`[${serverName ?? serverId} | ${name}] cast Haste`);
};
