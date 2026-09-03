(() => {

  let plannedTerms =
    JSON.parse(
      localStorage.getItem("plannedTerms")
    ) || {};

  const currentYear =
    new Date().getFullYear();

  const defaultTerm =
    `${currentYear}-${
      new Date().getMonth() < 7
        ? "spring"
        : "fall"
    }`;


  /*
  履修計画のデザイン
  */
  const style =
    document.createElement("style");

  style.textContent = `
    .subject-card.planned {
      border-color: #8b72d9;
      background: #f8f5ff;
    }

    .subject-card.planned .subject-name {
      color: #6548b8;
    }

    .subject-controls {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 7px;
    }

    .plan-term-select {
      min-width: 110px;
      padding: 7px 9px;
      border: 1px solid #d9d2f2;
      border-radius: 9px;
      background: #ffffff;
      color: #6548b8;
      font: inherit;
      font-size: 11px;
      outline: none;
    }

    .planner-panel {
      margin: 0 0 24px;
      padding: 18px;
      background:
        linear-gradient(
          135deg,
          #f7f4ff,
          #f4f8ff
        );
      border: 1px solid #e3dcf8;
      border-radius: 15px;
    }

    .planner-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 14px;
      margin-bottom: 14px;
    }

    .planner-header h3 {
      margin: 0;
      font-size: 17px;
    }

    .planner-header p {
      margin: 5px 0 0;
      color: #777e88;
      font-size: 11px;
    }

    .planner-total {
      padding: 8px 11px;
      background: #ffffff;
      border-radius: 9px;
      color: #6548b8;
      font-size: 12px;
      font-weight: 700;
      white-space: nowrap;
    }

    .term-grid {
      display: grid;
      grid-template-columns:
        repeat(2, minmax(0, 1fr));
      gap: 10px;
    }

    .term-card {
      padding: 13px;
      background: #ffffff;
      border: 1px solid #e7e2f5;
      border-radius: 11px;
    }

    .term-card.warning {
      border-color: #e3a236;
      background: #fffaf0;
    }

    .term-title {
      display: flex;
      justify-content: space-between;
      gap: 10px;
      font-size: 12px;
      font-weight: 700;
    }

    .term-subjects {
      margin: 8px 0 0;
      padding-left: 17px;
      color: #6c7280;
      font-size: 11px;
      line-height: 1.7;
    }

    .term-warning {
      margin: 8px 0 0;
      color: #b46d00;
      font-size: 11px;
      font-weight: 700;
    }

    .planner-empty {
      padding: 14px;
      background: #ffffff;
      border-radius: 10px;
      color: #777e88;
      font-size: 12px;
      text-align: center;
    }

    @media (max-width: 650px) {
      .term-grid {
        grid-template-columns: 1fr;
      }

      .planner-header {
        flex-direction: column;
      }

      .subject-controls {
        width: 100%;
        align-items: stretch;
      }

      .plan-term-select,
      .subject-status-select {
        width: 100%;
      }
    }
  `;

  document.head.appendChild(style);


  /*
  2024～2032年度の学期を作る
  */
  function createTermOptions() {
    let html = "";

    for (
      let year = 2024;
      year <= 2032;
      year++
    ) {
      html += `
        <option value="${year}-spring">
          ${year}年度 春学期
        </option>

        <option value="${year}-fall">
          ${year}年度 秋学期
        </option>
      `;
    }

    return html;
  }


  function termLabel(value) {
    const [year, semester] =
      value.split("-");

    const semesterName =
      semester === "spring"
        ? "春学期"
        : "秋学期";

    return `${year}年度 ${semesterName}`;
  }


  /*
  科目の状態に「履修予定」を追加
  */
  const originalCreateSubjectCard =
    createSubjectCard;

  createSubjectCard =
    function(subject) {
      const card =
        originalCreateSubjectCard(subject);

      const statusSelect =
        card.querySelector(
          ".subject-status-select"
        );

      const plannedOption =
        document.createElement("option");

      plannedOption.value =
        "planned";

      plannedOption.textContent =
        "履修予定";

      if (
        statusOf(subject) === "planned"
      ) {
        plannedOption.selected = true;
      }

      statusSelect.insertBefore(
        plannedOption,
        statusSelect.querySelector(
          '[value="in-progress"]'
        )
      );


      /*
      状態と学期をまとめる枠
      */
      const controls =
        document.createElement("div");

      controls.className =
        "subject-controls";

      statusSelect.parentElement.insertBefore(
        controls,
        statusSelect
      );

      controls.appendChild(
        statusSelect
      );


      /*
      履修予定の学期選択
      */
      const termSelect =
        document.createElement("select");

      termSelect.className =
        "plan-term-select";

      termSelect.innerHTML =
        createTermOptions();

      termSelect.value =
        plannedTerms[subject.code] ||
        defaultTerm;

      termSelect.hidden =
        statusOf(subject) !== "planned";

      controls.appendChild(
        termSelect
      );

      card.classList.toggle(
        "planned",
        statusOf(subject) === "planned"
      );


      /*

      状態が変更されたとき
      */
      statusSelect.addEventListener(
        "change",
        () => {
          const isPlanned =
            statusSelect.value ===
            "planned";

          termSelect.hidden =
            !isPlanned;

          card.classList.toggle(
            "planned",
            isPlanned
          );

          if (isPlanned) {
            plannedTerms[subject.code] =
              plannedTerms[subject.code] ||
              termSelect.value;
          } else {
            delete plannedTerms[
              subject.code
            ];
          }

          localStorage.setItem(
            "plannedTerms",
            JSON.stringify(
              plannedTerms
            )
          );

          renderPlanner();
        }
      );


      /*
      予定学期が変更されたとき
      */
      termSelect.addEventListener(
        "change",
        () => {
          plannedTerms[subject.code] =
            termSelect.value;

          localStorage.setItem(
            "plannedTerms",
            JSON.stringify(
              plannedTerms
            )
          );

          renderPlanner();
        }
      );

      return card;
    };


  /*
  履修計画パネル
  */
  const subjectList =
    document.getElementById(
      "subjectList"
    );

  const planner =
    document.createElement("div");

  planner.className =
    "planner-panel";

  planner.innerHTML = `
    <div class="planner-header">

      <div>
        <h3>履修計画</h3>

        <p>
          「履修予定」にした科目を
          学期ごとに集計します
        </p>
      </div>

      <div
        id="plannedTotal"
        class="planner-total"
      >
        予定 0単位
      </div>

    </div>

    <div id="termPlan"></div>
  `;

  const utilityPanel =
    subjectList
      .parentElement
      .querySelector(
        ".utility-panel"
      );

  subjectList.parentElement.insertBefore(
    planner,
    utilityPanel
  );


  /*
  履修計画を画面に表示
  */
  function renderPlanner() {
    const plannedSubjects =
      subjects.filter(
        subject =>
          statusOf(subject) ===
          "planned"
      );

    const totalCredits =
      plannedSubjects.reduce(
        (total, subject) =>
          total + subject.credits,
        0
      );

    document
      .getElementById("plannedTotal")
      .textContent =
        `予定 ${totalCredits}単位`;

    const container =
      document.getElementById(
        "termPlan"
      );

    if (
      plannedSubjects.length === 0
    ) {
      container.innerHTML = `
        <div class="planner-empty">
          科目の履修状況を
          「履修予定」にすると、
          ここへ計画が表示されます。
        </div>
      `;

      return;
    }


    /*
    学期ごとに科目をまとめる
    */
    const groups = {};

    plannedSubjects.forEach(
      subject => {
        const term =
          plannedTerms[subject.code] ||
          defaultTerm;

        if (!groups[term]) {
          groups[term] = [];
        }

        groups[term].push(subject);
      }
    );


    const cards =
      Object
        .keys(groups)
        .sort()
        .map(term => {
          const items =
            groups[term];

          const credits =
            items.reduce(
              (total, subject) =>
                total +
                subject.credits,
              0
            );

          const warning =
            credits > 24;

          const subjectItems =
            items
              .map(subject => `
                <li>
                  ${subject.name}
                  （${subject.credits}単位）
                </li>
              `)
              .join("");

          return `
            <div
              class="term-card ${
                warning
                  ? "warning"
                  : ""
              }"
            >

              <div class="term-title">

                <span>
                  ${termLabel(term)}
                </span>

                <span>
                  ${credits}/24単位
                </span>

              </div>

              <ul class="term-subjects">
                ${subjectItems}
              </ul>

              ${
                warning
                  ? `
                    <p class="term-warning">
                      履修登録上限を
                      ${credits - 24}単位
                      超えています
                    </p>
                  `
                  : ""
              }

            </div>
          `;
        })
        .join("");

    container.innerHTML = `
      <div class="term-grid">
        ${cards}
      </div>
    `;
  }


  /*
  全リセットへ履修計画を追加
  */
  const oldResetButton =
    document.getElementById(
      "resetData"
    );

  if (oldResetButton) {
    const resetButton =
      oldResetButton.cloneNode(true);

    oldResetButton.replaceWith(
      resetButton
    );

    resetButton.addEventListener(
      "click",
      () => {
        const confirmed =
          confirm(
            "履修状況・履修計画・他学部他学科単位をすべて未入力に戻しますか？"
          );

        if (!confirmed) {
          return;
        }

        subjectStatuses = {};
        plannedTerms = {};

        localStorage.removeItem(
          "subjectStatuses"
        );

        localStorage.removeItem(
          "completedSubjects"
        );

        localStorage.removeItem(
          "plannedTerms"
        );

        localStorage.removeItem(
          "otherCredits"
        );

        location.reload();
      }
    );
  }


  /*
  バックアップへ履修計画を追加
  */
  const oldExportButton =
    document.getElementById(
      "exportData"
    );

  if (oldExportButton) {
    const exportButton =
      oldExportButton.cloneNode(true);

    oldExportButton.replaceWith(
      exportButton
    );

    exportButton.addEventListener(
      "click",
      () => {
        const backup = {
          app:
            "卒業単位チェッカー",

          version: 3,

          savedAt:
            new Date().toISOString(),

          subjectStatuses:
            subjectStatuses,

          plannedTerms:
            plannedTerms,

          otherCredits:
            Number(
              localStorage.getItem(
                "otherCredits"
              )
            ) || 0
        };

        const blob =
          new Blob(
            [
              JSON.stringify(
                backup,
                null,
                2
              )
            ],
            {
              type:
                "application/json"
            }
          );

        const url =
          URL.createObjectURL(blob);

        const link =
          document.createElement("a");

        link.href = url;

        link.download =
          `卒業単位チェッカー_${
            new Date()
              .toISOString()
              .slice(0, 10)
          }.json`;

        link.click();

        URL.revokeObjectURL(url);
      }
    );
  }


  /*
  バックアップ復元へ履修計画を追加
  */
  const importFile =
    document.getElementById(
      "importFile"
    );

  if (importFile) {
    importFile.addEventListener(
      "change",
      async () => {
        const file =
          importFile.files[0];

        if (!file) {
          return;
        }

        try {
          const backup =
            JSON.parse(
              await file.text()
            );

          plannedTerms =
            backup.plannedTerms &&
            typeof backup.plannedTerms ===
              "object"
              ? backup.plannedTerms
              : {};

          localStorage.setItem(
            "plannedTerms",
            JSON.stringify(
              plannedTerms
            )
          );

          setTimeout(
            () => {
              displaySubjects();
              renderPlanner();
            },
            0
          );
        } catch {
          /*
          tools.js側でエラーを表示
          */
        }
      }
    );
  }


  /*
  初期表示
  */
  displaySubjects();
  renderPlanner();

})();