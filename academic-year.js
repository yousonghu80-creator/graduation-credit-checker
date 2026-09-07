(() => {
  const nativeGet = Storage.prototype.getItem;
  const nativeSet = Storage.prototype.setItem;
  const nativeRemove = Storage.prototype.removeItem;
  const selected = Number(nativeGet.call(localStorage, "selectedAcademicYear") || 2024);

  window.academicYear = [2024, 2025].includes(selected) ? selected : 2024;

  const managedKeys = new Set([
    "subjectStatuses", "completedSubjects", "plannedTerms", "scheduleData",
    "otherCredits", "includeInProgress", "includePlanned", "timetableTerm"
  ]);

  const storageKey = key => managedKeys.has(String(key))
    ? `${key}:year-${window.academicYear}`
    : String(key);

  const migrationKey = "academicYearStorageMigrationV1";

  if (
    window.academicYear === 2024 &&
    nativeGet.call(localStorage, migrationKey) !== "done"
  ) {
    managedKeys.forEach(key => {
      const legacy = nativeGet.call(localStorage, key);
      const scoped = nativeGet.call(localStorage, storageKey(key));
      if (legacy !== null && scoped === null) {
        nativeSet.call(localStorage, storageKey(key), legacy);
      }
    });

    nativeSet.call(localStorage, migrationKey, "done");
  }

  Storage.prototype.getItem = function(key) {
    return nativeGet.call(this, storageKey(key));
  };

  Storage.prototype.setItem = function(key, value) {
    return nativeSet.call(this, storageKey(key), value);
  };

  Storage.prototype.removeItem = function(key) {
    return nativeRemove.call(this, storageKey(key));
  };

  window.setAcademicYear = year => {
    const next = Number(year);
    if (![2024, 2025].includes(next) || next === window.academicYear) return;
    nativeSet.call(localStorage, "selectedAcademicYear", String(next));
    location.reload();
  };
})();
