(() => {
  const style = document.createElement("style");
  style.textContent = `
    .sequence-panel {
      margin: 0 0 24px;
      padding: 18px;
      border: 1px solid #e5e8ee;
      border-radius: 15px;
      background: #fff;
    }

    .sequence-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 14px;
    }

    .sequence-header h3 { margin: 0; font-size: 17px; }
    .sequence-header p,
    .sequence-note { margin: 5px 0 0; color: #707987; font-size: 12px; line-height: 1.65; }

    .sequence-count {
      padding: 8px 11px;
      border-radius: 999px;
      background: #eef8f4;
      color: #16805c;
      font-size: 12px;
      font-weight: 700;
      white-space: nowrap;
    }

    .sequence-count.warning { background: #fff4e2; color: #a86100; }
    .sequence-list { display: grid; gap: 9px; margin-top: 13px; }

    .sequence-item {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 10px 16px;
      padding: 13px;
      border: 1px solid #f0d6a7;
      border-radius: 11px;
      background: #fffaf1;
    }

    .sequence-route { color: #303947; font-size: 13px; font-weight: 700; }
    .sequence-reason { margin: 4px 0 0; color: #8b650f; font-size: 12px; line-height: 1.55; }

    .sequence-status-select,
    .sequence-fix-button {
      align-self: center;
      min-height: 36px;
      padding: 7px 10px;
      border: 1px solid #ddc38e;
      border-radius: 9px;
      background: #fff;
      color: #79570c;
      font: inherit;
      font-size: 12px;
      cursor: pointer;
    }

    .sequence-fix-button { grid-column: 2; font-weight: 700; }
    .sequence-clear { margin-top: 13px; padding: 13px; border-radius: 11px; background: #f2faf6; color: #27765c; font-size: 13px; }

    @media (max-width: 650px) {
      .sequence-header { flex-direction: column; }
      .sequence-item { grid-template-columns: 1fr; }
      .sequence-status-select,
      .sequence-fix-button { grid-column: 1; width: 100%; }
    }
  `;
  document.head.appendChild(style);

  const panel = document.createElement("section");
  panel.className = "sequence-panel";
  panel.setAttribute("aria-labelledby", "sequenceTitle");
  document.querySelector(".pace-panel").insertAdjacentElement("afterend", panel);

  const courseTerms = PaceEngine.courseTerms(academicYear);
  const currentTerm = PaceEngine.currentTerm();

  function termRank(term) {
    const index = courseTerms.indexOf(term);
    return index < 0 ? Number.POSITIVE_INFINITY : index;
  }

  function plannedTerm(code) {
    return appStorage.readObject("plannedTerms")[code] || currentTerm;
  }

  function issueFor(before, after) {
    const beforeStatus = statusOf(before);
    const afterStatus = statusOf(after);

    if (afterStatus === "not-taken" || beforeStatus === "completed") return null;

    if (afterStatus === "completed") {
      return { kind: "record", reason: `${after.name}は修得済みですが、${before.name}が修得済みになっていません。記録を確認してください。` };
    }

    if (afterStatus === "in-progress") {
      return { kind: "missing", reason: `${after.name}を履修中です。先に${before.name}を修得しているか確認してください。` };
    }

    if (beforeStatus === "not-taken") {
      return { kind: "missing", reason: `${after.name}より先に${before.name}を計画するのがおすすめです。` };
    }

    const afterTerm = plannedTerm(after.code);
    const beforeTerm = beforeStatus === "in-progress" ? currentTerm : plannedTerm(before.code);

    if (termRank(beforeTerm) < termRank(afterTerm)) return null;

    return {
      kind: "order",
      reason: `${before.name}（${termLabel(beforeTerm)}）を、${after.name}（${termLabel(afterTerm)}）より前にしてください。`,
      canMove: termRank(beforeTerm) + 1 < courseTerms.length,
      nextTerm: courseTerms[termRank(beforeTerm) + 1]
    };
  }

  function termLabel(term) {
    const [year, semester] = term.split("-");
    return `${year}年度${semester === "spring" ? "春" : "秋"}`;
  }

  function findIssues() {
    const byCode = Object.fromEntries(subjects.map(subject => [subject.code, subject]));

    return subjectSequenceRules.flatMap(([beforeCode, afterCode]) => {
      const before = byCode[beforeCode];
      const after = byCode[afterCode];
      if (!before || !after) return [];

      const issue = issueFor(before, after);
      return issue ? [{ before, after, ...issue }] : [];
    });
  }

  function statusOptions(selected) {
    return [
      ["not-taken", "未履修"],
      ["planned", "履修予定"],
      ["in-progress", "履修中"],
      ["completed", "修得済み"]
    ].map(([value, label]) => `<option value="${value}" ${value === selected ? "selected" : ""}>${label}</option>`).join("");
  }

  function render() {
    const issues = findIssues();
    const items = issues.map(issue => `
      <div class="sequence-item">
        <div>
          <div class="sequence-route">${issue.before.name} → ${issue.after.name}</div>
          <p class="sequence-reason">${issue.reason}</p>
        </div>
        <select class="sequence-status-select" data-code="${issue.before.code}" data-after-code="${issue.after.code}" aria-label="${issue.before.name}の履修状況">
          ${statusOptions(statusOf(issue.before))}
        </select>
        ${issue.kind === "order" && issue.canMove ? `<button class="sequence-fix-button" type="button" data-move-code="${issue.after.code}" data-next-term="${issue.nextTerm}">${issue.after.name}を${termLabel(issue.nextTerm)}へ移す</button>` : ""}
      </div>
    `).join("");

    panel.innerHTML = `
      <div class="sequence-header">
        <div>
          <h3 id="sequenceTitle">履修順の確認</h3>
          <p>Ⅰ・Ⅱなど、段階がある科目の計画順を確認します。</p>
        </div>
        <span class="sequence-count ${issues.length ? "warning" : ""}">${issues.length ? `${issues.length}件を確認` : "順番に問題なし"}</span>
      </div>
      ${items ? `<div class="sequence-list">${items}</div>` : `<div class="sequence-clear">現在の履修計画に、順番が逆になっている科目はありません。</div>`}
      <p class="sequence-note">※ 科目名と配当順から見た学習順の目安です。正式な履修条件は最新のシラバスを確認してください。</p>
    `;
  }

  panel.addEventListener("change", event => {
    const select = event.target.closest(".sequence-status-select");
    if (!select) return;

    const code = select.dataset.code;
    const value = select.value;
    const plannedTerms = appStorage.readObject("plannedTerms");
    const scheduleData = appStorage.readObject("scheduleData");

    if (value === "not-taken") delete subjectStatuses[code];
    else subjectStatuses[code] = value;

    if (value === "planned") {
      const afterTerm = plannedTerm(select.dataset.afterCode);
      const afterIndex = termRank(afterTerm);
      const currentIndex = Math.max(0, termRank(currentTerm));
      const suggestedIndex = Math.max(currentIndex, afterIndex - 1);
      plannedTerms[code] = courseTerms[suggestedIndex] || currentTerm;
    } else {
      delete plannedTerms[code];
    }

    if (["not-taken", "completed"].includes(value)) delete scheduleData[code];

    appStorage.writeObject("subjectStatuses", subjectStatuses);
    appStorage.writeObject("plannedTerms", plannedTerms);
    appStorage.writeObject("scheduleData", scheduleData);
    localStorage.removeItem("completedSubjects");
    displaySubjects();
    calculateAll();
    document.dispatchEvent(new CustomEvent("planner:data-changed"));
  });

  panel.addEventListener("click", event => {
    const button = event.target.closest(".sequence-fix-button");
    if (!button) return;

    const plannedTerms = appStorage.readObject("plannedTerms");
    plannedTerms[button.dataset.moveCode] = button.dataset.nextTerm;
    appStorage.writeObject("plannedTerms", plannedTerms);
    document.dispatchEvent(new CustomEvent("planner:data-changed"));
  });

  document.addEventListener("planner:data-changed", render);
  render();
})();
