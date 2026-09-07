(() => {
  const main = document.querySelector("main");
  const summary = document.querySelector(".quick-summary");

  if (!main || !summary || typeof subjects === "undefined") {
    return;
  }

  const currentYear = new Date().getFullYear();
  const defaultTerm =
    `${currentYear}-${new Date().getMonth() < 7 ? "spring" : "fall"}`;

  const section = document.createElement("section");
  section.className = "next-actions-section";
  section.innerHTML = `
    <div class="next-actions-heading">
      <div>
        <p class="section-label">NEXT ACTIONS</p>
        <h2>次にやること</h2>
        <p class="next-actions-lead">
          現在の履修状況から、優先度の高い項目を表示します。
        </p>
      </div>
      <span class="next-actions-count" id="nextActionsCount"></span>
    </div>

    <div id="nextActionList" class="next-action-list"></div>

    <div class="recommend-heading">
      <div>
        <h3>おすすめ科目</h3>
        <p>未履修の必修科目を、配当学年が早い順に表示しています。</p>
      </div>
      <button type="button" class="next-view-button" data-next-view="subjects">
        科目一覧を見る
      </button>
    </div>

    <div id="recommendedSubjects" class="recommended-subjects"></div>
  `;

  summary.insertAdjacentElement("afterend", section);

  const style = document.createElement("style");
  style.textContent = `
    .next-actions-section {
      border-color: #d5e2f2;
      background: linear-gradient(145deg, #ffffff, #f7faff);
    }

    .next-actions-heading,
    .recommend-heading {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 18px;
    }

    .next-actions-lead,
    .recommend-heading p {
      margin: 6px 0 0;
      color: #748097;
      font-size: 12px;
    }

    .next-actions-count {
      flex-shrink: 0;
      padding: 7px 11px;
      border: 1px solid #d7e4f6;
      border-radius: 999px;
      background: #eef5ff;
      color: #1769e0;
      font-size: 11px;
      font-weight: 800;
    }

    .next-action-list {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 10px;
      margin-top: 18px;
    }

    .next-action-card {
      display: flex;
      align-items: flex-start;
      gap: 11px;
      min-height: 88px;
      padding: 14px;
      border: 1px solid #dfe6f0;
      border-radius: 12px;
      background: #fff;
    }

    .next-action-card.warning {
      border-color: #ecd7a1;
      background: #fffdf6;
    }

    .next-action-icon {
      display: grid;
      flex: 0 0 30px;
      width: 30px;
      height: 30px;
      place-items: center;
      border-radius: 9px;
      background: #e8f1ff;
      color: #1769e0;
      font-size: 14px;
      font-weight: 900;
    }

    .next-action-card.warning .next-action-icon {
      background: #fff0c9;
      color: #9a6200;
    }

    .next-action-card strong {
      display: block;
      margin-bottom: 3px;
      color: #152238;
      font-size: 13px;
    }

    .next-action-card p {
      margin: 0;
      color: #748097;
      font-size: 11px;
      line-height: 1.6;
    }

    .next-action-clear {
      grid-column: 1 / -1;
      padding: 14px 16px;
      border: 1px solid #bee4d2;
      border-radius: 11px;
      background: #e8f7f0;
      color: #18865b;
      font-size: 12px;
      font-weight: 700;
    }

    .recommend-heading {
      align-items: center;
      margin-top: 24px;
      padding-top: 21px;
      border-top: 1px solid #e1e8f1;
    }

    .recommend-heading h3 {
      margin: 0;
      color: #152238;
      font-size: 16px;
    }

    .next-view-button,
    .recommend-add-button {
      min-height: 38px;
      padding: 8px 12px;
      border: 1px solid #1769e0;
      border-radius: 9px;
      background: #fff;
      color: #1769e0;
      font: inherit;
      font-size: 11px;
      font-weight: 800;
      cursor: pointer;
    }

    .next-view-button:hover,
    .recommend-add-button:hover {
      background: #1769e0;
      color: #fff;
    }

    .recommended-subjects {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 9px;
      margin-top: 13px;
    }

    .recommend-card {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 13px 14px;
      border: 1px solid #dfe6f0;
      border-radius: 11px;
      background: #fff;
    }

    .recommend-card strong {
      display: block;
      color: #152238;
      font-size: 13px;
    }

    .recommend-card p {
      margin: 4px 0 0;
      color: #748097;
      font-size: 10px;
    }

    .recommend-empty {
      grid-column: 1 / -1;
      padding: 14px;
      border-radius: 10px;
      background: #eef8f3;
      color: #18865b;
      font-size: 12px;
      font-weight: 700;
    }

    @media (max-width: 760px) {
      .next-action-list {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 700px) {
      .next-actions-heading,
      .recommend-heading {
        gap: 10px;
      }

      .next-actions-count {
        margin-top: 2px;
      }

      .recommended-subjects {
        grid-template-columns: 1fr;
      }

      .recommend-card {
        align-items: flex-start;
      }
    }

    @media (max-width: 430px) {
      .recommend-heading {
        align-items: flex-start;
        flex-direction: column;
      }

      .next-view-button {
        width: 100%;
      }

      .recommend-add-button {
        flex-shrink: 0;
      }
    }
  `;
  document.head.appendChild(style);

  function activeScheduleIssues() {
    const plannedTerms = appStorage.readObject("plannedTerms");
    const schedule = appStorage.readObject("scheduleData");

    return subjects.filter(subject => {
      const status = statusOf(subject);
      if (status !== "planned" && status !== "in-progress") return false;

      const term = plannedTerms[subject.code] || schedule[subject.code]?.term;
      if (!term) return true;

      const slots = Array.isArray(schedule[subject.code]?.slots)
        ? schedule[subject.code].slots
        : [];

      return !slots.some(slot => slot?.day && slot?.period);
    });
  }

  function requiredSubjects() {
    return subjects
      .filter(subject => subject.type === "必修" && statusOf(subject) === "not-taken")
      .sort((a, b) => a.year - b.year || a.category.localeCompare(b.category, "ja"));
  }

  function render() {
    const required = requiredSubjects();
    const scheduleIssues = activeScheduleIssues();
    const inProgress = subjects.filter(subject => statusOf(subject) === "in-progress");
    const planned = subjects.filter(subject => statusOf(subject) === "planned");
    const actions = [];

    if (required.length) {
      actions.push({
        icon: "!",
        warning: true,
        title: `未履修の必修が${required.length}科目`,
        text: "卒業要件に直結します。配当学年の早い科目から計画しましょう。"
      });
    }

    if (scheduleIssues.length) {
      actions.push({
        icon: "時",
        warning: true,
        title: `時間割の未設定が${scheduleIssues.length}科目`,
        text: "曜日・時限を設定すると、時間割の重複も確認できます。"
      });
    }

    if (!planned.length && required.length) {
      actions.push({
        icon: "+",
        warning: false,
        title: "次学期の計画を作る",
        text: "下のおすすめ科目から、そのまま履修予定へ追加できます。"
      });
    } else if (planned.length) {
      const credits = planned.reduce((sum, subject) => sum + subject.credits, 0);
      actions.push({
        icon: "計",
        warning: false,
        title: `履修予定は${planned.length}科目・${credits}単位`,
        text: "計画・時間割画面で学期ごとの偏りを確認しましょう。"
      });
    }

    if (inProgress.length) {
      const credits = inProgress.reduce((sum, subject) => sum + subject.credits, 0);
      actions.push({
        icon: "進",
        warning: false,
        title: `現在${credits}単位を履修中`,
        text: "単位を取得したら「修得済み」に変更してください。"
      });
    }

    const list = document.getElementById("nextActionList");
    const count = document.getElementById("nextActionsCount");

    count.textContent = actions.length ? `${actions.length}件` : "良好";
    list.innerHTML = actions.length
      ? actions.slice(0, 3).map(action => `
          <article class="next-action-card${action.warning ? " warning" : ""}">
            <span class="next-action-icon">${action.icon}</span>
            <div>
              <strong>${action.title}</strong>
              <p>${action.text}</p>
            </div>
          </article>
        `).join("")
      : `<div class="next-action-clear">今すぐ対応が必要な項目はありません。</div>`;

    const recommended = document.getElementById("recommendedSubjects");
    recommended.innerHTML = required.length
      ? required.slice(0, 4).map(subject => `
          <article class="recommend-card">
            <div>
              <strong>${subject.name}</strong>
              <p>${subject.year}年配当・${subject.category.replace("科目", "")}・${subject.credits}単位</p>
            </div>
            <button
              type="button"
              class="recommend-add-button"
              data-recommend-code="${subject.code}"
            >履修予定に追加</button>
          </article>
        `).join("")
      : `<div class="recommend-empty">未履修の必修科目はありません。</div>`;
  }

  section.addEventListener("click", event => {
    const viewButton = event.target.closest("[data-next-view]");
    if (viewButton) {
      document.querySelector(`button[data-view="${viewButton.dataset.nextView}"]`)?.click();
      return;
    }

    const addButton = event.target.closest("[data-recommend-code]");
    if (!addButton) return;

    const code = addButton.dataset.recommendCode;
    const plannedTerms = appStorage.readObject("plannedTerms");
    subjectStatuses[code] = "planned";
    plannedTerms[code] =
      plannedTerms[code] || localStorage.getItem("timetableTerm") || defaultTerm;

    localStorage.setItem("subjectStatuses", JSON.stringify(subjectStatuses));
    localStorage.setItem("plannedTerms", JSON.stringify(plannedTerms));
    localStorage.removeItem("completedSubjects");

    if (typeof displaySubjects === "function") displaySubjects();
    if (typeof calculateAll === "function") calculateAll();
    document.dispatchEvent(new CustomEvent("planner:data-changed"));
    render();
  });

  document.addEventListener("planner:data-changed", render);
  document.addEventListener("change", event => {
    if (event.target.matches(".subject-status-select, .required-inline-status")) {
      setTimeout(render, 0);
    }
  });

  window.addEventListener("storage", render);
  render();
})();
