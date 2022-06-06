import { SpellFunction } from '../spellbook';
// import { getSpellAttributes } from '../experience';
import { spawnFrom } from '../spawnFrom';
import { Prefab } from 'att-string-transcoder';
import { spawn } from '../spawn';

export const liquateViridium: SpellFunction = async (voodoo, accountId, upgradeConfigs) => {
  // const upgrades = voodoo.getSpellUpgrades({ accountId, spell: 'liquateViridium' });
  // const attributes = getSpellAttributes(upgrades, upgradeConfigs);

  const player = await voodoo.getPlayerDetailed({ accountId });

  const leftHand = spawnFrom(player, 'leftPalm', 0.05);
  const rightHand = spawnFrom(player, 'rightPalm', 0.05);

  spawn(voodoo, accountId, {
    prefabObject: {
      hash: Prefab.Gold_Ingot.hash,
      position: leftHand.position,
      rotation: leftHand.rotation
    },
    components: {
      NetworkRigidbody: {
        position: leftHand.position,
        rotation: leftHand.rotation
      }
    }
  });

  spawn(voodoo, accountId, {
    prefabObject: {
      hash: Prefab.Mythril_Ingot.hash,
      position: rightHand.position,
      rotation: rightHand.rotation
    },
    components: {
      NetworkRigidbody: {
        position: rightHand.position,
        rotation: rightHand.rotation
      }
    }
  });

  const { name, serverId, serverName } = voodoo.players[accountId];
  console.log(`[${serverName ?? serverId} | ${name}] cast Liquate Alloy (Viridium)`);
};
