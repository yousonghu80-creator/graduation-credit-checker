(() => {
  function replaceElement(id) {
    const oldElement =
      document.getElementById(id);

    if (!oldElement) {
      return null;
    }

    const newElement =
      oldElement.cloneNode(true);

    oldElement.replaceWith(newElement);

    return newElement;
  }

  const exportButton =
    replaceElement("exportData");

  const importButton =
    replaceElement("importData");

  const importFile =
    replaceElement("importFile");

  const resetButton =
    replaceElement("resetData");

  if (
    !exportButton ||
    !importButton ||
    !importFile ||
    !resetButton
  ) {
    return;
  }

  function readObject(key) {
    try {
      const value =
        JSON.parse(
          localStorage.getItem(key)
        );

      if (
        value &&
        typeof value === "object" &&
        !Array.isArray(value)
      ) {
        return value;
      }

      return {};
    } catch {
      return {};
    }
  }

  exportButton.addEventListener(
    "click",
    () => {
      const backup = {
        app: "卒業単位チェッカー",
        version: 5,
        savedAt: new Date().toISOString(),

        subjectStatuses:
          readObject("subjectStatuses"),

        plannedTerms:
          readObject("plannedTerms"),

        scheduleData:
          readObject("scheduleData"),

        otherCredits:
          Number(
            localStorage.getItem(
              "otherCredits"
            )
          ) || 0,

        includeInProgress:
          localStorage.getItem(
            "includeInProgress"
          ) === "true",

        includePlanned:
          localStorage.getItem(
            "includePlanned"
          ) === "true",

        timetableTerm:
          localStorage.getItem(
            "timetableTerm"
          ) || ""
      };

      const blob = new Blob(
        [JSON.stringify(backup, null, 2)],
        {
          type: "application/json"
        }
      );

      const url =
        URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;

      link.download =
        `卒業単位チェッカー_${
          new Date()
            .toISOString()
            .slice(0, 10)
        }.json`;

      link.click();

      URL.revokeObjectURL(url);
    }
  );

  importButton.addEventListener(
    "click",
    () => {
      importFile.click();
    }
  );

  importFile.addEventListener(
    "change",
    async () => {
      const file =
        importFile.files[0];

      if (!file) {
        return;
      }

      try {
        const backup =
          JSON.parse(
            await file.text()
          );

        if (
          !backup ||
          backup.app !==
            "卒業単位チェッカー"
        ) {
          throw new Error();
        }

        if (
          !backup.subjectStatuses ||
          typeof backup.subjectStatuses !==
            "object"
        ) {
          throw new Error();
        }

        localStorage.setItem(
          "subjectStatuses",
          JSON.stringify(
            backup.subjectStatuses
          )
        );

        localStorage.setItem(
          "plannedTerms",
          JSON.stringify(
            backup.plannedTerms || {}
          )
        );

        localStorage.setItem(
          "scheduleData",
          JSON.stringify(
            backup.scheduleData || {}
          )
        );

        localStorage.setItem(
          "otherCredits",
          String(
            Number(
              backup.otherCredits
            ) || 0
          )
        );

        localStorage.setItem(
          "includeInProgress",
          String(
            backup.includeInProgress === true
          )
        );

        localStorage.setItem(
          "includePlanned",
          String(
            backup.includePlanned === true
          )
        );

        if (backup.timetableTerm) {
          localStorage.setItem(
            "timetableTerm",
            backup.timetableTerm
          );
        } else {
          localStorage.removeItem(
            "timetableTerm"
          );
        }

        localStorage.removeItem(
          "completedSubjects"
        );

        alert(
          "バックアップを復元しました。画面を更新します。"
        );

        location.reload();
      } catch {
        alert(
          "このファイルは復元に使用できません。"
        );

        importFile.value = "";
      }
    }
  );

  resetButton.addEventListener(
    "click",
    () => {
      const confirmed = confirm(
        "履修状況・履修計画・時間割・各設定をすべて未入力に戻しますか？"
      );

      if (!confirmed) {
        return;
      }

      [
        "subjectStatuses",
        "completedSubjects",
        "plannedTerms",
        "scheduleData",
        "otherCredits",
        "includeInProgress",
        "includePlanned",
        "timetableTerm"
      ].forEach(key => {
        localStorage.removeItem(key);
      });

      location.reload();
    }
  );
})();