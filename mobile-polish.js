(() => {
  const timetableScroll = document.querySelector(".timetable-scroll");

  if (timetableScroll && !document.querySelector(".mobile-scroll-hint")) {
    const hint = document.createElement("p");
    hint.className = "mobile-scroll-hint";
    hint.textContent = "時間割は横にスワイプして確認できます";
    timetableScroll.before(hint);
  }

  const style = document.createElement("style");
  style.textContent = `
    .mobile-scroll-hint { display: none; }

    @media (max-width: 700px) {
      *, *::before, *::after { box-sizing: border-box; }

      body {
        min-width: 0;
        padding-bottom: calc(88px + env(safe-area-inset-bottom));
      }

      main,
      .app-view,
      .planner-panel,
      .pace-panel,
      .sequence-panel,
      .timetable-panel { min-width: 0; width: 100%; }

      main { padding-right: 10px; padding-left: 10px; }

      .planner-panel,
      .pace-panel,
      .sequence-panel,
      .timetable-panel,
      .utility-panel { padding: 15px !important; border-radius: 14px; }

      .planner-header h3,
      .pace-heading h3,
      .sequence-header h3,
      .timetable-header h3 { font-size: 18px; line-height: 1.35; }

      .planner-header p,
      .pace-heading p,
      .sequence-header p,
      .timetable-header p,
      .pace-note,
      .sequence-note,
      .timetable-official-note { font-size: 13px; line-height: 1.65; }

      button { min-height: 44px; font-size: 14px !important; }

      select,
      input:not([type="checkbox"]):not([type="radio"]) {
        min-height: 44px;
        font-size: 16px !important;
      }

      .category-tab,
      .year-tab { min-height: 44px; font-size: 14px; }

      .section-label,
      .summary-setting,
      .quick-summary-card span,
      .quick-summary-card small,
      .quick-summary-note,
      .status-card p,
      .eligibility-card p,
      .remaining,
      .progress-note { font-size: 12px !important; line-height: 1.5; }

      .subject-name { font-size: 15px; }
      .subject-meta,
      .term-subjects,
      .term-warning,
      .term-alert,
      .schedule-name,
      .sequence-route,
      .sequence-reason { font-size: 13px; }

      .missing-card,
      .missing-condition-card { font-size: 13px; line-height: 1.55; }

      .subject-status-select,
      .plan-term-select { padding: 9px 10px; }

      .term-title { align-items: center; font-size: 14px; }
      .term-timetable-button { margin-top: 12px; }

      .pace-stat strong { font-size: 25px; }
      .pace-meter-label { font-size: 12px; line-height: 1.5; text-align: left; }
      .pace-term span,
      .pace-term strong { font-size: 14px; }

      .sequence-status-select,
      .sequence-fix-button { min-height: 44px; }

      .timetable-actions { align-items: stretch; }
      .term-credit-total { display: flex; min-height: 44px; align-items: center; font-size: 14px; }

      .schedule-row { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) 44px; gap: 8px; }
      .schedule-row input { grid-column: 1 / 3; }
      .schedule-row .remove-schedule-slot { grid-column: 3; grid-row: 1 / 3; width: 44px; height: 100%; }

      .mobile-scroll-hint {
        display: block;
        margin: 2px 0 8px;
        color: #687486;
        font-size: 12px;
      }

      .timetable-scroll {
        margin-right: -15px;
        padding: 0 15px 8px 0;
        overflow-x: auto;
        overscroll-behavior-x: contain;
        -webkit-overflow-scrolling: touch;
        scrollbar-color: #aebbd0 transparent;
        scrollbar-width: thin;
      }

      .timetable-grid {
        grid-template-columns: 40px repeat(6, minmax(92px, 1fr));
        min-width: 595px;
      }

      .tt-head,
      .tt-period,
      .tt-cell { padding: 7px 6px; font-size: 12px; }
      .tt-cell { min-height: 58px; }
      .tt-subject { font-size: 12px; overflow-wrap: anywhere; }
      .tt-room { font-size: 11px; }

      .academic-year-picker { min-height: 48px; font-size: 13px; }
      .source-info { gap: 6px !important; font-size: 12px !important; line-height: 1.5; }
      .source-info a { overflow-wrap: anywhere; }

      .mobile-bottom-nav {
        right: 8px;
        bottom: max(8px, env(safe-area-inset-bottom));
        left: 8px;
      }

      .mobile-nav-button { min-height: 52px; font-size: 12px !important; }
      .mobile-nav-icon { font-size: 19px; }
    }

    @media (max-width: 440px) {
      .subject-controls { grid-template-columns: 1fr; }
      .dashboard-title { flex-direction: column; }
      .total-progress { text-align: left; }
      .timetable-actions { display: grid; grid-template-columns: 1fr; }
    }

    @media (max-width: 360px) {
      .status-grid,
      .eligibility-grid { grid-template-columns: 1fr; }
      .quick-summary-grid { grid-template-columns: 1fr !important; }
    }
  `;

  document.head.appendChild(style);
})();
