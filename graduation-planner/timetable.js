(() => {
  let scheduleData =
    JSON.parse(localStorage.getItem("scheduleData")) || {};

  const days = ["月", "火", "水", "木", "金", "土"];
  const periods = [1, 2, 3, 4, 5, 6];

  const currentYear = new Date().getFullYear();

  const defaultTerm =
    `${currentYear}-${new Date().getMonth() < 7 ? "spring" : "fall"}`;

  const escapeHtml = value =>
    String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  const style = document.createElement("style");

  style.textContent = `
    .timetable-panel {
      margin: 0 0 24px;
      padding: 18px;
      background: linear-gradient(135deg, #f4f8ff, #f7f4ff);
      border: 1px solid #dde6f5;
      border-radius: 15px;
    }

    .timetable-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 14px;
      margin-bottom: 14px;
    }

    .timetable-header h3 {
      margin: 0;
      font-size: 17px;
    }

    .timetable-header p {
      margin: 5px 0 0;
      color: #777e88;
      font-size: 11px;
    }

    .timetable-term {
      min-width: 155px;
      padding: 9px 11px;
      border: 1px solid #dbe3ee;
      border-radius: 9px;
      background: #fff;
      color: #475569;
      font: inherit;
      font-size: 12px;
      outline: none;
    }

    .schedule-editor {
      display: grid;
      gap: 8px;
      margin-bottom: 14px;
    }

    .schedule-row {
      display: grid;
      grid-template-columns:
        minmax(150px, 1fr)
        72px
        72px
        minmax(90px, 130px);
      gap: 8px;
      align-items: center;
      padding: 10px;
      background: #fff;
      border: 1px solid #e4e9f1;
      border-radius: 10px;
    }

    .schedule-name {
      min-width: 0;
      font-size: 12px;
      font-weight: 700;
    }

    .schedule-name small {
      display: block;
      margin-top: 2px;
      color: #8a929e;
      font-size: 10px;
      font-weight: 400;
    }

    .schedule-row select,
    .schedule-row input {
      width: 100%;
      box-sizing: border-box;
      padding: 7px 8px;
      border: 1px solid #dfe4eb;
      border-radius: 8px;
      background: #fff;
      font: inherit;
      font-size: 11px;
      outline: none;
    }

    .schedule-row select:focus,
    .schedule-row input:focus {
      border-color: #2775ff;
      box-shadow: 0 0 0 2px rgba(39, 117, 255, 0.1);
    }

    .schedule-empty {
      padding: 14px;
      background: #fff;
      border-radius: 10px;
      color: #777e88;
      font-size: 12px;
      text-align: center;
    }

    .timetable-scroll {
      overflow-x: auto;
      padding-bottom: 3px;
    }

    .timetable-grid {
      display: grid;
      grid-template-columns:
        42px repeat(6, minmax(105px, 1fr));
      min-width: 720px;
      border: 1px solid #dfe5ed;
      border-radius: 11px;
      overflow: hidden;
      background: #fff;
    }

    .tt-head,
    .tt-period,
    .tt-cell {
      padding: 8px;
      border-right: 1px solid #e7ebf0;
      border-bottom: 1px solid #e7ebf0;
      font-size: 11px;
    }

    .tt-head {
      background: #f2f5fa;
      text-align: center;
      font-weight: 700;
    }

    .tt-period {
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f8fafc;
      font-weight: 700;
    }

    .tt-cell {
      min-height: 54px;
    }

    .tt-cell:nth-child(7n) {
      border-right: 0;
    }

    .tt-cell.conflict {
      background: #fff1f1;
      box-shadow: inset 0 0 0 2px #e65b5b;
    }

    .tt-subject {
      padding: 6px;
      border-radius: 7px;
      background: #edf4ff;
      color: #285caa;
      font-weight: 700;
      line-height: 1.35;
    }

    .tt-subject + .tt-subject {
      margin-top: 5px;
    }

    .tt-room {
      display: block;
      margin-top: 3px;
      color: #718096;
      font-size: 9px;
      font-weight: 400;
    }

    .conflict-message {
      display: none;
      margin: 10px 0 0;
      padding: 10px 12px;
      border-radius: 9px;
      background: #fff1f1;
      color: #c23d3d;
      font-size: 11px;
      font-weight: 700;
    }

    .conflict-message.show {
      display: block;
    }

    @media (max-width: 650px) {
      .timetable-header {
        flex-direction: column;
      }

      .timetable-term {
        width: 100%;
      }

      .schedule-row {
        grid-template-columns: 1fr 1fr;
      }

      .schedule-name {
        grid-column: 1 / -1;
      }

      .schedule-row input {
        grid-column: 1 / -1;
      }
    }
  `;

  document.head.appendChild(style);

  function createTermOptions() {
    let html = "";

    for (let year = 2024; year <= 2032; year++) {
      html += `
        <option value="${year}-spring">
          ${year}年度 春学期
        </option>
      `;

      html += `
        <option value="${year}-fall">
          ${year}年度 秋学期
        </option>
      `;
    }

    return html;
  }

  const plannerPanel =
    document.querySelector(".planner-panel");

  if (!plannerPanel) {
    console.error("履修計画欄が見つかりません。");
    return;
  }

  const panel = document.createElement("div");

  panel.className = "timetable-panel";

  panel.innerHTML = `
    <div class="timetable-header">
      <div>
        <h3>週間時間割</h3>
        <p>
          曜日・時限を設定すると、
          授業の重複を自動で確認します
        </p>
      </div>

      <select
        id="timetableTerm"
        class="timetable-term"
        aria-label="表示する学期"
      >
        ${createTermOptions()}
      </select>
    </div>

    <div
      id="scheduleEditor"
      class="schedule-editor"
    ></div>

    <div class="timetable-scroll">
      <div
        id="timetableGrid"
        class="timetable-grid"
      ></div>
    </div>

    <p
      id="conflictMessage"
      class="conflict-message"
    ></p>
  `;

  plannerPanel.insertAdjacentElement("afterend", panel);

  const termSelect =
    document.getElementById("timetableTerm");

  termSelect.value =
    localStorage.getItem("timetableTerm") ||
    defaultTerm;

  if (!termSelect.value) {
    termSelect.value = "2024-spring";
  }

  function selectedSubjects() {
    const selectedTerm = termSelect.value;

    const plannedTerms =
      JSON.parse(localStorage.getItem("plannedTerms")) || {};

    return subjects.filter(subject => {
      const status = statusOf(subject);

      if (status === "planned") {
        const subjectTerm =
          plannedTerms[subject.code] || defaultTerm;

        return subjectTerm === selectedTerm;
      }

      if (status === "in-progress") {
        const savedTerm =
          scheduleData[subject.code]?.term;

        return !savedTerm || savedTerm === selectedTerm;
      }

      return false;
    });
  }

  function saveSchedule() {
    localStorage.setItem(
      "scheduleData",
      JSON.stringify(scheduleData)
    );
  }

  function createOptions(
    values,
    selectedValue,
    emptyLabel
  ) {
    let html = `<option value="">${emptyLabel}</option>`;

    values.forEach(value => {
      const selected =
        String(value) === String(selectedValue)
          ? "selected"
          : "";

      html += `
        <option value="${value}" ${selected}>
          ${value}
        </option>
      `;
    });

    return html;
  }

  function renderEditor() {
    const editor =
      document.getElementById("scheduleEditor");

    const activeSubjects = selectedSubjects();

    if (activeSubjects.length === 0) {
      editor.innerHTML = `
        <div class="schedule-empty">
          この学期の「履修中」または
          「履修予定」の科目はありません。
        </div>
      `;

      return;
    }

    editor.innerHTML = activeSubjects
      .map(subject => {
        const item =
          scheduleData[subject.code] || {};

        return `
          <div
            class="schedule-row"
            data-code="${escapeHtml(subject.code)}"
          >
            <div class="schedule-name">
              ${escapeHtml(subject.name)}

              <small>
                ${escapeHtml(subject.code)}
                ・${subject.credits}単位
              </small>
            </div>

            <select
              data-field="day"
              aria-label="${escapeHtml(subject.name)}の曜日"
            >
              ${createOptions(
                days,
                item.day,
                "曜日"
              )}
            </select>

            <select
              data-field="period"
              aria-label="${escapeHtml(subject.name)}の時限"
            >
              ${createOptions(
                periods,
                item.period,
                "時限"
              )}
            </select>

            <input
              data-field="room"
              value="${escapeHtml(item.room || "")}"
              maxlength="30"
              placeholder="教室（任意）"
              aria-label="${escapeHtml(subject.name)}の教室"
            >
          </div>
        `;
      })
      .join("");
  }

  function renderGrid() {
    const activeSubjects = selectedSubjects();
    const cells = {};

    activeSubjects.forEach(subject => {
      const item = scheduleData[subject.code];

      if (!item?.day || !item?.period) {
        return;
      }

      const key = `${item.day}-${item.period}`;

      if (!cells[key]) {
        cells[key] = [];
      }

      cells[key].push({
        subject,
        item
      });
    });

    let html = `<div class="tt-head"></div>`;

    days.forEach(day => {
      html += `
        <div class="tt-head">
          ${day}
        </div>
      `;
    });

    periods.forEach(period => {
      html += `
        <div class="tt-period">
          ${period}限
        </div>
      `;

      days.forEach(day => {
        const entries =
          cells[`${day}-${period}`] || [];

        const conflictClass =
          entries.length > 1
            ? "conflict"
            : "";

        html += `
          <div class="tt-cell ${conflictClass}">
            ${entries
              .map(({ subject, item }) => {
                return `
                  <div class="tt-subject">
                    ${escapeHtml(subject.name)}

                    ${
                      item.room
                        ? `
                          <span class="tt-room">
                            ${escapeHtml(item.room)}
                          </span>
                        `
                        : ""
                    }
                  </div>
                `;
              })
              .join("")}
          </div>
        `;
      });
    });

    document.getElementById(
      "timetableGrid"
    ).innerHTML = html;

    const conflicts = Object.entries(cells)
      .filter(([, entries]) => entries.length > 1);

    const message =
      document.getElementById("conflictMessage");

    message.classList.toggle(
      "show",
      conflicts.length > 0
    );

    if (conflicts.length === 0) {
      message.textContent = "";
      return;
    }

    const conflictText = conflicts
      .map(([slot, entries]) => {
        const [day, period] = slot.split("-");

        const names = entries
          .map(entry => entry.subject.name)
          .join("・");

        return `${day}曜 ${period}限（${names}）`;
      })
      .join("、");

    message.textContent =
      `⚠ ${conflictText} が重複しています。`;
  }

  function renderTimetable() {
    renderEditor();
    renderGrid();
  }

  document
    .getElementById("scheduleEditor")
    .addEventListener("input", event => {
      const field = event.target.dataset.field;

      const row =
        event.target.closest(".schedule-row");

      if (!field || !row) {
        return;
      }

      const code = row.dataset.code;

      if (!scheduleData[code]) {
        scheduleData[code] = {};
      }

      scheduleData[code][field] =
        event.target.value;

      scheduleData[code].term =
        termSelect.value;

      const item = scheduleData[code];

      if (
        !item.day &&
        !item.period &&
        !item.room
      ) {
        delete scheduleData[code];
      }

      saveSchedule();
      renderGrid();
    });

  termSelect.addEventListener("change", () => {
    localStorage.setItem(
      "timetableTerm",
      termSelect.value
    );

    renderTimetable();
  });

  document.addEventListener("change", event => {
    if (
      event.target.classList.contains(
        "subject-status-select"
      ) ||
      event.target.classList.contains(
        "plan-term-select"
      )
    ) {
      setTimeout(renderTimetable, 0);
    }
  });

  const oldExportButton =
    document.getElementById("exportData");

  if (oldExportButton) {
    const exportButton =
      oldExportButton.cloneNode(true);

    oldExportButton.replaceWith(exportButton);

    exportButton.addEventListener("click", () => {
      const backup = {
        app: "卒業単位チェッカー",
        version: 4,
        savedAt: new Date().toISOString(),

        subjectStatuses,

        plannedTerms:
          JSON.parse(
            localStorage.getItem("plannedTerms")
          ) || {},

        scheduleData,

        otherCredits:
          Number(
            localStorage.getItem("otherCredits")
          ) || 0,

        includePlanned:
          localStorage.getItem("includePlanned") ===
          "true"
      };

      const blob = new Blob(
        [JSON.stringify(backup, null, 2)],
        {
          type: "application/json"
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
    });
  }

  const importFile =
    document.getElementById("importFile");

  if (importFile) {
    importFile.addEventListener(
      "change",
      async () => {
        const file = importFile.files[0];

        if (!file) {
          return;
        }

        try {
          const backup =
            JSON.parse(await file.text());

          if (
            backup.scheduleData &&
            typeof backup.scheduleData === "object"
          ) {
            scheduleData = backup.scheduleData;
          } else {
            scheduleData = {};
          }

          localStorage.setItem(
            "scheduleData",
            JSON.stringify(scheduleData)
          );

          if (
            typeof backup.includePlanned ===
            "boolean"
          ) {
            localStorage.setItem(
              "includePlanned",
              String(backup.includePlanned)
            );
          }

          setTimeout(renderTimetable, 0);
        } catch {
          console.error(
            "時間割データを復元できませんでした。"
          );
        }
      }
    );
  }

  const oldResetButton =
    document.getElementById("resetData");

  if (oldResetButton) {
    const resetButton =
      oldResetButton.cloneNode(true);

    oldResetButton.replaceWith(resetButton);

    resetButton.addEventListener("click", () => {
      const accepted = confirm(
        "履修状況・履修計画・時間割・" +
        "他学部他学科単位をすべて" +
        "未入力に戻しますか？"
      );

      if (!accepted) {
        return;
      }

      localStorage.removeItem("subjectStatuses");
      localStorage.removeItem("completedSubjects");
      localStorage.removeItem("plannedTerms");
      localStorage.removeItem("scheduleData");
      localStorage.removeItem("otherCredits");
      localStorage.removeItem("includePlanned");

      location.reload();
    });
  }

  renderTimetable();
})();