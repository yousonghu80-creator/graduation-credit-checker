(() => {
  const header = document.querySelector(".header-inner");
  if (!header || !window.dataValidationReport) return;

  const sources = {
    2024: {
      label: "2024年度 教育情報・理工学部規程",
      url: "https://www.toyo.ac.jp/about/data/archives/2024/"
    },
    2025: {
      label: "2025年度 東洋大学理工学部規程",
      url: "https://www.toyo.ac.jp/assets/about/sce_20250401.pdf"
    }
  };

  const source = sources[academicYear];
  const report = window.dataValidationReport;
  const panel = document.createElement("div");
  panel.className = `source-info ${report.ok ? "verified" : "error"}`;
  panel.innerHTML = `
    <span class="source-status-dot"></span>
    <span>${report.ok ? `内部データ検査済み（${report.subjectCount}科目）` : "データの確認が必要です"}</span>
    <a href="${source.url}" target="_blank" rel="noopener noreferrer">${source.label}</a>
    <span>最終照合: 2026年9月7日</span>
  `;
  header.appendChild(panel);

  const style = document.createElement("style");
  style.textContent = `
    .source-info {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 7px 11px;
      margin-top: 12px;
      color: rgba(255, 255, 255, 0.64);
      font-size: 10px;
    }

    .source-status-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #65e6ad;
      box-shadow: 0 0 0 3px rgba(101, 230, 173, 0.12);
    }

    .source-info.error .source-status-dot { background: #ff9b9b; }

    .source-info a {
      color: #a9d0ff;
      text-decoration: underline;
      text-underline-offset: 2px;
    }

    @media (max-width: 520px) {
      .source-info { align-items: flex-start; flex-direction: column; }
      .source-status-dot { display: none; }
    }
  `;
  document.head.appendChild(style);
})();
