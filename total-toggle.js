(() => {
  let includeInProgress =
    localStorage.getItem("includeInProgress") === "true";

  function addSubject(data, subject) {
    const credits = subject.credits;

    data.total += credits;

    if (subject.category === "基盤教育科目") {
      const basic = data.basic;

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
      const science = data.science;

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
      const professional = data.professional;

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

  function createDisplayedData(current) {
    const data =
      JSON.parse(JSON.stringify(current));

    const includePlanned =
      localStorage.getItem("includePlanned") === "true";

    subjects.forEach(subject => {
      const status = statusOf(subject);

      if (
        status === "in-progress" &&
        includeInProgress
      ) {
        addSubject(data, subject);
      }

      if (
        status === "planned" &&
        includePlanned
      ) {
        addSubject(data, subject);
      }
    });

    return data;
  }

  const previousRenderOverall = renderOverall;

  renderOverall = function(current) {
    const displayed =
      createDisplayedData(current);

    previousRenderOverall(
      displayed,
      displayed
    );
  };

  const actions =
    document.querySelector(".planner-actions");

  if (!actions) {
    console.error("履修計画の操作欄が見つかりません。");
    return;
  }

  const toggle =
    document.createElement("label");

  toggle.className = "projection-toggle";

  toggle.innerHTML = `
    <input
      id="includeInProgressToggle"
      type="checkbox"
      ${includeInProgress ? "checked" : ""}
    >

    <span class="toggle-track"></span>

    <span>
      履修中を合計に含める
    </span>
  `;

  const plannedToggle =
    actions.querySelector(".projection-toggle");

  actions.insertBefore(
    toggle,
    plannedToggle
  );

  document
    .getElementById("includeInProgressToggle")
    .addEventListener("change", event => {
      includeInProgress =
        event.target.checked;

      localStorage.setItem(
        "includeInProgress",
        String(includeInProgress)
      );

      calculateAll();
    });

  calculateAll();
})();