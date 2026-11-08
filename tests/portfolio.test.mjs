import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { JSDOM } from "jsdom";
import { setupPortfolio } from "../src/scripts/portfolio.ts";
import { site } from "../src/data/site.ts";

const html = await readFile("dist/index.html", "utf8");

test("Home renders Markdown links as keyboard-accessible anchors", () => {
  const dom = new JSDOM(html);
  const home = dom.window.document.querySelector("#home");
  const text = [site.introduction, site.biography, site.philosophy].join("\n");
  for (const [, label, url] of text.matchAll(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g)) {
    const link = home.querySelector(`a[href="${url}"]`);
    assert.ok(link, `${label} must render as a link`);
    assert.equal(link.textContent, label);
    assert.equal(link.tabIndex, 0);
    assert.ok(!home.textContent.includes(`[${label}](`), "Raw Markdown link syntax must not appear in the intro");
  }
  assert.ok(home.querySelector(".home-philosophy > p"), "Markdown paragraphs must render inside a block container");
  dom.window.close();
});

function mount({ reduced = false, fine = true, saveData = false, observers = true, extraFilter = false, rejectPlay = false } = {}) {
  const dom = new JSDOM(html, { url: "https://martin.daigne.com/", pretendToBeVisual: true });
  const { window } = dom;
  const { document } = window;
  for (const [key, value] of Object.entries({ window, document, navigator: window.navigator })) {
    Object.defineProperty(globalThis, key, { configurable: true, value });
  }
  const motionListeners = [];
  const motion = { matches: reduced, addEventListener: (_, listener) => motionListeners.push(listener) };
  window.matchMedia = (query) => (query.includes("reduced-motion") ? motion : { matches: fine });
  Object.defineProperty(window.navigator, "connection", { value: { saveData } });
  const observed = [];
  class Observer {
    constructor(callback, options) {
      this.callback = callback;
      this.options = options;
      observed.push(this);
    }
    targets = [];
    observe(target) {
      this.targets.push(target);
    }
  }
  if (observers) {
    window.IntersectionObserver = Observer;
    globalThis.IntersectionObserver = Observer;
  }
  let scrollY = 0;
  Object.defineProperties(window, {
    innerHeight: { value: 800 },
    scrollY: { get: () => scrollY },
  });
  Object.defineProperty(document.documentElement, "scrollHeight", { value: 3000 });
  const tops = { home: 0, projects: 950, skills: 2300 };
  document.querySelectorAll("[data-section]").forEach((section) => {
    section.getBoundingClientRect = () => ({ top: tops[section.id] - scrollY });
  });
  window.requestAnimationFrame = (callback) => {
    callback(0);
    return 1;
  };
  const media = new WeakMap();
  const state = (element) => {
    if (!media.has(element)) media.set(element, { paused: true, plays: 0 });
    return media.get(element);
  };
  window.HTMLMediaElement.prototype.play = function () {
    state(this).plays++;
    if (rejectPlay) return Promise.reject(new Error("Autoplay unavailable"));
    state(this).paused = false;
    return Promise.resolve();
  };
  window.HTMLMediaElement.prototype.pause = function () {
    state(this).paused = true;
  };
  Object.defineProperties(window.HTMLMediaElement.prototype, {
    paused: {
      get() {
        return state(this).paused;
      },
    },
    readyState: {
      get() {
        return this.src ? 1 : 0;
      },
    },
  });
  const dialog = document.querySelector("dialog");
  // jsdom does not implement native dialogs. Exercise our event handling with
  // their open/close contract; native focus containment still needs browser QA.
  dialog.showModal = () => {
    dialog.open = true;
  };
  dialog.close = () => {
    dialog.open = false;
    dialog.dispatchEvent(new window.Event("close"));
  };
  if (extraFilter) {
    const button = document.createElement("button");
    button.dataset.filter = "unpopulated";
    button.textContent = "New category";
    document.querySelector(".project-filters").append(button);
  }
  setupPortfolio();
  return {
    dom,
    window,
    document,
    dialog,
    motion,
    observed,
    state,
    cards: [...document.querySelectorAll("[data-project]")],
    event: (element, type) => element.dispatchEvent(new window.Event(type, { bubbles: true })),
    setMotion(value) {
      motion.matches = value;
      motionListeners.forEach((listener) => listener());
    },
    scroll(value) {
      scrollY = value;
      window.dispatchEvent(new window.Event("scroll"));
    },
  };
}

test("every filter respects multiple category memberships and restores All", () => {
  const app = mount();
  for (const filter of app.document.querySelectorAll("[data-filter]")) {
    filter.click();
    for (const card of app.cards) {
      const expected = filter.dataset.filter === "all" || JSON.parse(card.dataset.categories).includes(filter.dataset.filter);
      assert.equal(!card.hidden, expected);
    }
    assert.equal(app.document.querySelectorAll('[aria-pressed="true"]').length, 1);
    assert.equal(filter.getAttribute("aria-pressed"), "true");
    assert.match(app.document.querySelector("#filter-status").textContent, /Showing/);
  }
  app.document.querySelector('[data-filter="all"]').click();
  assert.ok(app.cards.every((card) => !card.hidden));
  app.dom.window.close();
});

test("a new empty category works without component changes", () => {
  const app = mount({ extraFilter: true });
  app.document.querySelector('[data-filter="unpopulated"]').click();
  assert.ok(app.cards.every((card) => card.hidden));
  assert.equal(app.document.querySelector(".no-projects").hidden, false);
  app.document.querySelector('[data-filter="all"]').click();
  assert.equal(app.document.querySelector(".no-projects").hidden, true);
  app.dom.window.close();
});

test("every project opens the correct detail, with cleanup and focus restoration", () => {
  const app = mount();
  const content = app.document.querySelector("#project-dialog-content");
  for (const card of app.cards) {
    card.focus();
    card.click();
    assert.equal(app.dialog.open, true);
    assert.ok(app.document.body.classList.contains("modal-open"));
    assert.ok(card.getAttribute("aria-label").includes(content.querySelector("h2").textContent));
    assert.equal(app.document.activeElement, app.document.querySelector(".dialog-close"));
    assert.equal(app.dialog.querySelector(".dialog-scroll").scrollTop, 0);
    assert.ok([...content.querySelectorAll("h2, h3")].every((heading) => heading.textContent.trim()));
    app.document.querySelector(".dialog-close").click();
    assert.equal(app.dialog.open, false);
    assert.equal(app.document.body.classList.contains("modal-open"), false);
    assert.equal(app.document.activeElement, card);
    assert.equal(content.children.length, 0);
  }
  app.dom.window.close();
});

test("Escape cancellation and outside clicks close; clicks or drags inside do not", () => {
  const app = mount();
  app.cards[0].click();
  const article = app.dialog.querySelector("article");
  app.event(article, "pointerdown");
  article.click();
  assert.equal(app.dialog.open, true);
  app.event(article, "pointerdown");
  app.dialog.click();
  assert.equal(app.dialog.open, true);
  app.event(app.dialog, "pointerdown");
  app.dialog.click();
  assert.equal(app.dialog.open, false);
  app.cards[0].click();
  app.dialog.dispatchEvent(new app.window.Event("cancel", { cancelable: true }));
  assert.equal(app.dialog.open, false);
  assert.equal(app.document.activeElement, app.cards[0]);
  app.dom.window.close();
});

test("previews load on interaction, retain their frame while fading out, restart, and tolerate autoplay rejection", async () => {
  const app = mount();
  const card = app.cards.find((item) => item.querySelector("video"));
  const video = card.querySelector("video");
  assert.equal(video.getAttribute("src"), null);
  app.event(card, "pointerenter");
  await Promise.resolve();
  assert.ok(video.src.endsWith(video.dataset.src));
  assert.equal(app.state(video).paused, false);
  assert.ok(video.classList.contains("is-playing"));
  video.currentTime = 2;
  app.event(card, "pointerleave");
  assert.equal(app.state(video).paused, true);
  assert.equal(video.currentTime, 2);
  assert.equal(video.classList.contains("is-playing"), false);
  app.event(card, "pointerenter");
  assert.equal(video.currentTime, 0);
  app.setMotion(true);
  await Promise.resolve();
  assert.equal(video.classList.contains("is-playing"), false);
  app.dom.window.close();

  const rejected = mount({ rejectPlay: true });
  const rejectedCard = rejected.cards.find((item) => item.querySelector("video"));
  rejected.event(rejectedCard, "pointerenter");
  await Promise.resolve();
  await Promise.resolve();
  assert.equal(rejectedCard.querySelector("video").classList.contains("is-playing"), false);
  rejected.dom.window.close();
});

test("reduced motion, data saving, and touch prevent automatic preview downloads", () => {
  for (const options of [{ reduced: true }, { saveData: true }, { fine: false }]) {
    const app = mount(options);
    const card = app.cards.find((item) => item.querySelector("video"));
    app.event(card, "pointerenter");
    card.focus();
    assert.equal(card.querySelector("video").getAttribute("src"), null);
    card.click();
    assert.equal(app.dialog.open, true);
    app.dom.window.close();
  }
});

test("previews stop when filtered out, outside the viewport, or the document is hidden", async () => {
  const app = mount();
  const card = app.cards.find((item) => item.querySelector("video"));
  const video = card.querySelector("video");
  app.event(card, "pointerenter");
  await Promise.resolve();
  app.observed.find((observer) => !observer.options).callback([{ target: card, isIntersecting: false }]);
  assert.equal(video.paused, true);
  app.event(card, "pointerenter");
  await Promise.resolve();
  const excludedFilter = [...app.document.querySelectorAll("[data-filter]")].find(
    (filter) => filter.dataset.filter !== "all" && !JSON.parse(card.dataset.categories).includes(filter.dataset.filter)
  );
  excludedFilter.click();
  assert.equal(video.paused, true);
  app.document.querySelector('[data-filter="all"]').click();
  app.event(card, "pointerenter");
  await Promise.resolve();
  Object.defineProperty(app.document, "hidden", { value: true });
  app.document.dispatchEvent(new app.window.Event("visibilitychange"));
  assert.equal(video.paused, true);
  app.dom.window.close();
});

test("section tracking handles scrolling down, the page bottom, and back to Home", () => {
  for (const observers of [true, false]) {
    const app = mount({ observers });
    const current = () => app.document.querySelector('[aria-current="location"]').hash;
    assert.equal(current(), "#home");
    app.scroll(900);
    assert.equal(current(), "#projects");
    app.scroll(2200);
    assert.equal(current(), "#skills");
    app.scroll(0);
    assert.equal(current(), "#home");
    assert.equal(app.document.querySelectorAll('[aria-current="location"]').length, 1);
    app.dom.window.close();
  }
});

test("built output is one page with valid local links and media, including inert details", async () => {
  const dom = new JSDOM(html);
  const { document } = dom.window;
  assert.equal(document.querySelectorAll("main").length, 1);
  assert.equal(document.querySelectorAll("h1").length, 1);
  assert.equal(document.querySelector("html").lang, "en");
  assert.equal(document.querySelector('link[rel="canonical"]').href, "https://martin.daigne.com/");
  assert.equal((await readFile("dist/CNAME", "utf8")).trim(), "martin.daigne.com");
  await stat("dist/.nojekyll");
  assert.equal(document.querySelectorAll(".detail-media").length, 0);
  const roots = [document, ...[...document.querySelectorAll("template")].map((template) => template.content)];
  const paths = new Set();
  for (const root of roots) {
    for (const image of root.querySelectorAll("img")) assert.ok(image.alt.trim(), "Every content image needs alt text");
    for (const element of root.querySelectorAll("[href], [src], [poster], [data-src], [srcset]")) {
      for (const attr of ["href", "src", "poster", "data-src"]) {
        const value = element.getAttribute(attr);
        if (value?.startsWith("/")) paths.add(value);
      }
      for (const candidate of (element.getAttribute("srcset") || "").split(",")) {
        const value = candidate.trim().split(/\s+/)[0];
        if (value?.startsWith("/")) paths.add(value);
      }
    }
  }
  for (const url of paths) {
    const filename = path.join("dist", decodeURIComponent(url.split("?")[0]));
    assert.ok((await stat(filename)).isFile(), `${url} must resolve to a built file`);
  }
  const pdf = await readFile("dist/assets/rendercv/rendercv_output/Martin_Daigne_CV.pdf");
  assert.equal(pdf.subarray(0, 5).toString(), "%PDF-");
  assert.deepEqual(pdf, await readFile("assets/rendercv/rendercv_output/Martin_Daigne_CV.pdf"));
  assert.equal(
    document.querySelector('[aria-label="Download CV (PDF)"]').getAttribute("href"),
    "/assets/rendercv/rendercv_output/Martin_Daigne_CV.pdf"
  );
  async function pages(folder) {
    const entries = await readdir(folder, { withFileTypes: true });
    return (await Promise.all(entries.map((entry) => (entry.isDirectory() ? pages(path.join(folder, entry.name)) : [path.join(folder, entry.name)]))))
      .flat()
      .filter((file) => file.endsWith(".html"));
  }
  assert.deepEqual(await pages("dist"), [path.join("dist", "index.html")]);
  dom.window.close();
});

test("optional project content disappears cleanly", () => {
  const dom = new JSDOM(html);
  const templates = [...dom.window.document.querySelectorAll("template")];
  const withoutExtraMedia = templates.filter((template) => template.content.querySelectorAll(".detail-media").length <= 1);
  withoutExtraMedia.forEach((template) => assert.equal(template.content.querySelector(".detail-gallery"), null));
  for (const template of templates) {
    const links = template.content.querySelector(".project-links");
    if (links) assert.ok(links.children.length > 0);
    assert.ok([...template.content.querySelectorAll("h2, h3")].every((heading) => heading.textContent.trim()));
  }
  dom.window.close();
});
