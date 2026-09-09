(() => {
  const baseUrl = "https://yousonghu80-creator.github.io/graduation-credit-checker/";
  const title = `東洋大学 理工学部 機械工学科 ${academicYear}年度入学生｜卒業単位チェッカー・履修計画`;
  const description = `東洋大学理工学部機械工学科の${academicYear}年度入学生向けに、卒業要件・必修科目・履修計画・時間割をまとめて確認できる非公式ツールです。`;
  const canonicalUrl = `${baseUrl}?year=${academicYear}`;

  document.title = title;

  function setMeta(selector, attribute, value) {
    const element = document.querySelector(selector);
    if (element) element.setAttribute(attribute, value);
  }

  setMeta('meta[name="description"]', "content", description);
  setMeta('meta[property="og:title"]', "content", title);
  setMeta('meta[property="og:description"]', "content", description);

  const canonical = document.createElement("link");
  canonical.rel = "canonical";
  canonical.href = canonicalUrl;
  document.head.appendChild(canonical);

  const ogUrl = document.createElement("meta");
  ogUrl.setAttribute("property", "og:url");
  ogUrl.content = canonicalUrl;
  document.head.appendChild(ogUrl);

  const schema = document.createElement("script");
  schema.type = "application/ld+json";
  schema.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `卒業単位チェッカー・履修計画 ${academicYear}年度版`,
    description,
    url: canonicalUrl,
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web",
    isAccessibleForFree: true,
    inLanguage: "ja"
  });
  document.head.appendChild(schema);
})();
