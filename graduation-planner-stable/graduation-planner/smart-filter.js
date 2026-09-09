(() => {
  const utility =
    document.querySelector(".utility-panel");

  if (!utility) return;

  const style =
    document.createElement("style");

  style.textContent = `
    .smart-filter {
      display: grid;
      grid-template-columns:
        repeat(4, minmax(0, 1fr)) auto;
      gap: 8px;
      margin-top: 12px;
    }

    .smart-filter select,
    .filter-clear {
      min-width: 0;
      padding: 9px 10px;
      border: 1px solid #dfe3e8;
      border-radius: 9px;
      background: #fff;
      color: #555c66;
      font: inherit;
      font-size: 11px;
    }

    .filter-clear {
      cursor: pointer;
      font-weight: 700;
    }

    .filter-clear:hover {
      border-color: #2775ff;
      color: #2775ff;
    }

    .smart-filter-result {
      grid-column: 1 / -1;
      margin: 0 2px;
      color: #777e88;
      font-size: 10px;
    }

    .subject-card.smart-hidden,
    .year-section.smart-section-hidden {
      display: none;
    }

    @media (max-width: 700px) {
      .smart-filter {
        grid-template-columns: 1fr 1fr;
      }

      .smart-filter select,
      .filter-clear {
        min-height: 42px;
      }

      .smart-filter-result {
        grid-column: 1 / -1;
      }
    }

    @media (max-width: 380px) {
      .smart-filter {
        grid-template-columns: 1fr;
      }
    }
  `;

  document.head.appendChild(style);

  const escapeHtml = value =>
    String(value)
      .replaceAll("&", "&amp;")
      .replaceAll('"', "&quot;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");

  const categories = [
    "基盤教育科目",
    "理工学基盤科目",
    "専門科目"
  ];

  const fieldsByCategory = {};

  categories.forEach(category => {
    fieldsByCategory[category] = [
      ...new Set(
        subjects
          .filter(subject =>
            subject.category === category &&
            subject.field
          )
          .map(subject => subject.field)
      )
    ].sort();
  });

  const fieldOptions = categories
    .map(category => {
      const options =
        fieldsByCategory[category]
          .map(field => `
            <option value="${escapeHtml(field)}">
              ${escapeHtml(field)}
            </option>
          `)
          .join("");

      if (!options) return "";

      return `
        <optgroup label="${category}">
          ${options}
        </optgroup>
      `;
    })
    .join("");

  const panel =
    document.createElement("div");

  panel.className = "smart-filter";

  panel.innerHTML = `
    <select
      id="categoryFilter"
      aria-label="科目区分で絞り込み"
    >
      <option value="all">
        科目区分：すべて
      </option>

      <option value="基盤教育科目">
        基盤教育のみ
      </option>

      <option value="理工学基盤科目">
        理工学基盤のみ
      </option>

      <option value="専門科目">
        専門科目のみ
      </option>
    </select>

    <select
      id="statusFilter"
      aria-label="履修状況で絞り込み"
    >
      <option value="all">
        履修状況：すべて
      </option>

      <option value="available">
        履修中・修得済みを除外
      </option>

      <option value="not-taken">
        未履修のみ
      </option>

      <option value="planned">
        履修予定のみ
      </option>

      <option value="in-progress">
        履修中のみ
      </option>

      <option value="completed">
        修得済みのみ
      </option>
    </select>

    <select
      id="typeFilter"
      aria-label="必修区分で絞り込み"
    >
      <option value="all">
        必修区分：すべて
      </option>

      <option value="required-set">
        必修・選択必修のみ
      </option>

      <option value="必修">
        必修のみ
      </option>

      <option value="選択必修">
        選択必修のみ
      </option>

      <option value="選択">
        選択のみ
      </option>

      <option value="基幹科目">
        基幹科目のみ
      </option>
    </select>

    <select
      id="fieldFilter"
      aria-label="分野で絞り込み"
    >
      <option value="all">
        分野：すべて
      </option>

      ${fieldOptions}
    </select>

    <button
      id="clearSmartFilter"
      class="filter-clear"
      type="button"
    >
      絞り込み解除
    </button>

    <p
      id="smartFilterResult"
      class="smart-filter-result"
    ></p>
  `;

  utility
    .querySelector(".search-box")
    .insertAdjacentElement(
      "afterend",
      panel
    );

  const categoryFilter =
    document.getElementById(
      "categoryFilter"
    );

  const statusFilter =
    document.getElementById(
      "statusFilter"
    );

  const typeFilter =
    document.getElementById(
      "typeFilter"
    );

  const fieldFilter =
    document.getElementById(
      "fieldFilter"
    );

  const result =
    document.getElementById(
      "smartFilterResult"
    );

  function subjectFromCard(card) {
    const code = card
      .querySelector(".course-code")
      ?.textContent.trim();

    return subjects.find(
      subject => subject.code === code
    );
  }

  function matches(subject) {
    const status = statusOf(subject);

    const categoryOK =
      categoryFilter.value === "all" ||
      subject.category ===
        categoryFilter.value;

    const statusOK =
      statusFilter.value === "all" ||
      (
        statusFilter.value === "available"
          ? ![
              "in-progress",
              "completed"
            ].includes(status)
          : status === statusFilter.value
      );

    let typeOK = true;

    if (typeFilter.value === "required-set") {
      typeOK = [
        "必修",
        "選択必修"
      ].includes(subject.type);
    } else if (
      typeFilter.value === "基幹科目"
    ) {
      typeOK =
        subject.group === "基幹科目";
    } else if (
      typeFilter.value !== "all"
    ) {
      typeOK =
        subject.type === typeFilter.value;
    }

    const fieldOK =
      fieldFilter.value === "all" ||
      subject.field === fieldFilter.value;

    return (
      categoryOK &&
      statusOK &&
      typeOK &&
      fieldOK
    );
  }

  function applyFilters() {
    let visible = 0;

    document
      .querySelectorAll(".year-section")
      .forEach(section => {
        let sectionVisible = 0;

        section
          .querySelectorAll(".subject-card")
          .forEach(card => {
            const subject =
              subjectFromCard(card);

            const show =
              subject && matches(subject);

            card.classList.toggle(
              "smart-hidden",
              !show
            );

            if (
              show &&
              !card.classList.contains(
                "search-hidden"
              )
            ) {
              sectionVisible += 1;
            }
          });

        section.classList.toggle(
          "smart-section-hidden",
          sectionVisible === 0
        );

        visible += sectionVisible;
      });

    const active = [
      categoryFilter,
      statusFilter,
      typeFilter,
      fieldFilter
    ].some(select =>
      select.value !== "all"
    );

    result.textContent = active
      ? `${visible}件に絞り込んでいます`
      : "";
  }

  [
    categoryFilter,
    statusFilter,
    typeFilter,
    fieldFilter
  ].forEach(select => {
    select.addEventListener(
      "change",
      applyFilters
    );
  });

  document
    .getElementById("clearSmartFilter")
    .addEventListener("click", () => {
      categoryFilter.value = "all";
      statusFilter.value = "all";
      typeFilter.value = "all";
      fieldFilter.value = "all";

      applyFilters();
    });

  document
    .getElementById("subjectSearch")
    ?.addEventListener(
      "input",
      applyFilters
    );

  document.addEventListener(
    "change",
    event => {
      if (
        event.target.classList.contains(
          "subject-status-select"
        )
      ) {
        setTimeout(applyFilters, 0);
      }
    }
  );

  const previousDisplaySubjects =
    displaySubjects;

  displaySubjects = function() {
    previousDisplaySubjects();
    applyFilters();
  };

  applyFilters();
})();