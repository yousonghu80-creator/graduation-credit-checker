(() => {
  if (academicYear !== 2025) return;

  const commonFields = new Set(["学問の基礎", "健康・スポーツ科学", "総合・学際"]);

  subjects.forEach(subject => {
    if (subject.category === "基盤教育科目") {
      subject.educationGroup = commonFields.has(subject.field) ? "common" : "foundation";
    }
  });

  const removedNames = new Set([
    "機械システムのモデリング", "機械のための数学A", "機械のための数学B",
    "力学総合演習", "学際・新領域科学A", "学際・新領域科学B",
    "全学総合A", "全学総合B", "全学総合C", "全学総合D",
    "全学総合E", "全学総合F"
  ]);

  for (let index = subjects.length - 1; index >= 0; index--) {
    if (removedNames.has(subjects[index].name)) subjects.splice(index, 1);
  }

  const renames = { "先端技術": "機械工学の先端技術", "CAD/CAM演習": "CAD演習" };
  subjects.forEach(subject => {
    if (renames[subject.name]) subject.name = renames[subject.name];
  });

  subjects.push({
    code: "Y25-MTH201", name: "機械のための数学", credits: 2,
    category: "専門科目", type: "選択必修", group: "選択必修", year: 2
  });
})();
