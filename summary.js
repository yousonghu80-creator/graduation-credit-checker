(() => {
  const main =
    document.querySelector("main");

  if (!main) return;

  const style =
    document.createElement("style");

  style.textContent = `
    .quick-summary {
      padding: 20px;
      background:
        linear-gradient(
          135deg,
          #20242b,
          #303640
        );
      color: #fff;
    }

    .quick-summary-head {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 14px;
    }

    .quick-summary h2 {
      font-size: 18px;
    }

    .summary-setting {
      margin: 0;
      color: #b9c0cb;
      font-size: 10px;
    }

    .quick-summary-grid {
      display: grid;
      grid-template-columns:
        repeat(4, 1fr);
      gap: 9px;
    }

    .quick-summary-card {
      padding: 13px;
      background:
        rgba(255, 255, 255, 0.09);
      border:
        1px solid
        rgba(255, 255, 255, 0.1);
      border-radius: 11px;
    }

    .quick-summary-card span {
      display: block;
      margin-bottom: 6px;
      color: #c9ced6;
      font-size: 10px;
    }

    .quick-summary-card strong {
      font-size: 24px;
    }

    .quick-summary-card small {
      margin-left: 3px;
      color: #b9c0c9;
      font-size: 10px;
    }

    .quick-summary-card.remaining-card {
      background: #fff;
      color: #252a31;
    }

    .quick-summary-card.remaining-card span {
      color: #6f7680;
    }

    .quick-summary-card.remaining-card small {
      color: #7f8690;
    }
      .quick-summary-note {
  margin: 10px 2px 0;
  color: #c7ccd4;
  font-size: 9px;
}

    @media (max-width: 700px) {
      .quick-summary {
        padding: 16px 14px;
      }

      .quick-summary-head {
        align-items: flex-start;
        flex-direction: column;
      }

      .quick-summary-grid {
        grid-template-columns: 1fr 1fr;
      }

      .quick-summary-card {
        padding: 12px;
      }

      .quick-summary-card strong {
        font-size: 22px;
      }
    }
  `;

  document.head.appendChild(style);

  const section =
    document.createElement("section");

  section.className = "quick-summary";

  section.innerHTML = `
    <div class="quick-summary-head">
      <div>
        <p class="section-label">
          OVERVIEW
        </p>

        <h2>単位サマリー</h2>
      </div>

      <p
        id="summarySetting"
        class="summary-setting"
      ></p>
    </div>

    <div class="quick-summary-grid">
      <div class="quick-summary-card">
        <span>修得済み</span>

        <strong id="summaryCompleted">
          0
        </strong>

        <small>単位</small>
      </div>

      <div class="quick-summary-card">
        <span>履修中</span>

        <strong id="summaryInProgress">
          0
        </strong>

        <small>単位</small>
      </div>

      <div class="quick-summary-card">
        <span>履修予定</span>

        <strong id="summaryPlanned">
          0
        </strong>

        <small>単位</small>
      </div>

      <div
        class="
          quick-summary-card
          remaining-card
        "
      >
        <span>124単位まで残り</span>

        <strong id="summaryRemaining">
          124
        </strong>

        <small>単位</small>
      </div>
        </div>

    <p class="quick-summary-note">
      ※ 卒業には合計単位に加えて、
      区分別の条件を満たす必要があります。
    </p>

    `;

  main.prepend(section);

  function creditsFor(status) {
    return subjects
      .filter(
        subject =>
          statusOf(subject) === status
      )
      .reduce(
        (sum, subject) =>
          sum + subject.credits,
        0
      );
  }

  function renderSummary() {
    const otherCredits =
      Number(
        localStorage.getItem(
          "otherCredits"
        )
      ) || 0;

    const completed =
      creditsFor("completed") +
      otherCredits;

    const inProgress =
      creditsFor("in-progress");

    const planned =
      creditsFor("planned");

    const useInProgress =
      localStorage.getItem(
        "includeInProgress"
      ) === "true";

    const usePlanned =
      localStorage.getItem(
        "includePlanned"
      ) === "true";

    const counted =
      completed +
      (
        useInProgress
          ? inProgress
          : 0
      ) +
      (
        usePlanned
          ? planned
          : 0
      );

    document.getElementById(
      "summaryCompleted"
    ).textContent = completed;

    document.getElementById(
      "summaryInProgress"
    ).textContent = inProgress;

    document.getElementById(
      "summaryPlanned"
    ).textContent = planned;

    document.getElementById(
      "summaryRemaining"
    ).textContent =
      Math.max(
        124 - counted,
        0
      );

    const included = [];

    if (useInProgress) {
      included.push("履修中");
    }

    if (usePlanned) {
      included.push("履修予定");
    }

    document.getElementById(
      "summarySetting"
    ).textContent =
      included.length
        ? `${included.join("・")}を含めた残り単位`
        : "修得済みのみで計算";
  }

  const previousCalculateAll =
    calculateAll;

  calculateAll = function() {
    previousCalculateAll();
    renderSummary();
  };

  renderSummary();
})();