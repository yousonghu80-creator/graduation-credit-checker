(() => {
  const sections =
    document.querySelectorAll("main > section");

  const planner =
    document.querySelector(".planner-panel");

  const timetable =
    document.querySelector(".timetable-panel");

  const subjectList =
    document.getElementById("subjectList");

  if (
    sections.length < 5 ||
    !planner ||
    !timetable ||
    !subjectList
  ) {
    return;
  }

  sections[0].id = "nav-credits";
  sections[3].id = "nav-judgment";
  planner.id = "nav-planner";
  timetable.id = "nav-timetable";

  const subjectAnchor =
    document.createElement("div");

  subjectAnchor.id = "nav-subjects";
  subjectList.before(subjectAnchor);

  const items = [
    ["nav-credits", "▤", "単位"],
    ["nav-judgment", "✓", "判定"],
    ["nav-planner", "＋", "計画"],
    ["nav-timetable", "▦", "時間割"],
    ["nav-subjects", "⌕", "科目"]
  ];

  const style =
    document.createElement("style");

  style.textContent = `
    .mobile-bottom-nav {
      display: none;
    }

    @media (max-width: 700px) {
      body {
        padding-bottom: 78px;
      }

      #nav-credits,
      #nav-judgment,
      #nav-planner,
      #nav-timetable,
      #nav-subjects {
        scroll-margin-top: 12px;
      }

      .mobile-bottom-nav {
        position: fixed;
        z-index: 1000;
        right: 8px;
        bottom: 8px;
        left: 8px;
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        padding: 6px;
        background: rgba(255, 255, 255, 0.94);
        border: 1px solid #e0e4ea;
        border-radius: 16px;
        box-shadow:
          0 8px 28px rgba(30, 40, 60, 0.18);
        backdrop-filter: blur(12px);
      }

      .mobile-nav-button {
        display: flex;
        min-width: 0;
        min-height: 49px;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        gap: 2px;
        padding: 4px 2px;
        border: 0;
        border-radius: 11px;
        background: transparent;
        color: #7b818c;
        font-family: inherit;
        font-size: 9px;
        font-weight: 700;
        cursor: pointer;
      }

      .mobile-nav-icon {
        font-size: 18px;
        line-height: 1;
      }

      .mobile-nav-button.active {
        background: #22262d;
        color: #fff;
      }
    }
  `;

  document.head.appendChild(style);

  const nav =
    document.createElement("nav");

  nav.className = "mobile-bottom-nav";

  nav.innerHTML = items
    .map(([id, icon, label], index) => `
      <button
        class="mobile-nav-button
          ${index === 0 ? "active" : ""}"
        type="button"
        data-target="${id}"
      >
        <span class="mobile-nav-icon">
          ${icon}
        </span>

        <span>${label}</span>
      </button>
    `)
    .join("");

  document.body.appendChild(nav);

  const buttons = [
    ...nav.querySelectorAll(
      ".mobile-nav-button"
    )
  ];

  function activate(id) {
    buttons.forEach(button => {
      button.classList.toggle(
        "active",
        button.dataset.target === id
      );
    });
  }

  nav.addEventListener("click", event => {
    const button =
      event.target.closest(
        ".mobile-nav-button"
      );

    if (!button) {
      return;
    }

    const target =
      document.getElementById(
        button.dataset.target
      );

    if (!target) {
      return;
    }

    activate(button.dataset.target);

    target.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  });

  let scrollTimer;

  window.addEventListener(
    "scroll",
    () => {
      clearTimeout(scrollTimer);

      scrollTimer = setTimeout(() => {
        const checkLine =
          window.scrollY +
          window.innerHeight * 0.3;

        let currentId = items[0][0];

        items.forEach(([id]) => {
          const target =
            document.getElementById(id);

          if (
            target &&
            target.offsetTop <= checkLine
          ) {
            currentId = id;
          }
        });

        activate(currentId);
      }, 80);
    },
    {
      passive: true
    }
  );
})();