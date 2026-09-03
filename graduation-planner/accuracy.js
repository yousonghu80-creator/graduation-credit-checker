(() => {
  let otherCredits = Math.max(
    0,
    Number(
      localStorage.getItem("otherCredits")
    ) || 0
  );

  const style =
    document.createElement("style");

  style.textContent = `
    .course-code {
      font-weight: 700;
      color: #59616d;
      letter-spacing: 0.03em;
    }

    .other-credit-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      margin: 0 0 20px;
      padding: 14px 16px;
      background: #f7f9fc;
      border: 1px solid #e7ebf0;
      border-radius: 12px;
    }

    .other-credit-box label {
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-size: 12px;
      font-weight: 700;
      color: #444b55;
    }

    .other-credit-box small {
      font-weight: 400;
      color: #7b818b;
    }

    .other-credit-box input {
      width: 90px;
      padding: 10px;
      border: 1px solid #dfe3e8;
      border-radius: 9px;
      background: #ffffff;
      font: inherit;
      text-align: right;
    }

    .credit-disclaimer {
      margin-top: 10px;
      color: #7b818b;
      font-size: 11px;
      line-height: 1.7;
    }

    @media (max-width: 560px) {
      .other-credit-box {
        align-items: flex-start;
        flex-direction: column;
      }

      .other-credit-box input {
        width: 100%;
      }
    }
  `;

  document.head.appendChild(style);


  /*
  履修要覧に記載された配当学年
  */
  function courseAvailability(subject) {
    const code = subject.code;

    if (
      subject.category ===
      "基盤教育科目"
    ) {
      if (code === "CIV101") {
        return "1年";
      }

      if (code === "CIV103") {
        return "2～4年";
      }

      if (
        [
          "IHR304",
          "IHR305",
          "GER301",
          "FRA301",
          "CHI301",
          "KOR301",
          "CIV301"
        ].includes(code)
      ) {
        return "3・4年";
      }

      if (
        [
          "ENG101",
          "ENG102",
          "ENG201",
          "ENG202",
          "ENG111",
          "ENG112"
        ].includes(code)
      ) {
        return "1・2年";
      }

      return "1～4年";
    }

    if (
      subject.category ===
      "理工学基盤科目"
    ) {
      if (
        [
          "FMA201",
          "BAA201",
          "BAA202",
          "BAA203",
          "BAA204",
          "FMA202",
          "MPF201",
          "MPF202",
          "AMQ201"
        ].includes(code)
      ) {
        return "2～4年";
      }

      if (
        [
          "BAB101",
          "BAB102",
          "BAB103",
          "GLG101",
          "GLG102"
        ].includes(code)
      ) {
        return "1～3年";
      }

      if (
        [
          "BAB201",
          "GLG201"
        ].includes(code)
      ) {
        return "2・3年";
      }

      return "1年";
    }

    if (subject.type === "選択") {
      return `${subject.year}～4年`;
    }

    return `${subject.year}年`;
  }


  /*
  科目カードへ科目コードと配当学年を追加
  */
  const originalCreateSubjectCard =
    createSubjectCard;

  createSubjectCard =
    function(subject) {
      const card =
        originalCreateSubjectCard(subject);

      const meta =
        card.querySelector(".subject-meta");

      if (meta) {
        meta.insertAdjacentHTML(
          "afterbegin",
          `
            <span class="course-code">
              ${subject.code}
            </span>

            <span>
              配当 ${courseAvailability(subject)}
            </span>
          `
        );
      }

      return card;
    };


  /*
  卒業・卒着の合計に他学部他学科単位を加える
  */
  const originalMakeData =
    makeData;

  makeData =
    function(projected) {
      const data =
        originalMakeData(projected);

      data.total += otherCredits;

      return data;
    };


  /*
  他学部・他学科専門科目の入力欄
  */
  const graduationSection =
    document
      .getElementById(
        "graduationOverallStatus"
      )
      .closest("section");

  const box =
    document.createElement("div");

  box.className =
    "other-credit-box";

  box.innerHTML = `
    <label>
      他学部・他学科専門科目

      <small>
        卒業・卒着の合計単位だけに加算します
      </small>
    </label>

    <input
      id="otherCreditsInput"
      type="number"
      min="0"
      step="1"
      value="${otherCredits}"
      aria-label="他学部・他学科専門科目の修得単位"
    >
  `;

  graduationSection
    .querySelector(".eligibility-grid")
    .before(box);


  /*
  公開版向けの注意書き
  */
  const note =
    document.createElement("p");

  note.className =
    "credit-disclaimer";

  note.textContent =
    "※ 教職科目は卒業・卒着の単位には含まれません。判定結果は参考情報です。最終確認は最新の履修要覧と大学窓口で行ってください。";

  graduationSection.appendChild(note);


  /*
  他学部他学科単位の保存
  */
  document
    .getElementById(
      "otherCreditsInput"
    )
    .addEventListener(
      "input",
      event => {
        otherCredits =
          Math.max(
            0,
            Number(event.target.value) || 0
          );

        localStorage.setItem(
          "otherCredits",
          String(otherCredits)
        );

        calculateAll();
      }
    );


  /*
  学年ボタンの説明を変更
  */
  const yearTab =
    document.querySelector(".year-tab");

  if (yearTab) {
    const label =
      yearTab
        .closest(".tabs")
        .previousElementSibling;

    if (label) {
      label.textContent =
        "推奨履修学年";
    }
  }


  /*
  全リセット機能を更新
  */
  const oldResetButton =
    document.getElementById("resetData");

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
            "すべての履修状況と他学部・他学科単位を未入力に戻しますか？"
          );

        if (!confirmed) {
          return;
        }

        subjectStatuses = {};
        otherCredits = 0;

        localStorage.removeItem(
          "subjectStatuses"
        );

        localStorage.removeItem(
          "completedSubjects"
        );

        localStorage.removeItem(
          "otherCredits"
        );

        document
          .getElementById(
            "otherCreditsInput"
          )
          .value = 0;

        displaySubjects();
        calculateAll();
      }
    );
  }


  /*
  バックアップ保存機能を更新
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

          version: 2,

          savedAt:
            new Date().toISOString(),

          subjectStatuses:
            subjectStatuses,

          otherCredits:
            otherCredits
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
  バックアップ復元へ他学部他学科単位を追加
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

          otherCredits =
            Math.max(
              0,
              Number(
                backup.otherCredits
              ) || 0
            );

          localStorage.setItem(
            "otherCredits",
            String(otherCredits)
          );

          document
            .getElementById(
              "otherCreditsInput"
            )
            .value = otherCredits;

          setTimeout(
            calculateAll,
            0
          );
        } catch {
          /*
          tools.js側でエラーを表示する
          */
        }
      }
    );
  }


  /*
  科目一覧と判定を更新
  */
  displaySubjects();
  calculateAll();

})();