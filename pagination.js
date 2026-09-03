(() => {
  const list =
    document.getElementById(
      "subjectList"
    );

  if (!list) return;

  const pageSize = 20;
  let currentPage = 1;

  const style =
    document.createElement("style");

  style.textContent = `
    .subject-card.page-hidden,
    .year-section.page-section-hidden {
      display: none;
    }

    .pagination-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin: 16px 0;
      padding: 10px 12px;
      background: #f7f8fa;
      border: 1px solid #e8ebef;
      border-radius: 10px;
    }

    .pagination-info {
      color: #737a85;
      font-size: 10px;
    }

    .pagination-buttons {
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .page-button {
      min-width: 32px;
      height: 32px;
      padding: 0 8px;
      border: 1px solid #dfe3e8;
      border-radius: 7px;
      background: #fff;
      color: #59616c;
      font: inherit;
      font-size: 10px;
      font-weight: 700;
      cursor: pointer;
    }

    .page-button.active {
      border-color: #22262d;
      background: #22262d;
      color: #fff;
    }

    .page-button:disabled {
      opacity: 0.4;
      cursor: default;
    }

    @media (max-width: 500px) {
      .pagination-bar {
        align-items: stretch;
        flex-direction: column;
      }

      .pagination-buttons {
        justify-content: center;
        flex-wrap: wrap;
      }

      .pagination-info {
        text-align: center;
      }
    }
  `;

  document.head.appendChild(style);

  const topBar =
    document.createElement("div");

  const bottomBar =
    document.createElement("div");

  topBar.className =
    "pagination-bar";

  bottomBar.className =
    "pagination-bar";

  list.before(topBar);
  list.after(bottomBar);

  function candidates() {
    return [
      ...list.querySelectorAll(
        ".subject-card"
      )
    ].filter(card =>
      !card.classList.contains(
        "search-hidden"
      ) &&
      !card.classList.contains(
        "smart-hidden"
      )
    );
  }

  function pageNumbers(totalPages) {
    if (totalPages <= 5) {
      return Array.from(
        {
          length: totalPages
        },
        (_, index) => index + 1
      );
    }

    let start =
      Math.max(
        1,
        currentPage - 2
      );

    let end =
      Math.min(
        totalPages,
        start + 4
      );

    start =
      Math.max(
        1,
        end - 4
      );

    return Array.from(
      {
        length:
          end - start + 1
      },
      (_, index) =>
        start + index
    );
  }

  function createBarHtml(
    total,
    totalPages
  ) {
    const first =
      total
        ? (
            currentPage - 1
          ) * pageSize + 1
        : 0;

    const last =
      Math.min(
        currentPage * pageSize,
        total
      );

    const numbers =
      pageNumbers(totalPages)
        .map(page => `
          <button
            class="page-button
              ${
                page === currentPage
                  ? "active"
                  : ""
              }"
            type="button"
            data-page="${page}"
          >
            ${page}
          </button>
        `)
        .join("");

    return `
      <span class="pagination-info">
        ${first}〜${last}件 /
        全${total}件
      </span>

      <div class="pagination-buttons">
        <button
          class="page-button"
          type="button"
          data-page="prev"
          ${
            currentPage === 1
              ? "disabled"
              : ""
          }
        >
          前へ
        </button>

        ${numbers}

        <button
          class="page-button"
          type="button"
          data-page="next"
          ${
            currentPage === totalPages ||
            totalPages === 0
              ? "disabled"
              : ""
          }
        >
          次へ
        </button>
      </div>
    `;
  }

  function renderPagination(
    reset = false
  ) {
    if (reset) {
      currentPage = 1;
    }

    const cards =
      candidates();

    const totalPages =
      Math.ceil(
        cards.length / pageSize
      );

    currentPage =
      Math.min(
        Math.max(
          currentPage,
          1
        ),
        Math.max(
          totalPages,
          1
        )
      );

    const start =
      (
        currentPage - 1
      ) * pageSize;

    const pageCards =
      new Set(
        cards.slice(
          start,
          start + pageSize
        )
      );

    list
      .querySelectorAll(
        ".subject-card"
      )
      .forEach(card => {
        const shouldHide =
          cards.includes(card) &&
          !pageCards.has(card);

        card.classList.toggle(
          "page-hidden",
          shouldHide
        );
      });

    list
      .querySelectorAll(
        ".year-section"
      )
      .forEach(section => {
        const hasVisible = [
          ...section.querySelectorAll(
            ".subject-card"
          )
        ].some(card =>
          !card.classList.contains(
            "search-hidden"
          ) &&
          !card.classList.contains(
            "smart-hidden"
          ) &&
          !card.classList.contains(
            "page-hidden"
          )
        );

        section.classList.toggle(
          "page-section-hidden",
          !hasVisible
        );
      });

    const html =
      createBarHtml(
        cards.length,
        totalPages
      );

    topBar.innerHTML = html;
    bottomBar.innerHTML = html;
  }

  function changePage(value) {
    if (value === "prev") {
      currentPage -= 1;
    } else if (value === "next") {
      currentPage += 1;
    } else {
      currentPage = Number(value);
    }

    renderPagination();

    const target =
      document.getElementById(
        "nav-subjects"
      ) || topBar;

    target.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  [
    topBar,
    bottomBar
  ].forEach(bar => {
    bar.addEventListener(
      "click",
      event => {
        const button =
          event.target.closest(
            "[data-page]"
          );

        if (
          button &&
          !button.disabled
        ) {
          changePage(
            button.dataset.page
          );
        }
      }
    );
  });

  [
    "subjectSearch",
    "categoryFilter",
    "statusFilter",
    "typeFilter",
    "fieldFilter"
  ].forEach(id => {
    const element =
      document.getElementById(id);

    if (!element) return;

    const eventName =
      id === "subjectSearch"
        ? "input"
        : "change";

    element.addEventListener(
      eventName,
      () => {
        setTimeout(
          () =>
            renderPagination(true),
          0
        );
      }
    );
  });

  document
    .querySelectorAll(
      ".category-tab, .year-tab"
    )
    .forEach(button => {
      button.addEventListener(
        "click",
        () => {
          setTimeout(
            () =>
              renderPagination(true),
            10
          );
        }
      );
    });

  document.addEventListener(
    "change",
    event => {
      if (
        event.target.classList.contains(
          "subject-status-select"
        )
      ) {
        setTimeout(
          () =>
            renderPagination(false),
          10
        );
      }
    }
  );

  document
  .getElementById(
    "clearSmartFilter"
  )
  ?.addEventListener(
    "click",
    () => {
      setTimeout(
        () =>
          renderPagination(true),
        0
      );
    }
  );
 
  const previousDisplaySubjects =
    displaySubjects;

  displaySubjects = function() {
    previousDisplaySubjects();

    setTimeout(
      () =>
        renderPagination(true),
      0
    );
  };

  renderPagination(true);
})();