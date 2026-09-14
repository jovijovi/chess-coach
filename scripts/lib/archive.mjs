import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { gzipSync } from "node:zlib";

export async function listFiles(root, prefix = "") {
  const files = [];
  for (const e of await readdir(join(root, prefix), { withFileTypes: true })) {
    const name = prefix ? `${prefix}/${e.name}` : e.name;
    if (e.isDirectory()) files.push(...(await listFiles(root, name)));
    else if (e.isFile()) files.push(name);
    else throw new Error(`Unsupported package entry: ${name}`);
  }
  return files.sort();
}

/** Deterministic POSIX ustar archive; no platform tar executable is required. */
export async function archive(root) {
  const chunks = [];
  for (const name of await listFiles(root)) {
    const data = await readFile(join(root, name));
    const header = Buffer.alloc(512);
    let leaf = name,
      prefix = "";
    if (Buffer.byteLength(name) > 100) {
      const at = name.lastIndexOf("/");
      prefix = name.slice(0, at);
      leaf = name.slice(at + 1);
    }
    if (Buffer.byteLength(leaf) > 100 || Buffer.byteLength(prefix) > 155)
      throw new Error(`Archive path too long: ${name}`);
    header.write(leaf, 0, 100);
    const octal = (value, at, width) =>
      header.write(
        value.toString(8).padStart(width - 1, "0") + "\0",
        at,
        width,
      );
    octal(0o644, 100, 8);
    octal(0, 108, 8);
    octal(0, 116, 8);
    octal(data.length, 124, 12);
    octal(0, 136, 12);
    header.fill(32, 148, 156);
    header[156] = 48;
    header.write("ustar\0", 257);
    header.write("00", 263);
    header.write(prefix, 345, 155);
    const sum = header.reduce((a, b) => a + b, 0);
    header.write(sum.toString(8).padStart(6, "0") + "\0 ", 148, 8);
    chunks.push(header, data, Buffer.alloc((512 - (data.length % 512)) % 512));
  }
  chunks.push(Buffer.alloc(1024));
  return gzipSync(Buffer.concat(chunks), { level: 9 });
}
