const escape = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character],
  );

const inline = (value) =>
  escape(value).replace(/`([^`]+)`/g, "<code>$1</code>");
const arrow = '<span aria-hidden="true">↗</span>';
const icon = (name) => {
  const paths = {
    search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    copy: '<rect x="8" y="8" width="12" height="13" rx="2"/><path d="M15 8V3H3v13h5"/>',
  };
  return `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]}</svg>`;
};

function codeBlock(code, title, ui) {
  return `<div class="code-block"><div class="code-header"><span>${escape(title || ui.code)}</span><button type="button" class="copy-button js-only" data-copy-block>${icon("copy")}<span>${escape(ui.copy)}</span></button></div><pre tabindex="0"><code>${escape(code)}</code></pre></div>`;
}

function prompt(text, ui) {
  return `<div class="prompt"><span class="prompt-mark" aria-hidden="true">“</span><p>${escape(text)}</p><button type="button" class="icon-button js-only" data-copy-text="${escape(text)}" aria-label="${escape(ui.copyPrompt)}" title="${escape(ui.copyPrompt)}">${icon("copy")}</button></div>`;
}

function block(content, ui) {
  switch (content.type) {
    case "paragraph":
      return `<p>${inline(content.text)}</p>`;
    case "callout":
      return `<aside class="callout"><span class="callout-mark" aria-hidden="true">✧</span><div><h3>${escape(content.title)}</h3><p>${inline(content.text)}</p></div></aside>`;
    case "steps":
      return `<ol class="steps">${content.items.map((step, index) => `<li><span class="step-number" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span><div class="step-content"><h3>${escape(step.title)}</h3><p>${inline(step.text)}</p>${step.code ? codeBlock(step.code, ui.code, ui) : prompt(step.prompt, ui)}<p class="aside-note">${inline(step.after)}</p></div></li>`).join("")}</ol>`;
    case "features":
      return `<div class="features">${content.items.map((item, index) => `<div><span class="feature-number" aria-hidden="true">${["I", "II", "III", "IV"][index]}</span><h3>${escape(item.title)}</h3><p>${inline(item.text)}</p></div>`).join("")}</div>`;
    case "table":
      return `<h3 class="subheading">${escape(content.title)}</h3><div class="table-scroll" role="region" aria-label="${escape(content.title)}" tabindex="0"><table><thead><tr>${content.headers.map((header) => `<th scope="col">${escape(header)}</th>`).join("")}</tr></thead><tbody>${content.rows.map((row) => `<tr>${row.map((cell, index) => `<td>${index === 0 && /^(npm |~\/)/.test(cell) ? `<code>${escape(cell)}</code>` : inline(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
    case "prompts":
      return `<div class="prompts">${content.items.map((item) => `<div><h3>${escape(item.title)}</h3>${prompt(item.prompt, ui)}</div>`).join("")}</div>`;
    case "tools":
      return `<div class="tools">${content.items.map((item) => `<details><summary><code>${escape(item.name)}</code><span>${escape(item.description)}</span><span class="expand" aria-hidden="true">+</span></summary><div class="details-content"><p>${inline(item.text)}</p><p class="tool-input">${escape(item.input)}</p></div></details>`).join("")}</div>`;
    case "code":
      return `${codeBlock(content.code, content.title, ui)}<p class="aside-note">${inline(content.text)}</p>`;
    case "faq":
      return `<div class="faq">${content.items.map((item) => `<details><summary><span>${escape(item.title)}</span><span class="expand" aria-hidden="true">+</span></summary><div class="details-content"><p>${inline(item.text)}</p></div></details>`).join("")}</div>`;
    default:
      throw new Error(`Unknown documentation block: ${content.type}`);
  }
}

export function renderPage(locale, version) {
  const { ui, hero, sections, lang } = locale;
  const prefix = lang === "en" ? "./" : "../";
  const chapters = [{ id: "introduction", label: ui.handbook }, ...sections];
  const languages = `<div class="languages" aria-label="${escape(ui.language)}"><a href="${prefix}" lang="en" hreflang="en" data-language ${lang === "en" ? 'aria-current="page"' : ""}>English</a><span aria-hidden="true">/</span><a href="${prefix}zh-CN/" lang="zh-CN" hreflang="zh-CN" data-language ${lang === "zh-CN" ? 'aria-current="page"' : ""}>简体中文</a></div>`;
  const brand = `<a class="brand" href="#introduction"><img src="${prefix}assets/logo.svg" alt="" width="52" height="52"><span>Chess Coach<small>${escape(ui.handbook)}</small></span></a>`;
  const navigation = `<nav aria-label="${escape(ui.navigation)}">${chapters.map((chapter, index) => `${index === 0 || index === 4 ? `<p class="nav-label">${escape(index === 0 ? ui.gettingStarted : ui.reference)}</p>` : ""}<a href="#${chapter.id}" data-chapter="${chapter.id}" ${index === 0 ? 'aria-current="location"' : ""}><span class="chapter-number">${String(index).padStart(2, "0")}</span><span>${escape(chapter.label)}</span></a>`).join("")}</nav>`;
  const sidebarBottom = `<div class="sidebar-bottom"><div class="ornament" aria-hidden="true"><span>◇</span></div>${languages}<p class="version"><span class="status-dot" aria-hidden="true"></span>v${escape(version)}<span>${escape(ui.system)}</span></p></div>`;
  return `<!doctype html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escape(locale.title)}</title>
  <meta name="description" content="${escape(locale.description)}">
  <meta name="theme-color" content="#163D37">
  <link rel="icon" type="image/svg+xml" href="${prefix}assets/logo.svg">
  <link rel="alternate" hreflang="en" href="${prefix}">
  <link rel="alternate" hreflang="zh-CN" href="${prefix}zh-CN/">
  <link rel="stylesheet" href="${prefix}assets/style.css">
  <script src="${prefix}assets/client.js" defer></script>
</head>
<body data-copy-label="${escape(ui.copy)}" data-copied-label="${escape(ui.copied)}" data-copy-failed="${escape(ui.copyFailed)}" data-search-empty="${escape(ui.searchEmpty)}" data-search-count="${escape(ui.searchCount)}">
  <a class="skip-link" href="#main">${escape(ui.skip)}</a>
  <aside class="sidebar">${brand}${navigation}${sidebarBottom}</aside>
  <div class="main-shell">
    <header class="topbar">
      <div class="breadcrumb"><img class="mobile-logo" src="${prefix}assets/logo.svg" width="30" height="30" alt=""><span>Chess Coach</span><span class="breadcrumb-divider" aria-hidden="true">/</span><span>${escape(ui.documentation)}</span></div>
      <div class="topbar-actions"><button type="button" class="search-trigger js-only" data-open-search aria-label="${escape(ui.search)}">${icon("search")}<span>${escape(ui.search)}</span><kbd>/</kbd></button><a class="repository-link" href="https://github.com/jovijovi/chess-coach" target="_blank" rel="noopener noreferrer">GitHub ${arrow}</a><button type="button" class="icon-button mobile-menu js-only" data-open-menu aria-label="${escape(ui.menu)}">${icon("menu")}</button></div>
    </header>
    <main id="main">
      <section id="introduction" class="introduction" data-section data-title="${escape(ui.handbook)}">
        <div class="hero">
          <div class="hero-copy"><p class="eyebrow"><span class="eyebrow-line" aria-hidden="true"></span>${escape(hero.eyebrow)}</p><h1>${escape(hero.title[0])}<em>${escape(hero.title[1])}</em></h1><p class="hero-lead">${escape(hero.lead)}</p><p class="hero-text">${escape(hero.text)}</p><div class="hero-actions"><a class="button-primary" href="#installation">${escape(hero.primary)}<span aria-hidden="true">→</span></a><a class="text-link" href="#tools">${escape(hero.secondary)}<span aria-hidden="true">↗</span></a></div></div>
          <div class="folio" aria-hidden="true"><div class="folio-corner top-left"></div><div class="folio-corner bottom-right"></div><div class="folio-inner"><p class="folio-overline">${escape(hero.sealTop)}</p><div class="mark-mat"><img src="${prefix}assets/logo.svg" width="194" height="194" alt=""></div><div class="folio-rule"><span>✦</span></div><p class="folio-name">Chess Coach</p><p class="folio-caption">${escape(hero.sealBottom)}</p></div></div>
        </div>
        <div class="pillars">${hero.pillars.map((pillar, index) => `<div><span class="pillar-number" aria-hidden="true">${["I", "II", "III"][index]}</span><h2>${escape(pillar.title)}</h2><p>${escape(pillar.text)}</p></div>`).join("")}</div>
      </section>
      ${sections.map((section, index) => `<section id="${section.id}" class="chapter" data-section data-title="${escape(section.label)}"><header class="chapter-heading"><p class="eyebrow"><span class="section-number">${String(index + 1).padStart(2, "0")}</span>${escape(section.kicker)}</p><h2>${escape(section.title)}</h2><p class="section-summary">${escape(section.summary)}</p></header><div class="chapter-body">${section.blocks.map((content) => block(content, ui)).join("")}</div><a class="chapter-top" href="#introduction">${escape(ui.top)} <span aria-hidden="true">↑</span></a></section>`).join("")}
      <footer class="footer"><div class="footer-mark"><img src="${prefix}assets/logo.svg" alt="${escape(ui.logoAlt)}" width="44" height="44"><p>${escape(ui.footer)}<small>Chess Coach · v${escape(version)}</small></p></div><div class="footer-links"><a href="${prefix}assets/LICENSE.txt">${escape(ui.license)}</a><a href="${prefix}assets/${lang === "en" ? "THIRD_PARTY_NOTICES.md" : "THIRD_PARTY_NOTICES.zh-CN.md"}">${escape(ui.thirdParty)}</a><a href="${prefix}assets/logo.svg" download="chess-coach.svg">${escape(ui.downloadLogo)}</a><a href="https://github.com/jovijovi/chess-coach" target="_blank" rel="noopener noreferrer">${escape(ui.source)} ↗</a></div><p class="footer-note">${escape(ui.sourceNote)}</p></footer>
    </main>
  </div>
  <dialog class="menu-dialog" aria-label="${escape(ui.contents)}"><div class="menu-heading">${brand}<button type="button" class="icon-button" data-close-menu aria-label="${escape(ui.close)}">${icon("close")}</button></div>${navigation}${sidebarBottom}</dialog>
  <dialog class="search-dialog" aria-labelledby="search-title"><div class="search-dialog-heading"><h2 id="search-title">${escape(ui.search)}</h2><button type="button" class="icon-button" data-close-search aria-label="${escape(ui.close)}">${icon("close")}</button></div><div class="search-input-wrap">${icon("search")}<input type="search" id="search-input" placeholder="${escape(ui.searchHint)}" aria-labelledby="search-title" autocomplete="off"></div><p class="search-count" role="status" aria-live="polite"></p><ul id="search-results" aria-label="${escape(ui.searchInitial)}"></ul><div class="search-hint"><span>${escape(ui.searchInitial)}</span><kbd>Esc</kbd></div></dialog>
  <div class="toast" role="status" aria-live="polite"></div>
</body>
</html>`;
}
