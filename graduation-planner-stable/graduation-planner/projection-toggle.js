(() => {
  let includePlanned =
    localStorage.getItem(
      "includePlanned"
    ) === "true";


  /*
  スイッチのデザイン
  */
  const style =
    document.createElement("style");

  style.textContent = `
    .planner-actions {
      display: flex;
      align-items: center;
      gap: 9px;
      flex-wrap: wrap;
    }

    .projection-toggle {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 11px;
      background: #ffffff;
      border: 1px solid #e3dcf8;
      border-radius: 9px;
      color: #5f6570;
      font-size: 11px;
      font-weight: 700;
      cursor: pointer;
      user-select: none;
    }

    .projection-toggle input {
      position: absolute;
      opacity: 0;
      pointer-events: none;
    }

    .toggle-track {
      position: relative;
      width: 34px;
      height: 19px;
      border-radius: 20px;
      background: #ccd1d9;
      transition: 0.2s;
    }

    .toggle-track::after {
      content: "";
      position: absolute;
      top: 3px;
      left: 3px;
      width: 13px;
      height: 13px;
      border-radius: 50%;
      background: #ffffff;
      box-shadow:
        0 1px 3px rgba(0, 0, 0, 0.2);
      transition: 0.2s;
    }

    .projection-toggle
    input:checked
    + .toggle-track {
      background: #7257c7;
    }

    .projection-toggle
    input:checked
    + .toggle-track::after {
      transform: translateX(15px);
    }

    @media (max-width: 650px) {
      .planner-actions {
        width: 100%;
        justify-content: space-between;
      }
    }
  `;

  document.head.appendChild(style);


  /*
  基盤教育へ予定科目を加算
  */
  function addBasic(
    data,
    subject
  ) {
    data.total += subject.credits;

    if (
      subject.field === "哲学・思想"
    ) {
      data.philosophy +=
        subject.credits;
    }

    if (
      subject.field ===
        "Technical English" ||
      subject.field ===
        "国際人の形成"
    ) {
      data.international +=
        subject.credits;
    }

    if (
      subject.field ===
      "Technical English"
    ) {
      data.foreignLanguage +=
        subject.credits;

      if (subject.type === "必修") {
        data.technicalRequired +=
          subject.credits;
      }

      if (
        subject.type === "選択必修"
      ) {
        data.technicalElective +=
          subject.credits;
      }
    }
  }


  /*
  理工学基盤へ予定科目を加算
  */
  function addScience(
    data,
    subject
  ) {
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
  }


  /*
  専門科目へ予定科目を加算
  */
  function addProfessional(
    data,
    subject
  ) {
    data.total += subject.credits;

    if (subject.type === "必修") {
      data.required +=
        subject.credits;
    }

    if (
      subject.type === "選択必修"
    ) {
      data.elective +=
        subject.credits;
    }

    if (
      subject.group === "基幹科目"
    ) {
      data.coreCredits +=
        subject.credits;

      data.coreCount += 1;
    }
  }


  /*
  見込みデータへ履修予定を追加
  */
  const originalMakeData =
    makeData;

  makeData =
    function(projected) {
      const data =
        originalMakeData(projected);

      if (
        !projected ||
        !includePlanned
      ) {
        return data;
      }

      subjects
        .filter(
          subject =>
            statusOf(subject) ===
            "planned"
        )
        .forEach(subject => {
          data.total +=
            subject.credits;

          if (
            subject.category ===
            "基盤教育科目"
          ) {
            addBasic(
              data.basic,
              subject
            );
          }

          if (
            subject.category ===
            "理工学基盤科目"
          ) {
            addScience(
              data.science,
              subject
            );
          }

          if (
            subject.category ===
            "専門科目"
          ) {
            addProfessional(
              data.professional,
              subject
            );
          }
        });

      return data;
    };


  /*
  上部の取得・見込み表示
  */
  const originalRenderCategory =
    renderCategory;

  renderCategory =
    function(
      current,
      projected
    ) {
      originalRenderCategory(
        current,
        projected
      );

      const label =
        includePlanned
          ? "履修中・予定"
          : "履修中";

      document
        .getElementById(
          "basicInProgress"
        )
        .textContent =
          `${label} +${
            projected.basic.total -
            current.basic.total
          }単位`;

      document
        .getElementById(
          "scienceInProgress"
        )
        .textContent =
          `${label} +${
            projected.science.total -
            current.science.total
          }単位`;

      document
        .getElementById(
          "professionalInProgress"
        )
        .textContent =
          `${label} +${
            projected.professional.total -
            current.professional.total
          }単位`;
    };


  /*
  卒業条件・卒着条件の数字を切り替える
  */
  const originalRenderOverall =
    renderOverall;

  renderOverall =
    function(
      current,
      projected
    ) {
      originalRenderOverall(
        current,
        projected
      );

      const displayed =
        includePlanned
          ? projected
          : current;


      /*
      卒業条件
      */
      document
        .getElementById(
          "graduationTotal"
        )
        .textContent =
          displayed.total;

      document
        .getElementById(
          "graduationBasic"
        )
        .textContent =
          displayed.basic.total;

      document
        .getElementById(
          "graduationScience"
        )
        .textContent =
          displayed.science.total;

      document
        .getElementById(
          "graduationProfessional"
        )
        .textContent =
          displayed.professional.total;

      document
        .getElementById(
          "graduationTotalRemaining"
        )
        .textContent =
          remainingText(
            displayed.total,
            graduationRequirements
              .graduation
              .total
          );


      /*
      卒着条件
      */
      const requirement =
        graduationRequirements
          .eligibility;

      const professionalRequirement =
        requirement.professional;

      document
        .getElementById(
          "eligibilityTotal"
        )
        .textContent =
          displayed.total;

      document
        .getElementById(
          "eligibilityBasic"
        )
        .textContent =
          displayed.basic.total;

      document
        .getElementById(
          "eligibilityScience"
        )
        .textContent =
          displayed.science.total;

      document
        .getElementById(
          "eligibilityProfessional"
        )
        .textContent =
          displayed.professional.total;

      document
        .getElementById(
          "eligibilityRequired"
        )
        .textContent =
          displayed.professional.required;

      document
        .getElementById(
          "eligibilityElective"
        )
        .textContent =
          displayed.professional.elective;

      document
        .getElementById(
          "eligibilityCore"
        )
        .textContent =
          displayed.professional.coreCredits;

      document
        .getElementById(
          "eligibilityTotalRemaining"
        )
        .textContent =
          remainingText(
            displayed.total,
            requirement.total
          );

      document
        .getElementById(
          "eligibilityBasicRemaining"
        )
        .textContent =
          remainingText(
            displayed.basic.total,
            requirement.basicEducation
          );

      document
        .getElementById(
          "eligibilityScienceRemaining"
        )
        .textContent =
          remainingText(
            displayed.science.total,
            requirement.scienceFoundation
          );

      document
        .getElementById(
          "eligibilityProfessionalRemaining"
        )
        .textContent =
          remainingText(
            displayed.professional.total,
            professionalRequirement.total
          );

      document
        .getElementById(
          "eligibilityRequiredRemaining"
        )
        .textContent =
          remainingText(
            displayed.professional.required,
            professionalRequirement.required
          );

      document
        .getElementById(
          "eligibilityElectiveRemaining"
        )
        .textContent =
          remainingText(
            displayed.professional.elective,
            professionalRequirement
              .requiredElective
          );

      document
        .getElementById(
          "eligibilityCoreRemaining"
        )
        .textContent =
          remainingText(
            displayed.professional.coreCredits,
            professionalRequirement.coreCredits
          );


      /*
      予定込みの説明へ変更
      */
      if (includePlanned) {
        [
          "graduationOverallMessage",
          "eligibilityMessage"
        ].forEach(id => {
          const element =
            document.getElementById(id);

          element.textContent =
            element.textContent
              .replace(
                "履修中をすべて修得すると",
                "履修中・履修予定をすべて修得すると"
              )
              .replace(
                "履修中を含めると",
                "履修中・履修予定を含めると"
              );
        });
      }
    };


  /*
  履修計画右上へスイッチを追加
  */
  const totalBadge =
    document.getElementById(
      "plannedTotal"
    );

  const actions =
    document.createElement("div");

  actions.className =
    "planner-actions";

  totalBadge.parentElement.insertBefore(
    actions,
    totalBadge
  );

  actions.appendChild(
    totalBadge
  );


  const toggle =
    document.createElement("label");

  toggle.className =
    "projection-toggle";

  toggle.innerHTML = `
    <input
      id="includePlannedToggle"
      type="checkbox"
      ${
        includePlanned
          ? "checked"
          : ""
      }
    >

    <span class="toggle-track"></span>

    <span>
      予定を合計に含める
    </span>
  `;

  actions.appendChild(toggle);


  /*
  スイッチ切り替え
  */
  document
    .getElementById(
      "includePlannedToggle"
    )
    .addEventListener(
      "change",
      event => {
        includePlanned =
          event.target.checked;

        localStorage.setItem(
          "includePlanned",
          String(includePlanned)
        );

        calculateAll();
      }
    );


  calculateAll();

})();