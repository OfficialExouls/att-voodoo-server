import { numberToBinaryUInt, numberToBinary } from '../utils';

export type PrefabObjectProperties = {
  hash: number;
  position?: {
    x: number;
    y: number;
    z: number;
  };
  rotation?: {
    x: number;
    y: number;
    z: number;
    w: number;
  };
  scale?: number;
};

export const encodePrefabObject = ({
  hash,
  position = { x: 0, y: 0, z: 0 },
  rotation = { x: 0, y: 0, z: 0, w: 1 },
  scale = 1
}: PrefabObjectProperties): string => {
  const hashBits = numberToBinary(hash).padStart(32, '0');

  const positionBits = [
    numberToBinaryUInt(position.x),
    numberToBinaryUInt(position.y),
    numberToBinaryUInt(position.z)
  ].join('');

  const rotationBits = [
    numberToBinaryUInt(rotation.x),
    numberToBinaryUInt(rotation.y),
    numberToBinaryUInt(rotation.z),
    numberToBinaryUInt(rotation.w)
  ].join('');

  const scaleBits = numberToBinaryUInt(scale);

  return [hashBits, positionBits, rotationBits, scaleBits].join('');
};
