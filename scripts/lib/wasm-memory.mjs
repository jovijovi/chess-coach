// Reconstruct active WASM data segments, including zero-filled gaps split by Binaryen.
export function embeddedNetworkOffset(wasm, network) {
  let cursor = 8;
  const uint = () => {
    let value = 0,
      shift = 0,
      byte;
    do {
      byte = wasm[cursor++];
      value += (byte & 127) * 2 ** shift;
      shift += 7;
      if (shift > 35) throw new Error("Invalid WASM integer");
    } while (byte & 128);
    return value;
  };
  const segments = [];
  while (cursor < wasm.length) {
    const id = wasm[cursor++],
      length = uint(),
      end = cursor + length;
    if (id !== 11) {
      cursor = end;
      continue;
    }
    const count = uint();
    for (let i = 0; i < count; i++) {
      const flags = uint();
      if (flags === 2) uint();
      if (flags !== 0 && flags !== 2)
        throw new Error("Unexpected passive Stockfish data segment");
      if (wasm[cursor++] !== 0x41)
        throw new Error("Unexpected Stockfish data offset");
      const offset = uint();
      if (wasm[cursor++] !== 0x0b)
        throw new Error("Invalid Stockfish data expression");
      const size = uint();
      segments.push({ offset, bytes: wasm.subarray(cursor, cursor + size) });
      cursor += size;
    }
    if (cursor !== end) throw new Error("Invalid Stockfish data section");
  }
  const size = Math.max(...segments.map((s) => s.offset + s.bytes.length));
  if (size > 64 * 1024 * 1024)
    throw new Error("Unexpected Stockfish memory size");
  const memory = Buffer.alloc(size);
  for (const { offset, bytes } of segments) bytes.copy(memory, offset);
  return memory.indexOf(network);
}
