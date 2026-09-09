(() => {
  const mainSections = [
    ...document.querySelectorAll(
      "main > section"
    )
  ];

  const planner =
    document.querySelector(
      ".planner-panel"
    );

  const timetable =
    document.querySelector(
      ".timetable-panel"
    );

  const isMobile =
    window.matchMedia(
      "(max-width: 700px)"
    ).matches;

  const style =
    document.createElement("style");

  style.textContent = `
    .compact-heading {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
    }

    .compact-toggle {
      flex-shrink: 0;
      padding: 7px 10px;
      border: 1px solid #dfe3e8;
      border-radius: 8px;
      background: #fff;
      color: #646b75;
      font: inherit;
      font-size: 10px;
      font-weight: 700;
      cursor: pointer;
    }

    .compact-toggle:hover {
      border-color: #2775ff;
      color: #2775ff;
    }

    .compact-content {
      display: block;
    }

    .compact-box.compact-closed
    .compact-content {
      display: none;
    }

    .compact-box.compact-closed {
      padding-bottom: 18px;
    }

    .compact-box.compact-closed
    .dashboard-title {
      align-items: center;
    }

    @media (max-width: 700px) {
      .compact-toggle {
        min-height: 38px;
      }

      .compact-box.compact-closed {
        margin-bottom: 10px;
      }

      .planner-panel.compact-closed,
      .timetable-panel.compact-closed {
        padding-bottom: 14px;
      }
    }
  `;

  document.head.appendChild(style);

  function makeCompact(
    box,
    heading,
    key,
    closeOnMobile
  ) {
    if (!box || !heading) {
      return;
    }

    box.classList.add("compact-box");
    heading.classList.add("compact-heading");

    const content =
      document.createElement("div");

    content.className = "compact-content";

    while (heading.nextSibling) {
      content.appendChild(
        heading.nextSibling
      );
    }

    box.appendChild(content);

    const button =
      document.createElement("button");

    button.type = "button";
    button.className = "compact-toggle";

    heading.appendChild(button);

    const saved =
      localStorage.getItem(
        `compact-${key}`
      );

    const closed =
      saved === null
        ? isMobile && closeOnMobile
        : saved === "true";

    function setClosed(
      value,
      save = true
    ) {
      box.classList.toggle(
        "compact-closed",
        value
      );

      button.textContent = value
        ? "詳細を開く ＋"
        : "詳細を閉じる −";

      button.setAttribute(
        "aria-expanded",
        String(!value)
      );

      if (save) {
        localStorage.setItem(
          `compact-${key}`,
          String(value)
        );
      }
    }

    button.addEventListener(
      "click",
      () => {
        setClosed(
          !box.classList.contains(
            "compact-closed"
          )
        );
      }
    );

    box.openCompact = () => {
      setClosed(false);
    };

    setClosed(closed, false);
  }

  makeCompact(
    mainSections[0],
    mainSections[0]?.querySelector(
      ".dashboard-title"
    ),
    "basic",
    true
  );

  makeCompact(
    mainSections[1],
    mainSections[1]?.querySelector(
      ".dashboard-title"
    ),
    "science",
    true
  );

  makeCompact(
    mainSections[2],
    mainSections[2]?.querySelector(
      ".dashboard-title"
    ),
    "professional",
    true
  );

  makeCompact(
    mainSections[3],
    mainSections[3]?.querySelector(
      ".section-heading"
    ),
    "graduation",
    false
  );

  makeCompact(
    mainSections[4],
    mainSections[4]?.querySelector(
      ".section-heading"
    ),
    "eligibility",
    true
  );

  makeCompact(
    mainSections[5],
    mainSections[5]?.querySelector(
      ".section-heading"
    ),
    "missing",
    true
  );

  makeCompact(
    planner,
    planner?.querySelector(
      ".planner-header"
    ),
    "planner",
    true
  );

  makeCompact(
    timetable,
    timetable?.querySelector(
      ".timetable-header"
    ),
    "timetable",
    true
  );

  document.addEventListener(
    "click",
    event => {
      const navButton =
        event.target.closest(
          ".mobile-nav-button"
        );

      if (!navButton) {
        return;
      }

      const target =
        document.getElementById(
          navButton.dataset.target
        );

      const compactBox =
        target?.classList.contains(
          "compact-box"
        )
          ? target
          : target?.closest(
              ".compact-box"
            );

      if (compactBox?.openCompact) {
        compactBox.openCompact();
      }
    },
    true
  );
})();