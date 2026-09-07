(() => {
  const termKey = (year, semester) => `${year}-${semester}`;

  function courseTerms(admissionYear) {
    const terms = [];

    for (let offset = 0; offset < 4; offset++) {
      terms.push(termKey(admissionYear + offset, "spring"));
      terms.push(termKey(admissionYear + offset, "fall"));
    }

    return terms;
  }

  function currentTerm(date = new Date()) {
    const month = date.getMonth() + 1;
    const year = month <= 3 ? date.getFullYear() - 1 : date.getFullYear();
    const semester = month >= 4 && month <= 9 ? "spring" : "fall";
    return termKey(year, semester);
  }

  function distribute({ terms, existingByTerm, remaining, cap = 24 }) {
    let left = Math.max(0, remaining);

    const allocations = terms.map((term, index) => {
      const existing = existingByTerm[term] || 0;
      const capacity = Math.max(0, cap - existing);
      const termsLeft = terms.length - index;
      const suggested = Math.min(capacity, Math.ceil(left / termsLeft));

      left -= suggested;

      return {
        term,
        existing,
        suggested,
        target: existing + suggested,
        overLimit: existing > cap
      };
    });

    return { allocations, shortage: left };
  }

  window.PaceEngine = { courseTerms, currentTerm, distribute };
})();
