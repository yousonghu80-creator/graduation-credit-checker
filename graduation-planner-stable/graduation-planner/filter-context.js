(() => {
  const utility =
    document.querySelector(
      ".utility-panel"
    );

  const smartFilter =
    document.querySelector(
      ".smart-filter"
    );

  if (!utility || !smartFilter) {
    return;
  }

  const style =
    document.createElement("style");

  style.textContent = `
    .filter-context {
      display: none;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin: 12px 0 0;
      padding: 11px 12px;
      border: 1px solid #cfe0f7;
      border-radius: 10px;
      background: #eef5ff;
      color: #315f9d;
    }

    .filter-context.show {
      display: flex;
    }

    .filter-context strong {
      display: block;
      font-size: 11px;
    }

    .filter-context span {
      display: block;
      margin-top: 3px;
      color: #6680a3;
      font-size: 9px;
    }

    .filter-context-clear {
      flex-shrink: 0;
      padding: 7px 9px;
      border: 1px solid #bed2ee;
      border-radius: 7px;
      background: #fff;
      color: #3568ad;
      font: inherit;
      font-size: 9px;
      font-weight: 700;
      cursor: pointer;
    }

    @media (max-width: 500px) {
      .filter-context {
        align-items: stretch;
        flex-direction: column;
      }

      .filter-context-clear {
        min-height: 38px;
      }
    }
  `;

  document.head.appendChild(style);

  const banner =
    document.createElement("div");

  banner.className = "filter-context";

  banner.innerHTML = `
    <div>
      <strong
        id="filterContextTitle"
      ></strong>

      <span>
        履修中・修得済みを除外して、
        関連する候補科目を表示しています
      </span>
    </div>

    <button
      class="filter-context-clear"
      type="button"
    >
      絞り込みを解除
    </button>
  `;

  smartFilter.insertAdjacentElement(
    "afterend",
    banner
  );

  function hideBanner() {
    banner.classList.remove("show");
  }

  document.addEventListener(
    "click",
    event => {
      const conditionButton =
        event.target.closest(
          ".condition-link"
        );

      if (!conditionButton) {
        return;
      }

      const name =
        conditionButton.dataset.condition;

      document.getElementById(
        "filterContextTitle"
      ).textContent =
        `${name}の候補を表示中`;

      banner.classList.add("show");
    }
  );

  [
    "categoryFilter",
    "statusFilter",
    "typeFilter",
    "fieldFilter"
  ].forEach(id => {
    document
      .getElementById(id)
      ?.addEventListener(
        "change",
        event => {
          if (event.isTrusted) {
            hideBanner();
          }
        }
      );
  });

  banner
    .querySelector(
      ".filter-context-clear"
    )
    .addEventListener(
      "click",
      () => {
        document
          .getElementById(
            "clearSmartFilter"
          )
          ?.click();

        hideBanner();
      }
    );
})();