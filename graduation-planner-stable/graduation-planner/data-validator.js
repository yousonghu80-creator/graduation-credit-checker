(() => {
  const errors = [];
  const warnings = [];
  const codes = new Set();
  const allowedCategories = new Set(["基盤教育科目", "理工学基盤科目", "専門科目"]);
  const allowedTypes = new Set(["必修", "選択必修", "選択"]);

  subjects.forEach((subject, index) => {
    const label = subject.name || `科目${index + 1}`;

    if (!subject.code || !subject.name) errors.push(`${label}: コードまたは科目名がありません`);
    if (codes.has(subject.code)) errors.push(`${label}: 科目コードが重複しています`);
    codes.add(subject.code);

    if (!Number.isFinite(subject.credits) || subject.credits <= 0) {
      errors.push(`${label}: 単位数が不正です`);
    }

    if (![1, 2, 3, 4].includes(subject.year)) errors.push(`${label}: 配当学年が不正です`);
    if (!allowedCategories.has(subject.category)) errors.push(`${label}: 科目区分が不正です`);
    if (!allowedTypes.has(subject.type)) errors.push(`${label}: 必修区分が不正です`);

    if (
      academicYear === 2025 &&
      subject.category === "基盤教育科目" &&
      !["foundation", "common"].includes(subject.educationGroup)
    ) {
      errors.push(`${label}: 2025年度の教育区分がありません`);
    }
  });

  const requirements = graduationRequirements.graduation;
  const available = {
    scienceRequired: subjects
      .filter(item => item.category === "理工学基盤科目" && item.type === "必修")
      .reduce((sum, item) => sum + item.credits, 0),
    professionalRequired: subjects
      .filter(item => item.category === "専門科目" && item.type === "必修")
      .reduce((sum, item) => sum + item.credits, 0),
    professionalElective: subjects
      .filter(item => item.category === "専門科目" && item.type === "選択必修")
      .reduce((sum, item) => sum + item.credits, 0)
  };

  if (available.professionalRequired < requirements.professional.required) {
    errors.push("専門必修の登録単位数が卒業要件を下回っています");
  }

  if (available.professionalElective < requirements.professional.requiredElective) {
    errors.push("専門選択必修の登録単位数が卒業要件を下回っています");
  }

  if (available.scienceRequired === 0) warnings.push("理工学基盤の必修科目がありません");

  window.dataValidationReport = {
    ok: errors.length === 0,
    errors,
    warnings,
    subjectCount: subjects.length,
    academicYear
  };

  if (errors.length) console.error("科目データ検査", errors);
  if (warnings.length) console.warn("科目データ検査", warnings);
})();
