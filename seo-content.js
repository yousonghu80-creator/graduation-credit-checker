(() => {
  const style = document.createElement("style");
  style.textContent = `
    .site-footer { padding: 8px 18px 38px; color: #5e6877; }
    .site-footer-inner { max-width: 1120px; margin: 0 auto; }

    .site-about {
      margin: 0;
      padding: 22px;
      border: 1px solid #e1e7ef;
      border-radius: 16px;
      background: #fff;
    }

    .site-about h2 { margin: 4px 0 9px; color: #263446; font-size: 19px; }
    .site-about > p { max-width: 760px; margin: 0; font-size: 13px; line-height: 1.75; }
    .footer-year-links { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 15px; }

    .footer-year-links a {
      padding: 9px 12px;
      border: 1px solid #dbe5f1;
      border-radius: 9px;
      background: #f5f8fc;
      color: #225da8;
      font-size: 13px;
      font-weight: 700;
      text-decoration: none;
    }

    .footer-year-links a:hover { border-color: #2775ff; background: #eef5ff; }
    .footer-year-links a[aria-current="page"] { border-color: #2775ff; background: #eaf3ff; }
    .site-about .site-disclaimer { margin-top: 14px; color: #7a8492; font-size: 12px; }

    @media (max-width: 700px) {
      .site-footer { padding: 4px 10px 104px; }
      .site-about { padding: 17px 15px; }
      .site-about h2 { font-size: 18px; line-height: 1.45; }
      .site-about > p { font-size: 13px; }
      .footer-year-links { display: grid; grid-template-columns: 1fr; }
      .footer-year-links a { min-height: 44px; display: flex; align-items: center; font-size: 14px; }
    }
  `;
  document.head.appendChild(style);

  document.querySelectorAll(".footer-year-links a").forEach(link => {
    const year = Number(new URL(link.href).searchParams.get("year"));
    if (year === academicYear) {
      link.setAttribute("aria-current", "page");
      link.textContent += "（表示中）";
    }
  });
})();
