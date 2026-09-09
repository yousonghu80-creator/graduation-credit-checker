(() => {
  const style = document.createElement("style");

  style.textContent = `
    :root {
      --navy-950: #071b36;
      --navy-900: #0b2850;
      --navy-800: #123a73;
      --blue-600: #1769e0;
      --blue-500: #2d7df0;
      --blue-100: #e8f1ff;
      --blue-50: #f3f7ff;
      --ink-900: #152238;
      --ink-700: #43516a;
      --ink-500: #748097;
      --line: #dfe6f0;
      --surface: #ffffff;
      --canvas: #edf2f8;
      --green: #18865b;
      --green-soft: #e8f7f0;
      --amber: #ae6b00;
      --amber-soft: #fff5df;
      --red: #c54545;
      --red-soft: #fff0f0;
      --purple: #7052c8;
      --purple-soft: #f2efff;
      --shadow-sm: 0 4px 14px rgba(18, 43, 77, 0.06);
      --shadow-md: 0 14px 35px rgba(18, 43, 77, 0.09);
    }

    html {
      background: var(--canvas);
    }

    body {
      min-height: 100vh;
      background:
        radial-gradient(circle at 8% 0%, rgba(45, 125, 240, 0.09), transparent 28rem),
        var(--canvas);
      color: var(--ink-900);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans JP", sans-serif;
      line-height: 1.55;
    }

    button,
    select,
    input {
      font: inherit;
    }

    button:focus-visible,
    select:focus-visible,
    input:focus-visible {
      outline: 3px solid rgba(45, 125, 240, 0.22) !important;
      outline-offset: 2px;
    }

    .top-header {
      position: relative;
      overflow: hidden;
      background: linear-gradient(118deg, var(--navy-950) 0%, var(--navy-800) 68%, #1859a6 100%);
      border-bottom: 0;
      color: #fff;
    }

    .top-header::before,
    .top-header::after {
      position: absolute;
      content: "";
      border-radius: 999px;
      pointer-events: none;
    }

    .top-header::before {
      width: 340px;
      height: 340px;
      right: -80px;
      top: -235px;
      border: 54px solid rgba(255, 255, 255, 0.07);
    }

    .top-header::after {
      width: 160px;
      height: 160px;
      right: 18%;
      bottom: -128px;
      border: 34px solid rgba(80, 158, 255, 0.13);
    }

    .header-inner {
      position: relative;
      z-index: 1;
      max-width: 1160px;
      padding: 34px 28px 38px;
    }

    .header-kicker {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 9px;
    }

    .top-header .service-label {
      margin: 0;
      color: #83b7ff;
      font-size: 11px;
      letter-spacing: 2.2px;
    }

    .autosave-badge {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      padding: 6px 10px;
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.08);
      color: rgba(255, 255, 255, 0.82);
      font-size: 12px;
      font-weight: 600;
      backdrop-filter: blur(8px);
    }

    .autosave-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #65e6ad;
      box-shadow: 0 0 0 4px rgba(101, 230, 173, 0.12);
    }

    .top-header h1 {
      color: #fff;
      font-size: clamp(28px, 4vw, 38px);
      font-weight: 800;
      letter-spacing: -1.5px;
    }

    .top-header .university {
      margin-top: 10px;
      color: rgba(255, 255, 255, 0.74);
      font-size: 14px;
    }

    .top-header .university span {
      display: inline-block;
      margin-left: 10px;
      padding: 3px 8px;
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.1);
      color: rgba(255, 255, 255, 0.84);
      font-size: 12px;
    }

    .desktop-view-nav {
      top: 0;
      gap: 8px;
      padding: 10px 18px !important;
      background: rgba(255, 255, 255, 0.9) !important;
      border-bottom: 1px solid rgba(207, 218, 232, 0.9) !important;
      box-shadow: 0 7px 20px rgba(18, 43, 77, 0.05);
      backdrop-filter: blur(18px) !important;
    }

    .view-nav-button {
      min-width: 112px !important;
      padding: 10px 17px !important;
      border-radius: 10px !important;
      color: var(--ink-500) !important;
      font-size: 13px !important;
      transition: background 0.18s, color 0.18s, transform 0.18s;
    }

    .view-nav-button:hover {
      background: var(--blue-50) !important;
      color: var(--blue-600) !important;
    }

    .view-nav-button.active {
      background: var(--navy-800) !important;
      color: #fff !important;
      box-shadow: 0 5px 12px rgba(18, 58, 115, 0.2);
    }

    main {
      max-width: 1160px;
      margin: 30px auto 90px;
      padding: 0 28px;
    }

    section {
      margin-bottom: 20px;
      padding: 28px;
      border: 1px solid rgba(214, 224, 236, 0.9);
      border-radius: 18px;
      background: var(--surface);
      box-shadow: var(--shadow-sm);
    }

    .app-view:not([hidden]) > * {
      animation: surfaceIn 0.28s ease both;
    }

    .app-view:not([hidden]) > *:nth-child(2) { animation-delay: 0.04s; }
    .app-view:not([hidden]) > *:nth-child(3) { animation-delay: 0.08s; }

    @keyframes surfaceIn {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }

    h2 {
      color: var(--ink-900);
      font-size: 21px;
      font-weight: 800;
      letter-spacing: -0.5px;
    }

    .section-label {
      margin-bottom: 5px;
      color: var(--blue-600);
      font-size: 10px;
      letter-spacing: 1.7px;
    }

    .quick-summary {
      position: relative;
      overflow: hidden;
      padding: 26px !important;
      background: linear-gradient(128deg, var(--navy-950), var(--navy-800)) !important;
      border: 0;
      box-shadow: 0 18px 40px rgba(7, 27, 54, 0.18);
    }

    .quick-summary::after {
      position: absolute;
      width: 240px;
      height: 240px;
      right: -100px;
      bottom: -170px;
      content: "";
      border: 42px solid rgba(70, 146, 245, 0.13);
      border-radius: 50%;
      pointer-events: none;
    }

    .quick-summary .section-label {
      color: #75adf9;
    }

    .quick-summary h2 {
      color: #fff;
      font-size: 21px;
    }

    .summary-setting,
    .quick-summary-note {
      color: rgba(255, 255, 255, 0.68) !important;
      font-size: 12px !important;
    }

    .quick-summary-grid {
      position: relative;
      z-index: 1;
      gap: 11px !important;
    }

    .quick-summary-card {
      min-height: 104px;
      padding: 16px !important;
      border: 1px solid rgba(255, 255, 255, 0.12) !important;
      border-radius: 13px !important;
      background: rgba(255, 255, 255, 0.08) !important;
      backdrop-filter: blur(7px);
    }

    .quick-summary-card span {
      color: rgba(255, 255, 255, 0.68) !important;
      font-size: 12px !important;
    }

    .quick-summary-card strong {
      color: #fff;
      font-size: 31px !important;
      letter-spacing: -1px;
    }

    .quick-summary-card small {
      color: rgba(255, 255, 255, 0.58) !important;
      font-size: 12px !important;
    }

    .quick-summary-card.remaining-card {
      background: #fff !important;
      box-shadow: 0 9px 22px rgba(0, 0, 0, 0.12);
    }

    .quick-summary-card.remaining-card span { color: var(--ink-500) !important; }
    .quick-summary-card.remaining-card strong { color: var(--blue-600); }
    .quick-summary-card.remaining-card small { color: var(--ink-500) !important; }

    .dashboard-title {
      align-items: center;
    }

    .total-progress > span {
      color: var(--ink-500);
      font-size: 12px;
    }

    .total-progress strong {
      color: var(--navy-800);
      font-size: 35px;
    }

    .total-progress small {
      color: var(--ink-500);
    }

    .progress-bar {
      height: 10px;
      margin: 22px 0 24px;
      background: #e7edf5;
      box-shadow: inset 0 1px 2px rgba(16, 42, 75, 0.06);
    }

    .progress-fill {
      background: linear-gradient(90deg, var(--blue-600), #4f9aff);
      box-shadow: 0 2px 8px rgba(23, 105, 224, 0.24);
    }

    .status-grid,
    .eligibility-grid {
      gap: 11px;
    }

    .status-card,
    .eligibility-card {
      position: relative;
      overflow: hidden;
      padding: 17px;
      border: 1px solid var(--line);
      border-radius: 13px;
      background: #f8fafd;
      transition: transform 0.18s, border-color 0.18s, box-shadow 0.18s;
    }

    .status-card::before,
    .eligibility-card::before {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      content: "";
      background: #b9cceb;
    }

    .status-card:hover,
    .eligibility-card:hover {
      transform: translateY(-2px);
      border-color: #c4d5eb;
      box-shadow: var(--shadow-sm);
    }

    .status-card p,
    .eligibility-name {
      color: var(--ink-700);
      font-size: 12px;
      font-weight: 600;
    }

    .status-card strong,
    .eligibility-card strong {
      color: var(--ink-900);
    }

    .remaining {
      color: var(--ink-500);
      font-size: 12px;
    }

    .graduation-status,
    .eligibility-badge {
      padding: 8px 12px;
      border: 1px solid #e6d49d;
      background: var(--amber-soft);
      color: var(--amber);
      font-size: 12px;
    }

    .graduation-status.success,
    .eligibility-badge.success {
      border-color: #bfe6d4;
      background: var(--green-soft);
      color: var(--green);
    }

    .eligibility-description {
      color: var(--ink-900);
      font-size: 14px;
    }

    .eligibility-sub,
    .eligibility-note {
      color: var(--ink-500);
      font-size: 12px;
    }

    .eligibility-message {
      padding: 15px 17px;
      border: 1px solid var(--line);
      border-radius: 11px;
      background: #f7f9fc;
      color: var(--ink-700);
      font-size: 13px;
    }

    .eligibility-message.success {
      border-color: #c8e9d9;
      background: var(--green-soft);
      color: var(--green);
    }

    .compact-toggle {
      min-height: 38px;
      padding: 8px 12px !important;
      border-color: var(--line) !important;
      border-radius: 9px !important;
      color: var(--ink-500) !important;
      font-size: 11px !important;
      transition: 0.18s;
    }

    .compact-toggle:hover {
      border-color: var(--blue-500) !important;
      background: var(--blue-50) !important;
      color: var(--blue-600) !important;
    }

    .planner-panel,
    .timetable-panel,
    .utility-panel {
      padding: 22px !important;
      border: 1px solid #d9e4f2 !important;
      border-radius: 16px !important;
      background: linear-gradient(145deg, #f8fbff, #f2f6fc) !important;
      box-shadow: none !important;
    }

    .planner-header h3,
    .timetable-header h3 {
      color: var(--ink-900);
      font-size: 18px !important;
    }

    .planner-header p,
    .timetable-header p {
      color: var(--ink-500) !important;
      font-size: 12px !important;
    }

    .planner-total,
    .term-credit-total {
      padding: 9px 12px !important;
      border: 1px solid #d7e4f6;
      color: var(--blue-600) !important;
      font-size: 12px !important;
      box-shadow: var(--shadow-sm);
    }

    .term-card,
    .schedule-subject,
    .quick-add-course,
    .schedule-empty,
    .planner-empty {
      border: 1px solid var(--line) !important;
      border-radius: 12px !important;
      background: #fff !important;
      box-shadow: 0 3px 10px rgba(18, 43, 77, 0.04);
    }

    .term-card.active {
      border-color: var(--blue-500) !important;
      box-shadow: 0 0 0 3px rgba(45, 125, 240, 0.1) !important;
    }

    .term-card.warning {
      border-color: #e7bd6b !important;
      background: #fffbf3 !important;
    }

    .plan-term-select,
    .subject-status-select,
    .timetable-term,
    .quick-add-course select,
    .schedule-row select,
    .schedule-row input,
    .missing-status-select,
    input[type="search"] {
      min-height: 40px;
      border: 1px solid #d6dfeb !important;
      border-radius: 9px !important;
      background: #fff !important;
      color: var(--ink-700) !important;
    }

    .quick-add-course button,
    .term-timetable-button,
    .utility-button:not(.danger) {
      min-height: 40px;
      border-color: var(--blue-600) !important;
      background: var(--blue-600) !important;
      color: #fff !important;
      box-shadow: 0 5px 12px rgba(23, 105, 224, 0.16);
    }

    .quick-add-course button:hover,
    .term-timetable-button:hover,
    .utility-button:not(.danger):hover {
      background: #0f58c5 !important;
    }

    .timetable-grid {
      border-color: #d4dfec !important;
      border-radius: 12px !important;
      box-shadow: var(--shadow-sm);
    }

    .timetable-cell.header,
    .timetable-cell.period {
      background: #edf4fd !important;
      color: var(--navy-800) !important;
      font-weight: 800 !important;
    }

    .timetable-cell.has-class {
      background: var(--blue-50) !important;
      box-shadow: inset 3px 0 0 var(--blue-500);
    }

    .timetable-official-note {
      margin-top: 12px !important;
      padding: 11px 13px;
      border: 1px solid #dbe6f4;
      border-radius: 9px;
      background: rgba(255, 255, 255, 0.74);
      color: var(--ink-500) !important;
      font-size: 12px !important;
      line-height: 1.65;
    }

    .filter-label {
      color: var(--ink-500);
      font-size: 11px;
    }

    .tabs {
      gap: 8px;
      padding-bottom: 3px;
    }

    .category-tab,
    .year-tab {
      min-height: 38px;
      padding: 8px 16px;
      border: 1px solid var(--line);
      background: #f6f8fb;
      color: var(--ink-700);
      font-size: 12px;
      font-weight: 650;
    }

    .category-tab:hover,
    .year-tab:hover {
      border-color: #b9cdeb;
      background: var(--blue-50);
      color: var(--blue-600);
    }

    .category-tab.active,
    .year-tab.active {
      border-color: var(--navy-800);
      background: var(--navy-800);
      color: #fff;
      box-shadow: 0 5px 12px rgba(18, 58, 115, 0.16);
    }

    .subject-grid {
      gap: 11px;
    }

    .subject-card {
      min-height: 84px;
      padding: 16px;
      border: 1px solid var(--line);
      border-radius: 13px;
      background: #fff;
      box-shadow: 0 2px 8px rgba(18, 43, 77, 0.035);
    }

    .subject-card:hover {
      transform: translateY(-2px);
      border-color: #aac4e7;
      box-shadow: var(--shadow-sm);
    }

    .subject-card.completed {
      border-color: #bfe3d2;
      background: #f2fbf7;
    }

    .subject-card.planned {
      border-color: #cfc5ee !important;
      background: #f8f6ff !important;
    }

    .subject-card.in-progress {
      border-color: #bcd3f3;
      background: #f2f7ff;
    }

    .subject-name {
      color: var(--ink-900);
      font-size: 14px;
      line-height: 1.45;
    }

    .subject-meta {
      color: var(--ink-500);
      font-size: 11px;
    }

    .custom-check {
      width: 25px;
      height: 25px;
      border-color: #afbdd0;
      border-radius: 7px;
    }

    .subject-check:checked + .custom-check {
      border-color: var(--green);
      background: var(--green);
      box-shadow: 0 4px 9px rgba(24, 134, 91, 0.18);
    }

    .missing-grid {
      gap: 10px;
    }

    .missing-card {
      padding: 14px 15px;
      border: 1px solid #eadfae;
      border-left: 4px solid #d7a62c;
      border-radius: 11px;
      background: #fffdf6;
    }

    .missing-card strong {
      color: var(--ink-900);
      font-size: 13px;
    }

    .missing-card span {
      color: var(--ink-500);
      font-size: 11px;
    }

    .all-completed {
      border: 1px solid #bee4d2;
      background: var(--green-soft);
      color: var(--green);
      font-size: 13px;
    }

    .mobile-bottom-nav {
      background: rgba(255, 255, 255, 0.93) !important;
      border-top-color: #d7e1ed !important;
      box-shadow: 0 -8px 26px rgba(18, 43, 77, 0.1);
      backdrop-filter: blur(18px) !important;
    }

    .mobile-nav-button {
      color: var(--ink-500) !important;
    }

    .mobile-nav-button.active {
      color: var(--blue-600) !important;
    }

    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        scroll-behavior: auto !important;
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
      }
    }

    @media (max-width: 700px) {
      .header-inner {
        padding: 23px 17px 25px;
      }

      .header-kicker {
        align-items: flex-start;
      }

      .autosave-badge {
        padding: 5px 8px;
        font-size: 10px;
      }

      .top-header h1 {
        font-size: 27px;
      }

      .top-header .university {
        font-size: 13px;
      }

      .top-header .university span {
        display: block;
        width: fit-content;
        margin: 7px 0 0;
      }

      main {
        margin: 16px auto 86px;
        padding: 0 10px;
      }

      section {
        margin-bottom: 12px;
        padding: 17px 14px;
        border-radius: 15px;
      }

      .quick-summary {
        padding: 19px 15px !important;
      }

      .quick-summary-grid {
        gap: 8px !important;
      }

      .quick-summary-card {
        min-height: 93px;
        padding: 13px !important;
      }

      .quick-summary-card strong {
        font-size: 26px !important;
      }

      .planner-panel,
      .timetable-panel,
      .utility-panel {
        padding: 15px !important;
      }

      .status-card,
      .eligibility-card {
        padding: 14px 12px;
      }

      .subject-card {
        min-height: 0;
        padding: 14px;
      }

      .subject-status-select,
      .plan-term-select,
      .missing-status-select {
        font-size: 13px !important;
      }
    }

    @media (max-width: 390px) {
      .header-kicker {
        display: block;
      }

      .autosave-badge {
        margin-top: 9px;
      }

      .quick-summary-grid {
        grid-template-columns: 1fr 1fr !important;
      }
    }
  `;

  document.head.appendChild(style);
})();
