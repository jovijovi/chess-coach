# Stockfish 对应源码

Chess Coach 分发锁定的 npm 包 **stockfish 18.0.8** 中未经修改的
`stockfish-18-lite-single.js` 与 `.wasm`。Stockfish 单独采用 GPL-3.0，
完整条款见 `dist/engine/COPYING`；应用的 Apache-2.0 不替代该许可证。

每份插件包都包含 `licenses/stockfish/stockfish-source.tar.gz`、
`sources.json` 记录的精确上游提交，以及 `nn-9067e33176e8.nnue`。
源码归档包含 C++ 源码、JavaScript 包装层、Makefile、构建脚本和上游
构建脚本依赖，不含 Git 子模块。打包时重建 WASM 内存，逐字节验证嵌入
的网络数据；源码和二进制文件均有固定哈希。

构建相同的引擎变体：

1. 解压源码，将随包 `.nnue` 文件放入源码的 `src/` 目录。
2. 按上游要求安装并激活 **Emscripten SDK 3.1.7**。
   参见 <https://emscripten.org/docs/getting_started/downloads.html>。
3. 准备该工具链需要的 Node.js、Make、Python 和 Java。
4. 在解压后的源码目录运行：

   ```sh
   node build.js --lite --single-threaded --no-split --strict-em-check -f
   ```

这些开发工具仅用于重新构建 Stockfish，安装和运行 Chess Coach 不需要。
随包二进制来自锁定的上游 npm 产物，本项目不宣称能够逐字节复现上游构建。
完整构建说明也在随包的上游 README 和 `node build.js --help` 中。
缺失源码材料、二进制、网络文件或依赖许可证，或校验不符时，打包会失败。
