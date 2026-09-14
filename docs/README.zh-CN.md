# 文档网站

[English](README.md) | 简体中文

这里是 Chess Coach 的双语静态使用手册，托管于 GitHub Pages：[英文（默认）](https://jovijovi.github.io/chess-coach/) 和 [简体中文](https://jovijovi.github.io/chess-coach/zh-CN/)。文档网站公开访问，源代码仓库保持私有。

## 构建与预览

在仓库根目录使用 Node.js 26+，并安装锁定的依赖后运行：

```bash
npm run docs:build
npm run docs:preview
```

构建输出到 `output/docs/`。英文预览地址为 `http://127.0.0.1:4174/`，简体中文为 `http://127.0.0.1:4174/zh-CN/`。服务只监听回环地址；4174 端口被占用时会报错，不会自动换端口。按 Ctrl+C 停止。文档构建独立于棋局运行服务、数据库和引擎资源。

预览命令在启动时构建一次。编辑源文件后，运行 `npm run docs:build` 并刷新；不提供源文件监听。禁用 JavaScript 时仍可阅读静态正文，搜索、复制、移动端弹窗和章节跟随则由 JavaScript 增强。

## 维护手册

- `locales/en.mjs` 和 `locales/zh-CN.mjs`：相互对应的正文、导航和界面译文。章节 ID 与结构应一致，构建会检查这两项。
- `template.mjs`：共用的语义化 HTML，转义文本，并支持反引号包围的行内代码。
- `style.css`：字体、布局、响应式、减少动态效果偏好和打印样式。使用系统字体，不请求外部字体。
- `client.js`：本地搜索、剪贴板、弹窗、语言链接和当前章节。不会调用棋局 API 或外部服务。
- `../scripts/build-docs.mjs`：生成两种语言页面，复制定稿标志和法律文本。版本信息来自根目录的 `package.json`。

修改站点行为时，同步更新两种语言内容和根目录的双语 README。注释与实现说明使用英文。不要编辑生成的 `output/docs/` 文件，也不要提交预览截图。

代码变更运行 `npm run check`。站点变更还应检查中英文的桌面和手机布局，验证搜索（包括 `/`、Ctrl/Cmd+K、Escape 和空结果）、复制、导航和移动端菜单。同时检查根路径 `/` 和 `/chess-coach/` 等子路径下的构建产物。

## 发布到 GitHub Pages

构建产物包含两个 HTML 入口、本地资源和 `.nojekyll`。内部链接均为相对路径，因此同一份产物可以放在仓库子路径下。部署产物是 **`output/docs/` 中的内容**，而非源文件目录 `docs/`。

[Pages 工作流](../.github/workflows/pages.yml) 在相关文档、构建、版本、Logo、法律文本或工作流文件推送到 `main` 后运行。也可从仓库的 Actions 页面手动启动，部署仅允许使用 `main` 分支。

构建使用 Node.js 26。生成器只使用 Node.js 内置模块和本地文件，因此无需安装依赖。官方 Actions 固定到具体提交；构建任务上传 `output/docs/`，独立部署任务使用 Pages 与 OIDC 权限，通过 `github-pages` 环境完成发布。本地预览命令不会触发部署。

源代码仓库应保持私有，发布后的静态手册可以公开访问。官方部署机制见 [GitHub Pages 自定义工作流指南](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)。

## 插件发行内容

区分私有 RC 与未来稳定版的安装命令。手册的两种语言都应说明原生 marketplace
安装、手动升级、personal 迁移、保留数据的卸载和不可变引用回退。
插件发行独立于 Pages：带注释的标签准备 Draft，手动发布才更新渠道。
详见[发行指南](../release/README.zh-CN.md)。即使公开文档介绍了这些命令，
仓库是否公开仍须由所有者单独决定。
