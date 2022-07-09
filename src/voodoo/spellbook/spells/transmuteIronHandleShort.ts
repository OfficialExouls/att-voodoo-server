import { SpellFunction } from '../spellbook';
// import { getSpellAttributes } from '../experience';
import { EvokeAngle, EvokeHandedness, spawnFrom } from '../spawnFrom';
import { Prefab } from 'att-string-transcoder';
import { spawn } from '../spawn';

export const transmuteIronHandleShort: SpellFunction = async (voodoo, accountId, upgradeConfigs) => {
  // const upgrades = voodoo.getSpellUpgrades({ accountId, spell: 'transmuteIronHandleShort' });
  // const attributes = getSpellAttributes(upgrades, upgradeConfigs);

  const player = await voodoo.getPlayerDetailed({ accountId });
  const dexterity = voodoo.players[accountId].dexterity.split('/') as [EvokeHandedness, EvokeAngle];
  const { position, rotation } = spawnFrom(player, 'mainHand', [dexterity[0], 'palm'], 0.05);

  spawn(voodoo, accountId, {
    prefabObject: {
      hash: Prefab.Handle_Short_Cool.hash,
      position,
      rotation
    },
    components: {
      NetworkRigidbody: {
        position,
        rotation
      }
    }
  });

  const { name, serverId, serverName } = voodoo.players[accountId];
  console.log(`[${serverName ?? serverId} | ${name}] cast Transmute Iron Handle (short)`);
};
