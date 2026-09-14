const page = document.body;
const searchDialog = document.querySelector(".search-dialog");
const menuDialog = document.querySelector(".menu-dialog");
const searchInput = document.querySelector("#search-input");
const results = document.querySelector("#search-results");
const resultCount = document.querySelector(".search-count");
const sections = [...document.querySelectorAll("[data-section]")];
const chapters = sections.map((section) => ({
  id: section.id,
  title: section.dataset.title,
  text: [...section.querySelectorAll("h1, h2, h3, p, pre, summary, th, td")]
    .map((element) => element.textContent.trim())
    .join(" ")
    .replace(/\s+/g, " "),
}));
const toast = document.querySelector(".toast");
let toastTimer;
let menuChapter = "#introduction";

function announce(text) {
  clearTimeout(toastTimer);
  toast.textContent = text;
  toast.classList.add("visible");
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 2800);
}

async function copy(text) {
  try {
    await navigator.clipboard.writeText(text);
    return;
  } catch {
    const active = document.activeElement;
    const field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.left = "-9999px";
    document.body.append(field);
    field.select();
    const copied = document.execCommand("copy");
    field.remove();
    active?.focus();
    if (!copied) throw new Error("Clipboard copy failed.");
  }
}

for (const button of document.querySelectorAll(
  "[data-copy-block], [data-copy-text]",
)) {
  button.addEventListener("click", async () => {
    const text =
      button.dataset.copyText ??
      button.closest(".code-block").querySelector("code").textContent;
    button.disabled = true;
    try {
      await copy(text);
      announce(page.dataset.copiedLabel);
    } catch {
      announce(page.dataset.copyFailed);
      const target =
        button.closest(".code-block")?.querySelector("code") ??
        button.closest(".prompt")?.querySelector("p");
      if (target) {
        const range = document.createRange();
        range.selectNodeContents(target);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
      }
    } finally {
      button.disabled = false;
    }
  });
}

function renderResults() {
  const query = searchInput.value.trim().toLocaleLowerCase();
  const words = query.split(/\s+/).filter(Boolean);
  const matches = chapters.filter((chapter) =>
    words.every((word) =>
      `${chapter.title} ${chapter.text}`.toLocaleLowerCase().includes(word),
    ),
  );
  results.replaceChildren();
  resultCount.textContent = `${matches.length} ${page.dataset.searchCount}`;
  for (const chapter of matches) {
    const item = document.createElement("li");
    const link = document.createElement("a");
    link.href = `#${chapter.id}`;
    const title = document.createElement("strong");
    title.textContent = chapter.title;
    const excerpt = document.createElement("span");
    const match = query
      ? chapter.text.toLocaleLowerCase().indexOf(words[0])
      : 0;
    const start = Math.max(0, match - 35);
    excerpt.textContent = `${start ? "…" : ""}${chapter.text.slice(start, start + 140)}${chapter.text.length > start + 140 ? "…" : ""}`;
    link.append(title, excerpt);
    link.addEventListener("click", () => {
      searchDialog.close();
      const section = document.getElementById(chapter.id);
      if (query) {
        for (const details of section.querySelectorAll("details")) {
          if (
            words.every((word) =>
              details.textContent.toLocaleLowerCase().includes(word),
            )
          )
            details.open = true;
        }
      }
      requestAnimationFrame(() => {
        section.setAttribute("tabindex", "-1");
        section.focus({ preventScroll: true });
        section.scrollIntoView();
      });
    });
    item.append(link);
    results.append(item);
  }
  if (!matches.length) {
    const empty = document.createElement("li");
    empty.className = "search-empty";
    empty.textContent = page.dataset.searchEmpty;
    results.append(empty);
  }
}

function openSearch() {
  if (menuDialog.open) menuDialog.close();
  renderResults();
  if (!searchDialog.open) searchDialog.showModal();
  searchInput.focus();
  searchInput.select();
}

for (const button of document.querySelectorAll("[data-open-search]"))
  button.addEventListener("click", openSearch);
searchInput.addEventListener("input", renderResults);
document
  .querySelector("[data-close-search]")
  .addEventListener("click", () => searchDialog.close());
document.querySelector("[data-open-menu]").addEventListener("click", () => {
  updateChapter();
  menuChapter = document.querySelector(
    '[data-chapter][aria-current="location"]',
  ).hash;
  menuDialog.showModal();
});
document
  .querySelector("[data-close-menu]")
  .addEventListener("click", () => menuDialog.close());
for (const link of menuDialog.querySelectorAll("a"))
  if (!link.hasAttribute("data-language"))
    link.addEventListener("click", () => menuDialog.close());
for (const dialog of [menuDialog, searchDialog]) {
  dialog.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      dialog.close();
    }
  });
  dialog.addEventListener("click", (event) => {
    const bounds = dialog.getBoundingClientRect();
    if (
      event.target === dialog &&
      (event.clientX < bounds.left ||
        event.clientX > bounds.right ||
        event.clientY < bounds.top ||
        event.clientY > bounds.bottom)
    )
      dialog.close();
  });
}

document.addEventListener("keydown", (event) => {
  const typing = event.target.closest(
    "input, textarea, select, [contenteditable]",
  );
  if (
    ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") ||
    (event.key === "/" &&
      !typing &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.altKey)
  ) {
    event.preventDefault();
    openSearch();
  }
});
searchDialog.addEventListener("keydown", (event) => {
  const links = [...results.querySelectorAll("a")];
  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    event.preventDefault();
    if (!links.length) return;
    const current = links.indexOf(document.activeElement);
    const index =
      event.key === "ArrowDown"
        ? (current + 1) % links.length
        : current < 0
          ? links.length - 1
          : (current - 1 + links.length) % links.length;
    links[index].focus();
  } else if (
    event.key === "Enter" &&
    document.activeElement === searchInput &&
    links.length
  ) {
    event.preventDefault();
    links[0].click();
  }
});

for (const link of document.querySelectorAll("[data-language]")) {
  link.addEventListener("click", () => {
    if (menuDialog.open) {
      link.hash = menuChapter;
      menuDialog.close();
    } else {
      updateChapter();
      link.hash = document.querySelector(
        '[data-chapter][aria-current="location"]',
      ).hash;
    }
  });
}

let scrollQueued = false;
function updateChapter() {
  if (menuDialog.open || searchDialog.open) {
    scrollQueued = false;
    return;
  }
  const current =
    [...sections]
      .reverse()
      .find((section) => section.getBoundingClientRect().top <= 155) ??
    sections[0];
  for (const link of document.querySelectorAll("[data-chapter]")) {
    if (link.dataset.chapter === current.id)
      link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  }
  scrollQueued = false;
}
window.addEventListener(
  "scroll",
  () => {
    if (!scrollQueued) {
      scrollQueued = true;
      requestAnimationFrame(updateChapter);
    }
  },
  { passive: true },
);
window.addEventListener("resize", () => {
  if (window.innerWidth > 960 && menuDialog.open) menuDialog.close();
  updateChapter();
});
updateChapter();
document.documentElement.classList.add("enhanced");
