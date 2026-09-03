(() => {

  const style =
    document.createElement("style");

  style.textContent = `
    .utility-panel {
      margin: 18px 0 26px;
      padding: 16px;
      background: #f7f9fc;
      border: 1px solid #e7ebf0;
      border-radius: 14px;
    }

    .search-box {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 0 14px;
      background: #ffffff;
      border: 1px solid #dfe3e8;
      border-radius: 11px;
    }

    .search-box:focus-within {
      border-color: #2775ff;
      box-shadow:
        0 0 0 3px rgba(39, 117, 255, 0.1);
    }

    .search-box input {
      width: 100%;
      padding: 13px 0;
      border: 0;
      outline: 0;
      background: transparent;
      font: inherit;
    }

    .utility-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 12px;
    }

    .utility-button {
      padding: 9px 13px;
      border: 1px solid #dfe3e8;
      border-radius: 9px;
      background: #ffffff;
      color: #444b55;
      font: inherit;
      font-size: 12px;
      cursor: pointer;
    }

    .utility-button:hover {
      border-color: #2775ff;
      color: #2775ff;
    }

    .utility-button.danger:hover {
      border-color: #d43c3c;
      color: #d43c3c;
    }

    .search-result {
      margin: 10px 2px 0;
      color: #777e88;
      font-size: 11px;
    }

    .subject-card.search-hidden,
    .year-section.search-hidden {
      display: none;
    }
  `;

  document.head.appendChild(style);


  /*
  検索・データ管理パネル
  */
  const subjectList =
    document.getElementById("subjectList");

  const panel =
    document.createElement("div");

  panel.className = "utility-panel";

  panel.innerHTML = `
    <div class="search-box">

      <span>⌕</span>

      <input
        id="subjectSearch"
        type="search"
        placeholder="科目名・科目コードで検索"
        autocomplete="off"
      >

    </div>

    <div class="utility-actions">

      <button
        id="exportData"
        class="utility-button"
        type="button"
      >
        バックアップ保存
      </button>

      <button
        id="importData"
        class="utility-button"
        type="button"
      >
        バックアップ復元
      </button>

      <button
        id="resetData"
        class="utility-button danger"
        type="button"
      >
        入力を全リセット
      </button>

      <input
        id="importFile"
        type="file"
        accept="application/json,.json"
        hidden
      >

    </div>

    <p
      id="searchResult"
      class="search-result"
    ></p>
  `;

  subjectList.parentElement.insertBefore(
    panel,
    subjectList
  );


  const searchInput =
    document.getElementById("subjectSearch");

  const searchResult =
    document.getElementById("searchResult");


  /*
  検索用に文字を整える
  */
  function normalize(value) {
    return value
      .toLowerCase()
      .replace(/\s+/g, "");
  }


  /*
  科目検索
  */
  function applySearch() {
    const keyword =
      normalize(searchInput.value);

    let visibleCount = 0;

    document
      .querySelectorAll(".year-section")
      .forEach(section => {

        let sectionVisibleCount = 0;

        section
          .querySelectorAll(".subject-card")
          .forEach(card => {

            const matched =
              !keyword ||
              normalize(card.textContent)
                .includes(keyword);

            card.classList.toggle(
              "search-hidden",
              !matched
            );

            if (matched) {
              sectionVisibleCount += 1;
            }

          });

        section.classList.toggle(
          "search-hidden",
          sectionVisibleCount === 0
        );

        visibleCount +=
          sectionVisibleCount;

      });

    searchResult.textContent =
      keyword
        ? `${visibleCount}件見つかりました`
        : "";
  }


  searchInput.addEventListener(
    "input",
    applySearch
  );


  /*
  区分や学年を切り替えた後も検索を維持
  */
  document
    .querySelectorAll(
      ".category-tab, .year-tab"
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {
          setTimeout(
            applySearch,
            0
          );
        }
      );

    });



})();
