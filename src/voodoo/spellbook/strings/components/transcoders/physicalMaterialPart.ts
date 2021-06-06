import { ComponentHash } from '../../ComponentHash';
import { MaterialHash } from '../../MaterialHash';
import { BinaryReader, createBinaryWriter } from '../../utils';

export const HASH = ComponentHash.PhysicalMaterialPart;
export const VERSION = 1;

export type Component = {
  materialHash?: number;
};

export const decode = (reader: BinaryReader): Component => ({
  materialHash: reader.uInt()
});

export const encode = ({ materialHash = MaterialHash.Iron }: Component): string => {
  const writer = createBinaryWriter();

  /* Component hash. */
  writer.uInt(ComponentHash.PhysicalMaterialPart);
  const hashBits = writer.flush();

  /* Component data. */
  writer.uInt(materialHash);
  const dataBits = writer.flush();

  /* Component data length. */
  writer.uInt(dataBits.length);
  const sizeBits = writer.flush();

  /* Return encoded component. */
  writer.binary(hashBits);
  writer.binary(sizeBits);
  writer.binary(dataBits);

  return writer.flush();
};
