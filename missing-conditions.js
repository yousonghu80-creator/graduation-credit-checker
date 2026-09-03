(() => {
  function add(data, subject) {
    const credits = subject.credits;

    data.total += credits;

    const basic = data.basic;
    const science = data.science;
    const professional = data.professional;

    if (subject.category === "基盤教育科目") {
      basic.total += credits;

      if (subject.field === "哲学・思想") {
        basic.philosophy += credits;
      }

      if (
        ["Technical English", "国際人の形成"]
          .includes(subject.field)
      ) {
        basic.international += credits;
      }

      if (subject.field === "Technical English") {
        basic.foreignLanguage += credits;

        if (subject.type === "必修") {
          basic.technicalRequired += credits;
        }

        if (subject.type === "選択必修") {
          basic.technicalElective += credits;
        }
      }
    }

    if (subject.category === "理工学基盤科目") {
      science.total += credits;

      if (
        subject.field === "数学" &&
        subject.type === "必修"
      ) {
        science.mathRequired += credits;
      }

      if (
        subject.field === "数学" &&
        subject.type === "選択必修"
      ) {
        science.mathElective += credits;
      }

      if (
        subject.field === "物理学" &&
        subject.type === "必修"
      ) {
        science.physicsRequired += credits;
      }

      if (
        subject.field === "物理学" &&
        subject.type === "選択必修"
      ) {
        science.physicsElective += credits;
      }

      if (subject.field === "化学") {
        science.chemistry += credits;
      }

      if (
        subject.field === "情報処理" &&
        subject.type === "必修"
      ) {
        science.information += credits;
      }
    }

    if (subject.category === "専門科目") {
      professional.total += credits;

      if (subject.type === "必修") {
        professional.required += credits;
      }

      if (subject.type === "選択必修") {
        professional.elective += credits;
      }

      if (subject.group === "基幹科目") {
        professional.coreCredits += credits;
        professional.coreCount += 1;
      }
    }
  }

  function selectedData() {
    const data = makeData(false);

    const useInProgress =
      localStorage.getItem(
        "includeInProgress"
      ) === "true";

    const usePlanned =
      localStorage.getItem(
        "includePlanned"
      ) === "true";

    subjects.forEach(subject => {
      const status = statusOf(subject);

      if (
        status === "in-progress" &&
        useInProgress
      ) {
        add(data, subject);
      }

      if (
        status === "planned" &&
        usePlanned
      ) {
        add(data, subject);
      }
    });

    return data;
  }

  const style =
    document.createElement("style");

  style.textContent = `
    .missing-condition-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .missing-condition-box {
      padding: 15px;
      background: #f7f8fa;
      border: 1px solid #eceef1;
      border-radius: 12px;
    }

    .missing-condition-box h3 {
      margin: 0 0 10px;
      font-size: 13px;
    }

    .condition-list {
      display: grid;
      gap: 6px;
    }

    .condition-item {
      display: flex;
      justify-content: space-between;
      gap: 10px;
      padding: 8px 10px;
      background: #fff;
      border-radius: 8px;
      color: #626975;
      font-size: 11px;
    }

    .condition-item strong {
      color: #b25a35;
      white-space: nowrap;
    }

    .condition-clear {
      margin: 0;
      padding: 12px;
      border-radius: 9px;
      background: #eaf7ef;
      color: #267348;
      font-size: 11px;
      font-weight: 700;
    }

    @media (max-width: 700px) {
      .missing-condition-grid {
        grid-template-columns: 1fr;
      }
    }
  `;

  document.head.appendChild(style);

  const panel =
    document.createElement("section");

  panel.innerHTML = `
    <div class="section-heading">
      <p class="section-label">
        REMAINING CONDITIONS
      </p>

      <h2>不足している条件</h2>
    </div>

    <div
      id="missingConditionGrid"
      class="missing-condition-grid"
    ></div>
  `;

  document
    .querySelectorAll("main > section")[4]
    .insertAdjacentElement(
      "afterend",
      panel
    );

  function findMissing(items) {
    return items.filter(
      ([, value, target]) =>
        value < target
    );
  }

  function createBox(title, items) {
    const remaining =
      findMissing(items);

    let content;

    if (remaining.length === 0) {
      content = `
        <p class="condition-clear">
          ✓ 現在の設定では
          不足条件はありません
        </p>
      `;
    } else {
      content = `
        <div class="condition-list">
          ${remaining
            .map(
              ([
                name,
                value,
                target,
                unit = "単位"
              ]) => `
                <div class="condition-item">
                  <span>${name}</span>

                  <strong>
                    あと${target - value}${unit}
                  </strong>
                </div>
              `
            )
            .join("")}
        </div>
      `;
    }

    return `
      <div class="missing-condition-box">
        <h3>${title}</h3>
        ${content}
      </div>
    `;
  }

  function renderMissingConditions() {
    const data = selectedData();

    const graduation =
      graduationRequirements.graduation;

    const eligibility =
      graduationRequirements.eligibility;

    const graduationItems = [
      ["合計", data.total, graduation.total],

      [
        "基盤教育",
        data.basic.total,
        graduation.basicEducation.total
      ],

      [
        "哲学・思想",
        data.basic.philosophy,
        graduation.basicEducation.philosophy
      ],

      [
        "国際人の形成",
        data.basic.international,
        graduation.basicEducation.international
      ],

      [
        "外国語",
        data.basic.foreignLanguage,
        graduation.basicEducation.foreignLanguage
      ],

      [
        "Technical English 必修",
        data.basic.technicalRequired,
        graduation.basicEducation
          .technicalEnglishRequired
      ],

      [
        "Technical English 選択必修",
        data.basic.technicalElective,
        graduation.basicEducation
          .technicalEnglishElective
      ],

      [
        "理工学基盤",
        data.science.total,
        graduation.scienceFoundation.total
      ],

      [
        "数学 必修",
        data.science.mathRequired,
        graduation.scienceFoundation
          .mathematics.required
      ],

      [
        "数学 選択必修",
        data.science.mathElective,
        graduation.scienceFoundation
          .mathematics.requiredElective
      ],

      [
        "物理 必修",
        data.science.physicsRequired,
        graduation.scienceFoundation
          .physics.required
      ],

      [
        "物理 選択必修",
        data.science.physicsElective,
        graduation.scienceFoundation
          .physics.requiredElective
      ],

      [
        "化学",
        data.science.chemistry,
        graduation.scienceFoundation
          .chemistry.minimum
      ],

      [
        "情報処理 必修",
        data.science.information,
        graduation.scienceFoundation
          .information.required
      ],

      [
        "専門科目",
        data.professional.total,
        graduation.professional.total
      ],

      [
        "専門必修",
        data.professional.required,
        graduation.professional.required
      ],

      [
        "専門選択必修",
        data.professional.elective,
        graduation.professional
          .requiredElective
      ],

      [
        "基幹科目単位",
        data.professional.coreCredits,
        graduation.professional.coreCredits
      ],

      [
        "基幹科目数",
        data.professional.coreCount,
        graduation.professional.coreSubjects,
        "科目"
      ]
    ];

    const eligibilityItems = [
      [
        "合計",
        data.total,
        eligibility.total
      ],

      [
        "基盤教育",
        data.basic.total,
        eligibility.basicEducation
      ],

      [
        "国際人の形成",
        data.basic.international,
        eligibility.international
      ],

      [
        "外国語",
        data.basic.foreignLanguage,
        eligibility.foreignLanguage
      ],

      [
        "Technical English 必修",
        data.basic.technicalRequired,
        eligibility.technicalEnglishRequired
      ],

      [
        "Technical English 選択必修",
        data.basic.technicalElective,
        eligibility.technicalEnglishElective
      ],

      [
        "理工学基盤",
        data.science.total,
        eligibility.scienceFoundation
      ],

      [
        "専門科目",
        data.professional.total,
        eligibility.professional.total
      ],

      [
        "専門必修",
        data.professional.required,
        eligibility.professional.required
      ],

      [
        "専門選択必修",
        data.professional.elective,
        eligibility.professional
          .requiredElective
      ],

      [
        "基幹科目単位",
        data.professional.coreCredits,
        eligibility.professional.coreCredits
      ],

      [
        "基幹科目数",
        data.professional.coreCount,
        eligibility.professional.coreSubjects,
        "科目"
      ]
    ];

    document.getElementById(
      "missingConditionGrid"
    ).innerHTML =
      createBox(
        "卒業条件",
        graduationItems
      ) +
      createBox(
        "卒着条件",
        eligibilityItems
      );
  }

  const previousCalculateAll =
    calculateAll;

  calculateAll = function() {
    previousCalculateAll();
    renderMissingConditions();
  };

  renderMissingConditions();
})();