export function setupPortfolio() {
  const cards = [...document.querySelectorAll<HTMLButtonElement>("[data-project]")];
  const filters = [...document.querySelectorAll<HTMLButtonElement>("[data-filter]")];
  const status = document.querySelector<HTMLElement>("#filter-status")!;
  const dialog = document.querySelector<HTMLDialogElement>("#project-dialog")!;
  const content = document.querySelector<HTMLElement>("#project-dialog-content")!;
  const closeButton = dialog.querySelector<HTMLButtonElement>(".dialog-close")!;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  let previousFocus: HTMLElement | null = null;

  function stopPreview(card: HTMLElement) {
    const video = card.querySelector<HTMLVideoElement>(".project-preview");
    if (!video) return;
    video.pause();
    video.classList.remove("is-playing");
  }

  function startPreview(card: HTMLElement) {
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (reducedMotion.matches || connection?.saveData) return;
    const video = card.querySelector<HTMLVideoElement>(".project-preview");
    if (!video) return;
    video.muted = true;
    if (!video.src) video.src = video.dataset.src!;
    // Retain the last frame during fade-out; reset before the next playback.
    if (video.readyState > 0) video.currentTime = 0;
    // A rejected autoplay request leaves the still image visible.
    void video
      .play()
      .then(() => {
        if (!video.paused) video.classList.add("is-playing");
      })
      .catch(() => {});
  }

  cards.forEach((card) => {
    card.addEventListener("pointerenter", () => {
      if (finePointer.matches) startPreview(card);
    });
    card.addEventListener("pointerleave", () => stopPreview(card));
    card.addEventListener("focus", () => {
      if (finePointer.matches) startPreview(card);
    });
    card.addEventListener("blur", () => stopPreview(card));
    card.addEventListener("click", () => {
      const template = document.getElementById(`detail-${card.dataset.project}`) as HTMLTemplateElement;
      previousFocus = card;
      cards.forEach(stopPreview);
      content.replaceChildren(template.content.cloneNode(true));
      document.body.classList.add("modal-open");
      dialog.showModal();
      dialog.querySelector<HTMLElement>(".dialog-scroll")!.scrollTop = 0;
      closeButton.focus({ preventScroll: true });
    });
  });

  filters.forEach((filter) =>
    filter.addEventListener("click", () => {
      const category = filter.dataset.filter;
      filters.forEach((button) => {
        const active = button === filter;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", String(active));
      });
      let count = 0;
      cards.forEach((card) => {
        const visible = category === "all" || JSON.parse(card.dataset.categories!).includes(category);
        card.hidden = !visible;
        if (visible) count++;
        else stopPreview(card);
      });
      document.querySelector<HTMLElement>(".no-projects")!.hidden = count > 0;
      status.textContent = category === "all" ? `Showing all ${count} projects` : `Showing ${count} ${filter.textContent?.trim()} projects`;
    })
  );

  closeButton.addEventListener("click", () => dialog.close());
  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    dialog.close();
  });
  // The native dialog supplies Escape handling, focus containment, and inert background.
  let backdropPress = false;
  dialog.addEventListener("pointerdown", (event) => {
    backdropPress = event.target === dialog;
  });
  dialog.addEventListener("click", (event) => {
    if (backdropPress && event.target === dialog) dialog.close();
    backdropPress = false;
  });
  dialog.addEventListener("close", () => {
    content.querySelectorAll("video").forEach((video) => video.pause());
    content.replaceChildren();
    document.body.classList.remove("modal-open");
    previousFocus?.focus({ preventScroll: true });
    // Restoring focus must not restart a preview behind a closed modal.
    cards.forEach(stopPreview);
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cards.forEach(stopPreview);
      content.querySelectorAll("video").forEach((video) => video.pause());
    }
  });
  reducedMotion.addEventListener("change", () => {
    if (reducedMotion.matches) cards.forEach(stopPreview);
  });
  if ("IntersectionObserver" in window) {
    const previewObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) stopPreview(entry.target as HTMLElement);
      });
    });
    cards.filter((card) => card.querySelector("video")).forEach((card) => previewObserver.observe(card));
  }

  const sections = [...document.querySelectorAll<HTMLElement>("[data-section]")];
  const navLinks = [...document.querySelectorAll<HTMLAnchorElement>(".nav-link")];
  let scheduled = false;
  function updateSection() {
    scheduled = false;
    const threshold = window.innerHeight * 0.35;
    let active = sections[0].id;
    sections.forEach((section) => {
      if (section.getBoundingClientRect().top <= threshold) active = section.id;
    });
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4) active = sections.at(-1)!.id;
    navLinks.forEach((link) => {
      const current = link.hash === `#${active}`;
      link.classList.toggle("is-active", current);
      if (current) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }
  function scheduleSectionUpdate() {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(updateSection);
  }
  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(scheduleSectionUpdate, { rootMargin: "-20% 0px -60% 0px" });
    sections.forEach((section) => sectionObserver.observe(section));
  }
  window.addEventListener("scroll", scheduleSectionUpdate, { passive: true });
  window.addEventListener("resize", scheduleSectionUpdate);
  updateSection();
}
