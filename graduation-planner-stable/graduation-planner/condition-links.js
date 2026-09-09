(() => {
  const grid =
    document.getElementById(
      "missingConditionGrid"
    );

  const category =
    document.getElementById(
      "categoryFilter"
    );

  const status =
    document.getElementById(
      "statusFilter"
    );

  const type =
    document.getElementById(
      "typeFilter"
    );

  const field =
    document.getElementById(
      "fieldFilter"
    );

  if (
    !grid ||
    !category ||
    !status ||
    !type ||
    !field
  ) {
    return;
  }

  const style =
    document.createElement("style");

  style.textContent = `
    .condition-item {
      flex-wrap: wrap;
      align-items: center;
    }

    .condition-link {
      width: 100%;
      padding: 6px 8px;
      border: 1px solid #dbe3ee;
      border-radius: 7px;
      background: #f7faff;
      color: #3568ad;
      font: inherit;
      font-size: 10px;
      font-weight: 700;
      cursor: pointer;
    }

    .condition-link:hover {
      border-color: #2775ff;
      background: #edf4ff;
    }
  `;

  document.head.appendChild(style);

  function filterFor(name) {
    const result = {
      category: "all",
      type: "all",
      field: "all"
    };

    if (
      [
        "基盤教育",
        "哲学・思想",
        "国際人の形成",
        "外国語",
        "Technical English 必修",
        "Technical English 選択必修"
      ].includes(name)
    ) {
      result.category =
        "基盤教育科目";
    }

    if (
      [
        "理工学基盤",
        "数学 必修",
        "数学 選択必修",
        "物理 必修",
        "物理 選択必修",
        "化学",
        "情報処理 必修"
      ].includes(name)
    ) {
      result.category =
        "理工学基盤科目";
    }

    if (
      [
        "専門科目",
        "専門必修",
        "専門選択必修",
        "基幹科目単位",
        "基幹科目数"
      ].includes(name)
    ) {
      result.category =
        "専門科目";
    }

    if (name === "哲学・思想") {
      result.field = "哲学・思想";
    }

    if (name === "国際人の形成") {
      result.field = "国際人の形成";
    }

    if (
      [
        "外国語",
        "Technical English 必修",
        "Technical English 選択必修"
      ].includes(name)
    ) {
      result.field =
        "Technical English";
    }

    if (name.startsWith("数学")) {
      result.field = "数学";
    }

    if (name.startsWith("物理")) {
      result.field = "物理学";
    }

    if (name === "化学") {
      result.field = "化学";
    }

    if (name === "情報処理 必修") {
      result.field = "情報処理";
    }

    if (
      [
        "Technical English 必修",
        "数学 必修",
        "物理 必修",
        "情報処理 必修",
        "専門必修"
      ].includes(name)
    ) {
      result.type = "必修";
    }

    if (
      [
        "Technical English 選択必修",
        "数学 選択必修",
        "物理 選択必修",
        "専門選択必修"
      ].includes(name)
    ) {
      result.type = "選択必修";
    }

    if (
      [
        "基幹科目単位",
        "基幹科目数"
      ].includes(name)
    ) {
      result.type = "基幹科目";
    }

    return result;
  }

  function addButtons() {
    grid
      .querySelectorAll(".condition-item")
      .forEach(item => {
        if (
          item.querySelector(
            ".condition-link"
          )
        ) {
          return;
        }

        const name = item
          .querySelector("span")
          ?.textContent.trim();

        if (!name) return;

        const button =
          document.createElement("button");

        button.type = "button";
        button.className =
          "condition-link";

        button.dataset.condition = name;

        button.textContent =
          "該当科目を見る →";

        item.appendChild(button);
      });
  }

  grid.addEventListener(
    "click",
    event => {
      const button =
        event.target.closest(
          ".condition-link"
        );

      if (!button) return;

      const selected =
        filterFor(
          button.dataset.condition
        );

      category.value =
        selected.category;

      status.value = "available";
      type.value = selected.type;

      const fieldExists = [
        ...field.options
      ].some(
        option =>
          option.value === selected.field
      );

      field.value = fieldExists
        ? selected.field
        : "all";

      document
        .querySelector(
          '.category-tab[data-category="all"]'
        )
        ?.click();

      document
        .querySelector(
          '.year-tab[data-year="all"]'
        )
        ?.click();

      field.dispatchEvent(
        new Event(
          "change",
          {
            bubbles: true
          }
        )
      );

      setTimeout(() => {
        const target =
          document.getElementById(
            "nav-subjects"
          ) ||
          document.getElementById(
            "subjectList"
          );

        target?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }, 50);
    }
  );

  new MutationObserver(
    addButtons
  ).observe(
    grid,
    {
      childList: true,
      subtree: true
    }
  );

  addButtons();
})();