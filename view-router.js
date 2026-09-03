(() => {
  const main =
    document.querySelector("main");

  const mobileNav =
    document.querySelector(
      ".mobile-bottom-nav"
    );

  if (
    !main ||
    !mobileNav ||
    document.querySelector(".app-view")
  ) {
    return;
  }

  const elements = {
    summary:
      document.querySelector(
        ".quick-summary"
      ),

    basic:
      document.getElementById(
        "nav-credits"
      ),

    science:
      document
        .getElementById("scienceCredits")
        ?.closest("section"),

    professional:
      document
        .getElementById(
          "professionalCredits"
        )
        ?.closest("section"),

    graduation:
      document.getElementById(
        "nav-judgment"
      ),

    eligibility:
      document
        .getElementById(
          "eligibilityStatus"
        )
        ?.closest("section"),

    conditions:
      document
        .getElementById(
          "missingConditionGrid"
        )
        ?.closest("section"),

    required:
      document
        .getElementById(
          "missingRequiredList"
        )
        ?.closest("section"),

    planner:
      document.getElementById(
        "nav-planner"
      ),

    timetable:
      document.getElementById(
        "nav-timetable"
      ),

    subjects:
      document
        .getElementById("subjectList")
        ?.closest("section")
  };

  if (
    Object
      .values(elements)
      .some(element => !element)
  ) {
    return;
  }

  const viewItems = [
    ["home", "⌂", "ホーム"],
    ["judgment", "✓", "判定"],
    ["planner", "＋", "計画"],
    ["timetable", "▦", "時間割"],
    ["subjects", "⌕", "科目"]
  ];

  const groups = {
    home: [
      elements.summary,
      elements.basic,
      elements.science,
      elements.professional
    ],

    judgment: [
      elements.graduation,
      elements.eligibility,
      elements.conditions,
      elements.required
    ],

    planner: [
      elements.planner
    ],

    timetable: [
      elements.timetable
    ],

    subjects: [
      elements.subjects
    ]
  };

  const style =
    document.createElement("style");

  style.textContent = `
    .app-view[hidden] {
      display: none !important;
    }

    .desktop-view-nav {
      position: sticky;
      z-index: 900;
      top: 0;
      display: flex;
      justify-content: center;
      gap: 5px;
      padding: 9px 16px;
      background:
        rgba(255, 255, 255, 0.94);
      border-bottom:
        1px solid #e5e8ed;
      backdrop-filter: blur(12px);
    }

    .view-nav-button {
      min-width: 90px;
      padding: 9px 14px;
      border: 0;
      border-radius: 9px;
      background: transparent;
      color: #707782;
      font: inherit;
      font-size: 11px;
      font-weight: 700;
      cursor: pointer;
    }

    .view-nav-button.active {
      background: #22262d;
      color: #fff;
    }

    @media (max-width: 700px) {
      .desktop-view-nav {
        display: none;
      }

      .app-view {
        min-height:
          calc(100vh - 170px);
      }
    }
  `;

  document.head.appendChild(style);

  Object
    .entries(groups)
    .forEach(([name, children]) => {
      const view =
        document.createElement("div");

      view.className = "app-view";
      view.dataset.view = name;
      view.id = `view-${name}`;

      children.forEach(child => {
        view.appendChild(child);
      });

      main.appendChild(view);
    });

  const desktopNav =
    document.createElement("nav");

  desktopNav.className =
    "desktop-view-nav";

  desktopNav.setAttribute(
    "aria-label",
    "画面メニュー"
  );

  desktopNav.innerHTML = viewItems
    .map(([view, icon, label]) => `
      <button
        class="view-nav-button"
        type="button"
        data-view="${view}"
      >
        ${icon} ${label}
      </button>
    `)
    .join("");

  document
    .querySelector(".top-header")
    ?.insertAdjacentElement(
      "afterend",
      desktopNav
    );

  const newMobileNav =
    mobileNav.cloneNode(true);

  mobileNav.replaceWith(newMobileNav);

  newMobileNav
    .querySelectorAll(
      ".mobile-nav-button"
    )
    .forEach((button, index) => {
      const item = viewItems[index];

      if (!item) return;

      button.dataset.view = item[0];

      button.removeAttribute(
        "data-target"
      );

      button
        .querySelector(
          ".mobile-nav-icon"
        )
        .textContent = item[1];

      button
        .querySelector(
          "span:last-child"
        )
        .textContent = item[2];
    });

  const validViews =
    viewItems.map(item => item[0]);

  function showView(
    name,
    updateUrl = true,
    smooth = true
  ) {
    if (!validViews.includes(name)) {
      name = "home";
    }

    document
      .querySelectorAll(".app-view")
      .forEach(view => {
        view.hidden =
          view.dataset.view !== name;
      });

    document
      .querySelectorAll("[data-view]")
      .forEach(button => {
        if (!button.matches("button")) {
          return;
        }

        button.classList.toggle(
          "active",
          button.dataset.view === name
        );
      });

    localStorage.setItem(
      "currentView",
      name
    );

    if (updateUrl) {
      history.pushState(
        null,
        "",
        `#${name}`
      );
    }

    window.scrollTo({
      top: 0,
      behavior:
        smooth ? "smooth" : "auto"
    });
  }

  document.addEventListener(
    "click",
    event => {
      const navButton =
        event.target.closest(
          "button[data-view]"
        );

      if (navButton) {
        showView(
          navButton.dataset.view
        );
      }

      const conditionButton =
        event.target.closest(
          ".condition-link"
        );

      if (conditionButton) {
        showView("subjects");
      }
    }
  );

  window.addEventListener(
    "popstate",
    () => {
      showView(
        location.hash.slice(1),
        false,
        false
      );
    }
  );

  const initial =
    location.hash.slice(1) ||
    localStorage.getItem(
      "currentView"
    ) ||
    "home";

  showView(
    initial,
    false,
    false
  );
})();