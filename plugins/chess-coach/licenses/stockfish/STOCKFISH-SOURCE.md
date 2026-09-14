# Stockfish corresponding source

Chess Coach distributes the unmodified `stockfish-18-lite-single.js` and `.wasm`
from the locked npm package **stockfish 18.0.8**. Stockfish is licensed separately
under GPL-3.0; see `dist/engine/COPYING`. The application's Apache-2.0 license does
not replace this license.

Every plugin package includes `licenses/stockfish/stockfish-source.tar.gz`, the
exact upstream commit recorded in `sources.json`, and `nn-9067e33176e8.nnue`.
The source archive includes the C++ source, JavaScript wrappers, Makefiles,
build scripts, and the upstream build-script dependencies. It has no Git
submodules. The network is verified byte for byte against reconstructed WASM
memory during packaging; all source and binary hashes are pinned.

To build the same engine flavor:

1. Extract the source archive and copy the included `.nnue` into its `src/` folder.
2. Install the upstream-required Emscripten SDK **3.1.7** and activate its environment.
   See <https://emscripten.org/docs/getting_started/downloads.html>.
3. Provide Node.js, Make, Python and Java as required by that Emscripten toolchain.
4. From the extracted source directory run:

   ```sh
   node build.js --lite --single-threaded --no-split --strict-em-check -f
   ```

Those development tools are required only to rebuild Stockfish, not to install
or run Chess Coach. The shipped binaries come from the pinned upstream npm
artifact; this project does not claim a bit-for-bit reproducible upstream build.
Complete build instructions are also in the included upstream README and
`node build.js --help`. Package creation fails if any required source material,
binary, network, or dependency license is absent or fails its checksum.
