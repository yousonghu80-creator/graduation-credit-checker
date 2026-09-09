(() => {
  const header = document.querySelector(".header-inner");
  const universityYear = document.querySelector(".university span");
  if (!header || !universityYear) return;

  universityYear.textContent = `${academicYear}年度入学生`;

  const picker = document.createElement("label");
  picker.className = "academic-year-picker";
  picker.innerHTML = `
    <span>入学年度</span>
    <select aria-label="入学年度を切り替える">
      <option value="2024" ${academicYear === 2024 ? "selected" : ""}>2024年度</option>
      <option value="2025" ${academicYear === 2025 ? "selected" : ""}>2025年度</option>
    </select>
  `;
  header.appendChild(picker);

  picker.querySelector("select").addEventListener("change", event => {
    setAcademicYear(event.target.value);
  });

  const style = document.createElement("style");
  style.textContent = `
    .academic-year-picker {
      display: inline-flex;
      align-items: center;
      gap: 9px;
      margin-top: 17px;
      padding: 7px 8px 7px 12px;
      border: 1px solid rgba(255, 255, 255, 0.18);
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.09);
      color: rgba(255, 255, 255, 0.75);
      font-size: 11px;
      font-weight: 700;
    }

    .academic-year-picker select {
      min-height: 34px;
      padding: 5px 28px 5px 9px;
      border: 0;
      border-radius: 7px;
      background: #fff;
      color: #123a73;
      font: inherit;
      font-size: 12px;
      font-weight: 800;
      cursor: pointer;
    }

    @media (max-width: 430px) {
      .academic-year-picker { width: 100%; justify-content: space-between; }
    }
  `;
  document.head.appendChild(style);

  if (academicYear !== 2025) return;

  const basicSection = document.getElementById("basicCredits")?.closest("section");
  const basicHeading = basicSection?.querySelector("h2");
  const basicSmall = document.getElementById("basicCredits")?.parentElement.querySelector("small");
  const graduationBasicSmall = document.getElementById("graduationBasic")?.parentElement.querySelector("small");
  const eligibilityBasicSmall = document.getElementById("eligibilityBasic")?.parentElement.querySelector("small");

  if (basicHeading) basicHeading.textContent = "基盤・共通教育科目";
  if (basicSmall) basicSmall.textContent = "/ 22";
  if (graduationBasicSmall) graduationBasicSmall.textContent = "/ 22";
  if (eligibilityBasicSmall) eligibilityBasicSmall.textContent = "/ 20";

  document.querySelector('[data-category="基盤教育科目"]')?.replaceChildren("基盤・共通教育");

  const grid = basicSection?.querySelector(".status-grid");
  if (grid) {
    grid.insertAdjacentHTML("afterbegin", `
      <div class="status-card">
        <p>全学基盤教育</p>
        <strong><span id="foundationCredits">0</span><small>/ 12単位</small></strong>
        <span id="foundationRemaining" class="remaining"></span>
      </div>
      <div class="status-card">
        <p>全学共通教育</p>
        <strong><span id="commonCredits">0</span><small>/ 10単位</small></strong>
        <span id="commonRemaining" class="remaining"></span>
      </div>
    `);
  }

  function renderYearDetails() {
    const totals = subjects.reduce((result, subject) => {
      if (subject.category !== "基盤教育科目" || statusOf(subject) !== "completed") return result;
      if (subject.educationGroup === "foundation") result.foundation += subject.credits;
      if (subject.educationGroup === "common") result.common += subject.credits;
      return result;
    }, { foundation: 0, common: 0 });

    document.getElementById("foundationCredits").textContent = totals.foundation;
    document.getElementById("commonCredits").textContent = totals.common;
    document.getElementById("foundationRemaining").textContent = remainingText(totals.foundation, 12);
    document.getElementById("commonRemaining").textContent = remainingText(totals.common, 10);
  }

  document.addEventListener("change", event => {
    if (event.target.matches(".subject-status-select, .required-inline-status")) {
      setTimeout(renderYearDetails, 0);
    }
  });
  document.addEventListener("planner:data-changed", renderYearDetails);
  renderYearDetails();
})();
