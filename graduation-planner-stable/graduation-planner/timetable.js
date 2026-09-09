(() => {
  let scheduleData =
    appStorage.readObject("scheduleData");

  function normalizeScheduleData(data) {
    const normalized = {};

    Object.entries(data).forEach(([code, item]) => {
      if (!item || typeof item !== "object") return;

      const slots = Array.isArray(item.slots)
        ? item.slots
        : [
            {
              day: item.day || "",
              period: item.period || "",
              room: item.room || ""
            }
          ];

      normalized[code] = {
        term: item.term || "",
        slots: slots
          .filter(slot => slot && typeof slot === "object")
          .map(slot => ({
            day: slot.day || "",
            period: slot.period || "",
            room: slot.room || ""
          }))
      };
    });

    return normalized;
  }

  scheduleData = normalizeScheduleData(scheduleData);

  const days = ["月", "火", "水", "木", "金", "土"];
  const periods = [1, 2, 3, 4, 5, 6];

  const now = new Date();

  const currentYear =
    now.getMonth() < 3
      ? now.getFullYear() - 1
      : now.getFullYear();

  const defaultTerm =
    `${currentYear}-${
      now.getMonth() >= 3 && now.getMonth() <= 8
        ? "spring"
        : "fall"
    }`;

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

    .timetable-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .term-credit-total {
      padding: 8px 11px;
      border-radius: 9px;
      background: #fff;
      color: #285caa;
      font-size: 12px;
      font-weight: 700;
      white-space: nowrap;
    }

    .quick-add-course {
      display: grid;
      grid-template-columns: minmax(180px, 1fr) auto;
      gap: 8px;
      margin-bottom: 12px;
      padding: 10px;
      border: 1px solid #dfe6f2;
      border-radius: 10px;
      background: #fff;
    }

    .quick-add-course select,
    .quick-add-course button {
      min-height: 38px;
      border: 1px solid #dfe4eb;
      border-radius: 8px;
      background: #fff;
      font: inherit;
      font-size: 12px;
    }

    .quick-add-course select {
      width: 100%;
      padding: 7px 9px;
    }

    .quick-add-course button {
      padding: 7px 13px;
      background: #285caa;
      border-color: #285caa;
      color: #fff;
      font-weight: 700;
      cursor: pointer;
    }

    .term-alerts {
      display: grid;
      gap: 8px;
      margin-bottom: 12px;
    }

    .term-alert {
      margin: 0;
      padding: 10px 12px;
      border-radius: 9px;
      font-size: 11px;
      font-weight: 700;
      line-height: 1.6;
    }

    .term-alert.limit {
      background: #fff1f1;
      color: #c23d3d;
    }

    .term-alert.required {
      background: #fff8e8;
      color: #986000;
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

    .schedule-subject {
      padding: 10px;
      background: #fff;
      border: 1px solid #e4e9f1;
      border-radius: 10px;
    }

    .schedule-subject-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      margin-bottom: 8px;
    }

    .schedule-row {
      display: grid;
      grid-template-columns:
        72px
        72px
        minmax(90px, 1fr)
        34px;
      gap: 8px;
      align-items: center;
      margin-top: 7px;
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

    .add-schedule-slot,
    .remove-schedule-slot,
    .remove-course-button {
      border: 1px solid #dfe4eb;
      border-radius: 8px;
      background: #fff;
      color: #526070;
      font: inherit;
      font-weight: 700;
      cursor: pointer;
    }

    .add-schedule-slot {
      padding: 7px 10px;
      color: #285caa;
      font-size: 11px;
    }

    .remove-schedule-slot {
      width: 34px;
      height: 32px;
      color: #a94444;
      font-size: 15px;
    }

    .schedule-buttons {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
      justify-content: flex-end;
    }

    .remove-course-button {
      padding: 7px 9px;
      color: #a94444;
      font-size: 11px;
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
      .timetable-official-note {
  margin: 12px 0 0;
  padding: 10px 12px;
  border-left: 3px solid #8b95a5;
  background: rgba(255, 255, 255, 0.72);
  color: #687180;
  font-size: 11px;
  line-height: 1.7;
}

    @media (max-width: 650px) {
      .timetable-header {
        flex-direction: column;
      }

      .timetable-term {
        width: 100%;
      }

      .timetable-actions,
      .term-credit-total {
        width: 100%;
      }

      .quick-add-course {
        grid-template-columns: 1fr;
      }

      .schedule-row {
        grid-template-columns: 1fr 1fr 38px;
      }

      .schedule-subject-header {
        align-items: flex-start;
        flex-direction: column;
      }

      .schedule-buttons {
        width: 100%;
        justify-content: flex-start;
      }

      .schedule-row input {
        grid-column: 1 / 3;
      }

      .schedule-row .remove-schedule-slot {
        grid-column: 3;
        grid-row: 1 / 3;
        height: 100%;
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
        <h3>選択学期の週間時間割</h3>
        <p>
          曜日・時限を設定すると、
          授業の重複を自動で確認します
        </p>
      </div>

      <div class="timetable-actions">
        <div
          id="termCreditTotal"
          class="term-credit-total"
          aria-live="polite"
        >0 / 24単位</div>

        <select
          id="timetableTerm"
          class="timetable-term"
          aria-label="表示する学期"
        >
          ${createTermOptions()}
        </select>
      </div>
    </div>

    <div class="quick-add-course">
      <select
        id="quickAddCourse"
        aria-label="時間割に追加する科目"
      ></select>

      <button id="quickAddButton" type="button">
        この学期に追加
      </button>
    </div>

    <div
      id="termAlerts"
      class="term-alerts"
      aria-live="polite"
    ></div>

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
    <p class="timetable-official-note">
  ※ 授業の開講曜日・時限・教室などは、
  必ず東洋大学公式シラバスで最新情報を確認してください。
</p>
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
      appStorage.readObject("plannedTerms");

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

  function plannedTermsData() {
    return appStorage.readObject("plannedTerms");
  }

  function selectedCredits() {
    return selectedSubjects().reduce(
      (total, subject) => total + subject.credits,
      0
    );
  }

  function renderCoursePicker() {
    const picker = document.getElementById(
      "quickAddCourse"
    );

    const selectedCodes = new Set(
      selectedSubjects().map(subject => subject.code)
    );

    const available = subjects
      .filter(subject =>
        statusOf(subject) !== "completed" &&
        !selectedCodes.has(subject.code)
      )
      .sort((a, b) => {
        const typeRank = {
          "必修": 0,
          "選択必修": 1,
          "選択": 2
        };

        return (
          a.year - b.year ||
          (typeRank[a.type] ?? 3) -
            (typeRank[b.type] ?? 3) ||
          a.name.localeCompare(b.name, "ja")
        );
      });

    picker.innerHTML = `
      <option value="">追加する科目を選択</option>
      ${available
        .map(subject => `
          <option value="${escapeHtml(subject.code)}">
            ${subject.year}年・${escapeHtml(subject.type)}｜${escapeHtml(subject.name)}（${subject.credits}単位）
          </option>
        `)
        .join("")}
    `;

    document.getElementById(
      "quickAddButton"
    ).disabled = available.length === 0;
  }

  function renderTermSummary() {
    const credits = selectedCredits();
    const selectedYear = Number(
      termSelect.value.split("-")[0]
    );
    const studentYear = Math.min(
      Math.max(
        selectedYear -
          graduationRequirements.admissionYear +
          1,
        1
      ),
      4
    );

    document.getElementById(
      "termCreditTotal"
    ).textContent = `${credits} / 24単位`;

    const plannedTerms = plannedTermsData();
    const missingRequired = subjects.filter(subject =>
      subject.type === "必修" &&
      subject.year <= studentYear &&
      statusOf(subject) !== "completed" &&
      statusOf(subject) !== "in-progress" &&
      !plannedTerms[subject.code]
    );

    const alerts = [];

    if (credits > 24) {
      alerts.push(`
        <p class="term-alert limit">
          履修登録上限を${credits - 24}単位超えています。
        </p>
      `);
    }

    if (missingRequired.length > 0) {
      const names = missingRequired
        .slice(0, 5)
        .map(subject => escapeHtml(subject.name))
        .join("、");
      const rest = Math.max(missingRequired.length - 5, 0);

      alerts.push(`
        <p class="term-alert required">
          ${studentYear}年次までの未計画の必修候補：${names}${rest ? `、ほか${rest}科目` : ""}
        </p>
      `);
    }

    document.getElementById(
      "termAlerts"
    ).innerHTML = alerts.join("");
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
        const item = scheduleData[subject.code] || {};
        const slots = item.slots?.length
          ? item.slots
          : [{}];

        const slotRows = slots
          .map((slot, index) => `
            <div class="schedule-row" data-slot-index="${index}">
              <select
                data-field="day"
                aria-label="${escapeHtml(subject.name)}の曜日 ${index + 1}"
              >
                ${createOptions(days, slot.day, "曜日")}
              </select>

              <select
                data-field="period"
                aria-label="${escapeHtml(subject.name)}の時限 ${index + 1}"
              >
                ${createOptions(periods, slot.period, "時限")}
              </select>

              <input
                data-field="room"
                value="${escapeHtml(slot.room || "")}"
                maxlength="30"
                placeholder="教室（任意）"
                aria-label="${escapeHtml(subject.name)}の教室 ${index + 1}"
              >

              <button
                class="remove-schedule-slot"
                type="button"
                aria-label="${escapeHtml(subject.name)}の${index + 1}件目を削除"
                title="曜日・時限を削除"
              >×</button>
            </div>
          `)
          .join("");

        return `
          <div
            class="schedule-subject"
            data-code="${escapeHtml(subject.code)}"
          >
            <div class="schedule-subject-header">
              <div class="schedule-name">
                ${escapeHtml(subject.name)}

                <small>
                  ${escapeHtml(subject.code)}
                  ・${subject.credits}単位
                </small>
              </div>

              <div class="schedule-buttons">
                <button
                  class="add-schedule-slot"
                  type="button"
                >＋ 曜日・時限</button>

                <button
                  class="remove-course-button"
                  type="button"
                >この学期から外す</button>
              </div>
            </div>

            ${slotRows}
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

      (item?.slots || []).forEach(slot => {
        if (!slot.day || !slot.period) return;

        const key = `${slot.day}-${slot.period}`;

        if (!cells[key]) cells[key] = [];

        cells[key].push({
          subject,
          item: slot
        });
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
    renderCoursePicker();
    renderTermSummary();
    renderEditor();
    renderGrid();

    document.dispatchEvent(
      new CustomEvent("timetable:term-changed", {
        detail: {
          term: termSelect.value
        }
      })
    );
  }

  document
    .getElementById("scheduleEditor")
    .addEventListener("input", event => {
      const field = event.target.dataset.field;

      const subjectBox =
        event.target.closest(".schedule-subject");

      const row =
        event.target.closest(".schedule-row");

      if (!field || !subjectBox || !row) {
        return;
      }

      const code = subjectBox.dataset.code;
      const slotIndex = Number(row.dataset.slotIndex);

      if (!scheduleData[code]) {
        scheduleData[code] = {
          term: termSelect.value,
          slots: []
        };
      }

      if (!scheduleData[code].slots[slotIndex]) {
        scheduleData[code].slots[slotIndex] = {};
      }

      scheduleData[code].slots[slotIndex][field] =
        event.target.value;

      scheduleData[code].term =
        termSelect.value;

      const item = scheduleData[code];

      item.slots = item.slots.filter(slot =>
        slot.day || slot.period || slot.room
      );

      if (item.slots.length === 0) {
        delete scheduleData[code];
      }

      saveSchedule();
      renderGrid();
    });

  document
    .getElementById("scheduleEditor")
    .addEventListener("click", event => {
      const subjectBox = event.target.closest(
        ".schedule-subject"
      );

      if (!subjectBox) return;

      const code = subjectBox.dataset.code;

      if (event.target.closest(".remove-course-button")) {
        const plannedTerms = plannedTermsData();

        delete plannedTerms[code];
        delete subjectStatuses[code];
        delete scheduleData[code];

        localStorage.setItem(
          "plannedTerms",
          JSON.stringify(plannedTerms)
        );
        localStorage.setItem(
          "subjectStatuses",
          JSON.stringify(subjectStatuses)
        );
        saveSchedule();
        calculateAll();
        displaySubjects();
        document.dispatchEvent(
          new CustomEvent("planner:data-changed")
        );
        renderTimetable();
        return;
      }

      if (event.target.closest(".add-schedule-slot")) {
        if (!scheduleData[code]) {
          scheduleData[code] = {
            term: termSelect.value,
            slots: []
          };
        }

        scheduleData[code].term = termSelect.value;
        scheduleData[code].slots.push({
          day: "",
          period: "",
          room: ""
        });

        saveSchedule();
        renderEditor();
        return;
      }

      const removeButton = event.target.closest(
        ".remove-schedule-slot"
      );

      if (!removeButton) return;

      const row = removeButton.closest(".schedule-row");
      const slotIndex = Number(row.dataset.slotIndex);

      if (scheduleData[code]?.slots) {
        scheduleData[code].slots.splice(slotIndex, 1);

        if (scheduleData[code].slots.length === 0) {
          delete scheduleData[code];
        }

        saveSchedule();
      }

      renderTimetable();
    });

  document
    .getElementById("quickAddButton")
    .addEventListener("click", () => {
      const picker = document.getElementById(
        "quickAddCourse"
      );
      const code = picker.value;

      if (!code) return;

      const plannedTerms = plannedTermsData();

      subjectStatuses[code] = "planned";
      plannedTerms[code] = termSelect.value;

      localStorage.setItem(
        "subjectStatuses",
        JSON.stringify(subjectStatuses)
      );
      localStorage.setItem(
        "plannedTerms",
        JSON.stringify(plannedTerms)
      );

      calculateAll();
      displaySubjects();
      document.dispatchEvent(
        new CustomEvent("planner:data-changed")
      );
      renderTimetable();
    });

  termSelect.addEventListener("change", () => {
    localStorage.setItem(
      "timetableTerm",
      termSelect.value
    );

    renderTimetable();
  });

  document.addEventListener(
    "planner:term-selected",
    event => {
      const term = event.detail?.term;

      if (!term) return;

      termSelect.value = term;
      localStorage.setItem(
        "timetableTerm",
        term
      );
      renderTimetable();
    }
  );

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
  document.addEventListener(
  "planner:data-changed",
  () => {
    scheduleData = normalizeScheduleData(
      appStorage.readObject("scheduleData")
    );

    setTimeout(renderTimetable, 0);
  }
);

  saveSchedule();
  renderTimetable();
})();
