const $ = id => document.getElementById(id);

const oldCompleted =
  JSON.parse(localStorage.getItem("completedSubjects")) || [];

let subjectStatuses =
  JSON.parse(localStorage.getItem("subjectStatuses")) || {};

/*
以前チェックした科目を「修得済み」として引き継ぐ
*/
oldCompleted.forEach(code => {
  if (!subjectStatuses[code]) {
    subjectStatuses[code] = "completed";
  }
});

localStorage.setItem(
  "subjectStatuses",
  JSON.stringify(subjectStatuses)
);

let selectedCategory = "all";
let selectedYear = "all";


function statusOf(subject) {
  return subjectStatuses[subject.code] || "not-taken";
}


function countsAs(subject, projected = false) {
  const status = statusOf(subject);

  return (
    status === "completed" ||
    (
      projected &&
      status === "in-progress"
    )
  );
}


function remainingText(
  current,
  required,
  unit = "単位"
) {
  const remaining =
    Math.max(required - current, 0);

  return remaining === 0
    ? "達成"
    : `あと${remaining}${unit}`;
}


function setStatus(
  id,
  ok,
  successText,
  failureText
) {
  const element = $(id);

  element.textContent =
    ok ? successText : failureText;

  element.classList.toggle("success", ok);
}


/*
履修状況の見た目
*/
function addStatusStyles() {
  const style =
    document.createElement("style");

  style.textContent = `
    .subject-status-select {
      min-width: 100px;
      padding: 8px 10px;
      border: 1px solid #dfe3e8;
      border-radius: 9px;
      background: #ffffff;
      color: #3d434d;
      font: inherit;
      cursor: pointer;
      outline: none;
    }

    .subject-status-select:focus {
      border-color: #2775ff;
      box-shadow:
        0 0 0 3px rgba(39, 117, 255, 0.12);
    }

    .subject-card.in-progress {
      border-color: #e8ad3c;
      background: #fffaf0;
    }

    .subject-card.in-progress .subject-name {
      color: #9a6500;
    }

    .progress-note {
      margin: 5px 0 0;
      color: #7b818b;
      font-size: 11px;
      text-align: right;
    }

    @media (max-width: 500px) {
      .subject-status-select {
        min-width: 90px;
        padding: 7px 8px;
        font-size: 11px;
      }
    }
  `;

  document.head.appendChild(style);
}


/*
各区分に履修中単位の表示を追加
*/
function addProgressNotes() {
  const items = [
    ["basicCredits", "basicInProgress"],
    ["scienceCredits", "scienceInProgress"],
    ["professionalCredits", "professionalInProgress"]
  ];

  items.forEach(([creditId, noteId]) => {
    const totalProgress =
      $(creditId).closest(".total-progress");

    const note =
      document.createElement("p");

    note.id = noteId;
    note.className = "progress-note";
    note.textContent = "履修中 +0単位";

    totalProgress.appendChild(note);
  });
}


/*
科目一覧
*/
function displaySubjects() {
  const list = $("subjectList");

  list.innerHTML = "";

  [1, 2, 3, 4].forEach(year => {
    if (
      selectedYear !== "all" &&
      Number(selectedYear) !== year
    ) {
      return;
    }

    const filtered =
      subjects.filter(subject => {
        const yearOK =
          subject.year === year;

        const categoryOK =
          selectedCategory === "all" ||
          subject.category === selectedCategory;

        return yearOK && categoryOK;
      });

    if (filtered.length === 0) {
      return;
    }

    const section =
      document.createElement("div");

    section.className = "year-section";

    section.innerHTML = `
      <h3 class="year-title">
        ${year}年
      </h3>
    `;

    const grid =
      document.createElement("div");

    grid.className = "subject-grid";

    filtered.forEach(subject => {
      grid.appendChild(
        createSubjectCard(subject)
      );
    });

    section.appendChild(grid);
    list.appendChild(section);
  });
}


/*
科目カード
*/
function createSubjectCard(subject) {
  const card =
    document.createElement("div");

  const currentStatus =
    statusOf(subject);

  card.className = "subject-card";

  card.classList.toggle(
    "completed",
    currentStatus === "completed"
  );

  card.classList.toggle(
    "in-progress",
    currentStatus === "in-progress"
  );

  let tagClass = "elective";
  let tagText = subject.type;

  if (subject.type === "必修") {
    tagClass = "required";
  }

  if (subject.type === "選択必修") {
    tagClass = "required-elective";
  }

  if (subject.group === "基幹科目") {
    tagClass = "core";
    tagText = "基幹";
  }

  const fieldTag =
    subject.field
      ? `
        <span class="field-tag">
          ${subject.field}
        </span>
      `
      : "";

  card.innerHTML = `
    <div class="subject-info">

      <div class="subject-name">
        ${subject.name}
      </div>

      <div class="subject-meta">

        <span>
          ${subject.credits}単位
        </span>

        ${fieldTag}

        <span class="subject-tag ${tagClass}">
          ${tagText}
        </span>

      </div>

    </div>

    <select
      class="subject-status-select"
      aria-label="${subject.name}の履修状況"
    >

      <option
        value="not-taken"
        ${
          currentStatus === "not-taken"
            ? "selected"
            : ""
        }
      >
        未履修
      </option>

      <option
        value="in-progress"
        ${
          currentStatus === "in-progress"
            ? "selected"
            : ""
        }
      >
        履修中
      </option>

      <option
        value="completed"
        ${
          currentStatus === "completed"
            ? "selected"
            : ""
        }
      >
        修得済み
      </option>

    </select>
  `;

  const select =
    card.querySelector(
      ".subject-status-select"
    );

  select.addEventListener(
    "change",
    event => {
      const value =
        event.target.value;

      if (value === "not-taken") {
        delete subjectStatuses[subject.code];
      } else {
        subjectStatuses[subject.code] = value;
      }

      localStorage.setItem(
        "subjectStatuses",
        JSON.stringify(subjectStatuses)
      );
      
/*
古いチェックボックス形式のデータは
新形式へ移行後に削除する
*/
localStorage.removeItem(
  "completedSubjects"
);

      card.classList.toggle(
        "completed",
        value === "completed"
      );

      card.classList.toggle(
        "in-progress",
        value === "in-progress"
      );

      calculateAll();
    }
  );

  return card;
}


/*
基盤教育の集計
*/
function basicData(projected = false) {
  const data = {
    total: 0,
    philosophy: 0,
    international: 0,
    foreignLanguage: 0,
    technicalRequired: 0,
    technicalElective: 0
  };

  subjects
    .filter(subject =>
      subject.category === "基盤教育科目" &&
      countsAs(subject, projected)
    )
    .forEach(subject => {
      data.total += subject.credits;

      if (
        subject.field === "哲学・思想"
      ) {
        data.philosophy +=
          subject.credits;
      }

      if (
        subject.field === "Technical English" ||
        subject.field === "国際人の形成"
      ) {
        data.international +=
          subject.credits;
      }

      if (
        subject.field === "Technical English"
      ) {
        data.foreignLanguage +=
          subject.credits;

        if (subject.type === "必修") {
          data.technicalRequired +=
            subject.credits;
        }

        if (subject.type === "選択必修") {
          data.technicalElective +=
            subject.credits;
        }
      }
    });

  return data;
}


/*
理工学基盤の集計
*/
function scienceData(projected = false) {
  const data = {
    total: 0,
    mathRequired: 0,
    mathElective: 0,
    physicsRequired: 0,
    physicsElective: 0,
    chemistry: 0,
    information: 0
  };

  subjects
    .filter(subject =>
      subject.category === "理工学基盤科目" &&
      countsAs(subject, projected)
    )
    .forEach(subject => {
      data.total += subject.credits;

      if (
        subject.field === "数学" &&
        subject.type === "必修"
      ) {
        data.mathRequired +=
          subject.credits;
      }

      if (
        subject.field === "数学" &&
        subject.type === "選択必修"
      ) {
        data.mathElective +=
          subject.credits;
      }

      if (
        subject.field === "物理学" &&
        subject.type === "必修"
      ) {
        data.physicsRequired +=
          subject.credits;
      }

      if (
        subject.field === "物理学" &&
        subject.type === "選択必修"
      ) {
        data.physicsElective +=
          subject.credits;
      }

      if (subject.field === "化学") {
        data.chemistry +=
          subject.credits;
      }

      if (
        subject.field === "情報処理" &&
        subject.type === "必修"
      ) {
        data.information +=
          subject.credits;
      }
    });

  return data;
}


/*
専門科目の集計
*/
function professionalData(projected = false) {
  const data = {
    total: 0,
    required: 0,
    elective: 0,
    coreCredits: 0,
    coreCount: 0
  };

  subjects
    .filter(subject =>
      subject.category === "専門科目" &&
      countsAs(subject, projected)
    )
    .forEach(subject => {
      data.total += subject.credits;

      if (subject.type === "必修") {
        data.required +=
          subject.credits;
      }

      if (subject.type === "選択必修") {
        data.elective +=
          subject.credits;
      }

      if (subject.group === "基幹科目") {
        data.coreCredits +=
          subject.credits;

        data.coreCount += 1;
      }
    });

  return data;
}


/*
各区分の達成判定
*/
function basicOK(
  data,
  eligibility = false
) {
  const requirement =
    eligibility
      ? graduationRequirements.eligibility
      : graduationRequirements
          .graduation
          .basicEducation;

  return (
    data.total >=
      (
        eligibility
          ? requirement.basicEducation
          : requirement.total
      ) &&

    (
      eligibility ||
      data.philosophy >=
        requirement.philosophy
    ) &&

    data.international >=
      requirement.international &&

    data.foreignLanguage >=
      requirement.foreignLanguage &&

    data.technicalRequired >=
      requirement.technicalEnglishRequired &&

    data.technicalElective >=
      requirement.technicalEnglishElective
  );
}


function scienceOK(data) {
  const requirement =
    graduationRequirements
      .graduation
      .scienceFoundation;

  return (
    data.total >= requirement.total &&

    data.mathRequired >=
      requirement.mathematics.required &&

    data.mathElective >=
      requirement.mathematics.requiredElective &&

    data.physicsRequired >=
      requirement.physics.required &&

    data.physicsElective >=
      requirement.physics.requiredElective &&

    data.chemistry >=
      requirement.chemistry.minimum &&

    data.information >=
      requirement.information.required
  );
}


function professionalOK(
  data,
  eligibility = false
) {
  const requirement =
    eligibility
      ? graduationRequirements
          .eligibility
          .professional
      : graduationRequirements
          .graduation
          .professional;

  return (
    data.total >= requirement.total &&

    data.required >=
      requirement.required &&

    data.elective >=
      requirement.requiredElective &&

    data.coreCredits >=
      requirement.coreCredits &&

    data.coreCount >=
      requirement.coreSubjects
  );
}


/*
区分ごとの画面表示
*/
function renderCategory(
  current,
  projected
) {
  const basicRequirement =
    graduationRequirements
      .graduation
      .basicEducation;

  $("basicCredits").textContent =
    current.basic.total;

  $("basicInProgress").textContent =
    `履修中 +${
      projected.basic.total -
      current.basic.total
    }単位`;

  $("philosophyCredits").textContent =
    current.basic.philosophy;

  $("internationalCredits").textContent =
    current.basic.international;

  $("foreignLanguageCredits").textContent =
    current.basic.foreignLanguage;

  $("technicalRequiredCredits").textContent =
    current.basic.technicalRequired;

  $("technicalElectiveCredits").textContent =
    current.basic.technicalElective;

  $("philosophyRemaining").textContent =
    remainingText(
      current.basic.philosophy,
      basicRequirement.philosophy
    );

  $("internationalRemaining").textContent =
    remainingText(
      current.basic.international,
      basicRequirement.international
    );

  $("foreignLanguageRemaining").textContent =
    remainingText(
      current.basic.foreignLanguage,
      basicRequirement.foreignLanguage
    );

  $("technicalRequiredRemaining").textContent =
    remainingText(
      current.basic.technicalRequired,
      basicRequirement.technicalEnglishRequired
    );

  $("technicalElectiveRemaining").textContent =
    remainingText(
      current.basic.technicalElective,
      basicRequirement.technicalEnglishElective
    );

  $("basicProgressBar").style.width =
    `${Math.min(
      current.basic.total /
      basicRequirement.total *
      100,
      100
    )}%`;

  setStatus(
    "basicStatus",
    basicOK(current.basic),
    "✓ 基盤教育科目の条件を満たしています",
    basicOK(projected.basic)
      ? "履修中を修得すると条件達成見込みです"
      : "基盤教育科目に未達成の条件があります"
  );


  const scienceRequirement =
    graduationRequirements
      .graduation
      .scienceFoundation;

  $("scienceCredits").textContent =
    current.science.total;

  $("scienceInProgress").textContent =
    `履修中 +${
      projected.science.total -
      current.science.total
    }単位`;

  $("mathRequired").textContent =
    current.science.mathRequired;

  $("mathElective").textContent =
    current.science.mathElective;

  $("physicsRequired").textContent =
    current.science.physicsRequired;

  $("physicsElective").textContent =
    current.science.physicsElective;

  $("chemistryCredits").textContent =
    current.science.chemistry;

  $("informationRequired").textContent =
    current.science.information;

  $("mathRequiredRemaining").textContent =
    remainingText(
      current.science.mathRequired,
      scienceRequirement.mathematics.required
    );

  $("mathElectiveRemaining").textContent =
    remainingText(
      current.science.mathElective,
      scienceRequirement
        .mathematics
        .requiredElective
    );

  $("physicsRequiredRemaining").textContent =
    remainingText(
      current.science.physicsRequired,
      scienceRequirement.physics.required
    );

  $("physicsElectiveRemaining").textContent =
    remainingText(
      current.science.physicsElective,
      scienceRequirement
        .physics
        .requiredElective
    );

  $("chemistryRemaining").textContent =
    remainingText(
      current.science.chemistry,
      scienceRequirement.chemistry.minimum
    );

  $("informationRemaining").textContent =
    remainingText(
      current.science.information,
      scienceRequirement.information.required
    );

  $("scienceProgressBar").style.width =
    `${Math.min(
      current.science.total /
      scienceRequirement.total *
      100,
      100
    )}%`;

  setStatus(
    "scienceStatus",
    scienceOK(current.science),
    "✓ 理工学基盤科目の条件を満たしています",
    scienceOK(projected.science)
      ? "履修中を修得すると条件達成見込みです"
      : "理工学基盤科目に未達成の条件があります"
  );


  const professionalRequirement =
    graduationRequirements
      .graduation
      .professional;

  $("professionalCredits").textContent =
    current.professional.total;

  $("professionalInProgress").textContent =
    `履修中 +${
      projected.professional.total -
      current.professional.total
    }単位`;

  $("professionalRequired").textContent =
    current.professional.required;

  $("professionalElective").textContent =
    current.professional.elective;

  $("coreCount").textContent =
    current.professional.coreCount;

  $("professionalRequiredRemaining").textContent =
    remainingText(
      current.professional.required,
      professionalRequirement.required
    );

  $("professionalElectiveRemaining").textContent =
    remainingText(
      current.professional.elective,
      professionalRequirement.requiredElective
    );

  $("coreRemaining").textContent =
    remainingText(
      current.professional.coreCount,
      professionalRequirement.coreSubjects,
      "科目"
    );

  $("professionalProgressBar").style.width =
    `${Math.min(
      current.professional.total /
      professionalRequirement.total *
      100,
      100
    )}%`;

  setStatus(
    "professionalStatus",
    professionalOK(current.professional),
    "✓ 専門科目の条件を満たしています",
    professionalOK(projected.professional)
      ? "履修中を修得すると条件達成見込みです"
      : "専門科目に未達成の条件があります"
  );
}


/*
卒業判定
*/
function graduationOK(data) {
  return (
    data.total >=
      graduationRequirements.graduation.total &&

    basicOK(data.basic) &&
    scienceOK(data.science) &&
    professionalOK(data.professional)
  );
}


/*
卒着判定
*/
function eligibilityOK(data) {
  const requirement =
    graduationRequirements.eligibility;

  return (
    data.total >= requirement.total &&

    basicOK(data.basic, true) &&

    data.science.total >=
      requirement.scienceFoundation &&

    professionalOK(
      data.professional,
      true
    )
  );
}


/*
卒業・卒着の画面表示
*/
function renderOverall(
  current,
  projected
) {
  const graduationRequirement =
    graduationRequirements.graduation;

  $("graduationTotal").textContent =
    current.total;

  $("graduationBasic").textContent =
    current.basic.total;

  $("graduationScience").textContent =
    current.science.total;

  $("graduationProfessional").textContent =
    current.professional.total;

  $("graduationTotalRemaining").textContent =
    remainingText(
      current.total,
      graduationRequirement.total
    );

  const graduationNow =
    graduationOK(current);

  const graduationProjected =
    graduationOK(projected);

  setStatus(
    "graduationOverallStatus",
    graduationNow,
    "卒業要件達成",
    graduationProjected
      ? "達成見込み"
      : "未達成あり"
  );

  setStatus(
    "graduationOverallMessage",
    graduationNow,
    "修得済み科目で卒業要件を満たしています。",
    graduationProjected
      ? `履修中をすべて修得すると${projected.total}単位となり、卒業要件達成見込みです。`
      : `現在${current.total}単位、履修中を含めると${projected.total}単位です。`
  );


  const eligibilityRequirement =
    graduationRequirements.eligibility;

  const professionalRequirement =
    eligibilityRequirement.professional;

  $("eligibilityTotal").textContent =
    current.total;

  $("eligibilityBasic").textContent =
    current.basic.total;

  $("eligibilityScience").textContent =
    current.science.total;

  $("eligibilityProfessional").textContent =
    current.professional.total;

  $("eligibilityRequired").textContent =
    current.professional.required;

  $("eligibilityElective").textContent =
    current.professional.elective;

  $("eligibilityCore").textContent =
    current.professional.coreCredits;

  $("eligibilityTotalRemaining").textContent =
    remainingText(
      current.total,
      eligibilityRequirement.total
    );

  $("eligibilityBasicRemaining").textContent =
    remainingText(
      current.basic.total,
      eligibilityRequirement.basicEducation
    );

  $("eligibilityScienceRemaining").textContent =
    remainingText(
      current.science.total,
      eligibilityRequirement.scienceFoundation
    );

  $("eligibilityProfessionalRemaining").textContent =
    remainingText(
      current.professional.total,
      professionalRequirement.total
    );

  $("eligibilityRequiredRemaining").textContent =
    remainingText(
      current.professional.required,
      professionalRequirement.required
    );

  $("eligibilityElectiveRemaining").textContent =
    remainingText(
      current.professional.elective,
      professionalRequirement.requiredElective
    );

  $("eligibilityCoreRemaining").textContent =
    remainingText(
      current.professional.coreCredits,
      professionalRequirement.coreCredits
    );

  const eligibilityNow =
    eligibilityOK(current);

  const eligibilityProjected =
    eligibilityOK(projected);

  setStatus(
    "eligibilityStatus",
    eligibilityNow,
    "卒着条件達成",
    eligibilityProjected
      ? "達成見込み"
      : "未達成あり"
  );

  setStatus(
    "eligibilityMessage",
    eligibilityNow,
    "修得済み科目で卒着条件を満たしています。",
    eligibilityProjected
      ? `履修中をすべて修得すると${projected.total}単位となり、卒着条件達成見込みです。`
      : `現在${current.total}単位、履修中を含めると${projected.total}単位です。`
  );
}


/*
未修得必修科目
*/
function showMissingRequired() {
  const missing =
    subjects.filter(subject =>
      subject.type === "必修" &&
      statusOf(subject) !== "completed"
    );

  if (missing.length === 0) {
    $("missingRequiredList").innerHTML = `
      <div class="all-completed">
        ✓ 登録されている必修科目は
        すべて修得済みです
      </div>
    `;

    return;
  }

  $("missingRequiredList").innerHTML = `
    <div class="missing-grid">

      ${missing.map(subject => `
        <div class="missing-card">

          <div>
            <strong>
              ${subject.name}
            </strong>

            <span>
              ${
                statusOf(subject) === "in-progress"
                  ? "履修中"
                  : `${subject.category}・${subject.year}年`
              }
            </span>
          </div>

          <span>
            ${subject.credits}単位
          </span>

        </div>
      `).join("")}

    </div>
  `;
}


/*
現在・履修中込みのデータ作成
*/
function makeData(projected) {
  const data = {
    basic:
      basicData(projected),

    science:
      scienceData(projected),

    professional:
      professionalData(projected)
  };

  data.total =
    data.basic.total +
    data.science.total +
    data.professional.total;

  return data;
}


/*
全体を再計算
*/
function calculateAll() {
  const current =
    makeData(false);

  const projected =
    makeData(true);

  renderCategory(
    current,
    projected
  );

  renderOverall(
    current,
    projected
  );

  showMissingRequired();
}


/*
科目区分フィルター
*/
document
  .querySelectorAll(".category-tab")
  .forEach(tab => {
    tab.addEventListener("click", () => {
      document
        .querySelectorAll(".category-tab")
        .forEach(button => {
          button.classList.remove("active");
        });

      tab.classList.add("active");

      selectedCategory =
        tab.dataset.category;

      displaySubjects();
    });
  });


/*
学年フィルター
*/
document
  .querySelectorAll(".year-tab")
  .forEach(tab => {
    tab.addEventListener("click", () => {
      document
        .querySelectorAll(".year-tab")
        .forEach(button => {
          button.classList.remove("active");
        });

      tab.classList.add("active");

      selectedYear =
        tab.dataset.year;

      displaySubjects();
    });
  });


/*
起動
*/
addStatusStyles();
addProgressNotes();
displaySubjects();
calculateAll();