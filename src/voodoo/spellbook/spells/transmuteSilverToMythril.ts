import { VoodooServer } from '../..';
import { PrefabHash } from '../strings';
import { spawn } from '../spawn';
import { spawnFrom } from '../spawnFrom';

export const transmuteSilverToMythril = async (voodoo: VoodooServer, accountId: number): Promise<void> => {
  const player = await voodoo.getPlayerDetailed({ accountId });

  const { position, rotation } = spawnFrom(player, 'rightPalm', 0.05);

  return spawn(voodoo, accountId, {
    prefabObject: {
      hash: PrefabHash.Mythril_Ingot,
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
};