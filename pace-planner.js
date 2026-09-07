(() => {
  const CREDIT_CAP = 24;

  const style = document.createElement("style");
  style.textContent = `
    .pace-panel {
      margin: 0 0 24px;
      padding: 18px;
      border: 1px solid #dce7ff;
      border-radius: 15px;
      background: linear-gradient(135deg, #f5f9ff, #f8f6ff);
    }

    .pace-heading,
    .pace-overview {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 14px;
    }

    .pace-heading h3 { margin: 0; font-size: 17px; }
    .pace-heading p,
    .pace-note { margin: 5px 0 0; color: #6f7785; font-size: 12px; line-height: 1.65; }

    .pace-badge {
      padding: 8px 11px;
      border-radius: 999px;
      background: #fff;
      color: #2775ff;
      font-size: 12px;
      font-weight: 700;
      white-space: nowrap;
    }

    .pace-badge.complete { color: #16805c; background: #eefaf5; }
    .pace-badge.warning { color: #a86100; background: #fff7e8; }

    .pace-overview {
      margin-top: 14px;
      padding: 14px;
      border-radius: 12px;
      background: #fff;
    }

    .pace-stat span { display: block; color: #747c89; font-size: 12px; }
    .pace-stat strong { display: block; margin-top: 4px; font-size: 22px; }
    .pace-stat strong small { font-size: 12px; color: #747c89; }

    .pace-meter {
      flex: 1;
      max-width: 330px;
      min-width: 180px;
      align-self: center;
    }

    .pace-meter-track { height: 9px; overflow: hidden; border-radius: 999px; background: #edf1f7; }
    .pace-meter-fill { height: 100%; border-radius: inherit; background: linear-gradient(90deg, #2775ff, #7b61d1); }
    .pace-meter-label { margin-top: 6px; color: #747c89; font-size: 11px; text-align: right; }

    .pace-term-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 9px;
      margin-top: 12px;
    }

    .pace-term {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      padding: 11px 12px;
      border: 1px solid #e4e9f2;
      border-radius: 10px;
      background: #fff;
    }

    .pace-term span { color: #525b69; font-size: 12px; }
    .pace-term strong { color: #2d3748; font-size: 13px; white-space: nowrap; }
    .pace-term small { color: #7a8290; font-weight: 400; }
    .pace-term.over { border-color: #e3a236; background: #fffaf0; }
    .pace-alert { margin: 12px 0 0; color: #a86100; font-size: 12px; font-weight: 700; }

    @media (max-width: 650px) {
      .pace-heading,
      .pace-overview { flex-direction: column; }
      .pace-meter { width: 100%; max-width: none; }
      .pace-term-grid { grid-template-columns: 1fr; }
    }
  `;
  document.head.appendChild(style);

  const panel = document.createElement("section");
  panel.className = "pace-panel";
  panel.setAttribute("aria-labelledby", "paceTitle");

  const planner = document.querySelector(".planner-panel");
  planner.insertAdjacentElement("afterend", panel);

  function creditsFor(status) {
    return subjects
      .filter(subject => statusOf(subject) === status)
      .reduce((sum, subject) => sum + subject.credits, 0);
  }

  function label(term) {
    const [year, semester] = term.split("-");
    return `${year}年度 ${semester === "spring" ? "春" : "秋"}`;
  }

  function render() {
    const required = graduationRequirements.graduation.total;
    const other = Number(localStorage.getItem("otherCredits")) || 0;
    const completed = creditsFor("completed") + other;
    const inProgress = creditsFor("in-progress");
    const planned = creditsFor("planned");
    const forecast = completed + inProgress + planned;
    const remaining = Math.max(0, required - forecast);

    const allTerms = PaceEngine.courseTerms(academicYear);
    const nowTerm = PaceEngine.currentTerm();
    const currentIndex = allTerms.indexOf(nowTerm);
    const futureTerms = currentIndex < 0
      ? (nowTerm < allTerms[0] ? allTerms : [])
      : allTerms.slice(currentIndex);

    const plannedTerms = appStorage.readObject("plannedTerms");
    const existingByTerm = {};

    subjects.forEach(subject => {
      const status = statusOf(subject);
      let term = null;

      if (status === "planned") term = plannedTerms[subject.code];
      if (status === "in-progress") term = nowTerm;
      if (!term) return;

      existingByTerm[term] = (existingByTerm[term] || 0) + subject.credits;
    });

    const result = PaceEngine.distribute({
      terms: futureTerms,
      existingByTerm,
      remaining,
      cap: CREDIT_CAP
    });

    const progress = Math.min(100, Math.round(forecast / required * 100));
    const complete = remaining === 0;
    const hasOverLimit = result.allocations.some(item => item.overLimit);
    const impossible = !complete && (!futureTerms.length || result.shortage > 0);
    const badgeClass = hasOverLimit || impossible ? "warning" : complete ? "complete" : "";
    const badgeText = hasOverLimit
      ? "学期上限の確認が必要"
      : complete
      ? "合計単位は達成見込み"
      : impossible
        ? "計画の見直しが必要"
        : `あと${remaining}単位を配分`;

    const termCards = result.allocations.map(item => `
      <div class="pace-term ${item.overLimit ? "over" : ""}">
        <span>${label(item.term)}</span>
        <strong>
          ${item.target}単位
          <small>${item.suggested ? `（あと${item.suggested}）` : "（計画済み）"}</small>
        </strong>
      </div>
    `).join("");

    panel.innerHTML = `
      <div class="pace-heading">
        <div>
          <h3 id="paceTitle">卒業までの履修ペース</h3>
          <p>修得済み・履修中・履修予定から、残り学期の目安を自動計算します。</p>
        </div>
        <span class="pace-badge ${badgeClass}">${badgeText}</span>
      </div>

      <div class="pace-overview">
        <div class="pace-stat">
          <span>現在の卒業見込み</span>
          <strong>${forecast}<small> / ${required}単位</small></strong>
        </div>
        <div class="pace-meter" aria-label="卒業見込み ${progress}%">
          <div class="pace-meter-track"><div class="pace-meter-fill" style="width:${progress}%"></div></div>
          <div class="pace-meter-label">修得済み ${completed} ＋ 履修中 ${inProgress} ＋ 予定 ${planned}</div>
        </div>
      </div>

      ${termCards ? `<div class="pace-term-grid">${termCards}</div>` : ""}
      ${result.shortage > 0 ? `<p class="pace-alert">各学期24単位以内では、卒業までに${result.shortage}単位不足します。</p>` : ""}
      ${!futureTerms.length && !complete ? `<p class="pace-alert">標準の卒業予定時期を過ぎています。計画期間を確認してください。</p>` : ""}
      <p class="pace-note">※ 合計124単位に対する目安です。必修・選択必修などの区分別条件は「判定」画面も確認してください。</p>
    `;
  }

  document.addEventListener("planner:data-changed", render);
  document.getElementById("otherCreditsInput")?.addEventListener("input", render);
  render();
})();
