(() => {
  const list = document.getElementById(
    "missingRequiredList"
  );

  if (!list) return;

  const currentYear = new Date().getFullYear();

  const defaultTerm =
    `${currentYear}-${
      new Date().getMonth() < 7
        ? "spring"
        : "fall"
    }`;

  const style = document.createElement("style");

  style.textContent = `
    .required-inline-status {
      min-width: 112px;
      padding: 8px 9px;
      border: 1px solid #dfe3e8;
      border-radius: 8px;
      background: #fff;
      color: #3d434d;
      font: inherit;
      font-size: 11px;
      cursor: pointer;
      outline: none;
    }

    .required-inline-status:focus {
      border-color: #2775ff;
      box-shadow:
        0 0 0 3px rgba(39, 117, 255, 0.12);
    }

    @media (max-width: 500px) {
      .required-inline-status {
        width: 100%;
        min-height: 42px;
      }
    }
  `;

  document.head.appendChild(style);

  function subjectFor(card) {
    const name = card
      .querySelector("strong")
      ?.textContent.trim();

    return subjects.find(
      subject => subject.name === name
    );
  }

  function createOptions(status) {
    return `
      <option
        value="not-taken"
        ${status === "not-taken" ? "selected" : ""}
      >
        未履修
      </option>

      <option
        value="planned"
        ${status === "planned" ? "selected" : ""}
      >
        履修予定
      </option>

      <option
        value="in-progress"
        ${status === "in-progress" ? "selected" : ""}
      >
        履修中
      </option>

      <option
        value="completed"
        ${status === "completed" ? "selected" : ""}
      >
        修得済み
      </option>
    `;
  }

  function addSelects() {
    list
      .querySelectorAll(".missing-card")
      .forEach(card => {
        if (
          card.querySelector(
            ".required-inline-status"
          )
        ) {
          return;
        }

        const subject = subjectFor(card);

        if (!subject) return;

        const select =
          document.createElement("select");

        const status = statusOf(subject);

        select.className =
          "required-inline-status";

        select.dataset.code = subject.code;

        select.setAttribute(
          "aria-label",
          `${subject.name}の履修状況`
        );

        select.innerHTML =
          createOptions(status);

        card.appendChild(select);
      });
  }

  list.addEventListener("change", event => {
    const select = event.target.closest(
      ".required-inline-status"
    );

    if (!select) return;

    const code = select.dataset.code;
    const value = select.value;

    const plannedTerms =
      appStorage.readObject("plannedTerms");

    const scheduleData =
      appStorage.readObject("scheduleData");

    if (value === "not-taken") {
      delete subjectStatuses[code];
    } else {
      subjectStatuses[code] = value;
    }

    if (value === "planned") {
      plannedTerms[code] =
        plannedTerms[code] ||
        localStorage.getItem("timetableTerm") ||
        defaultTerm;
    } else {
      delete plannedTerms[code];
    }

    if (
      value === "not-taken" ||
      value === "completed"
    ) {
      delete scheduleData[code];
    }

    localStorage.setItem(
      "subjectStatuses",
      JSON.stringify(subjectStatuses)
    );

    localStorage.setItem(
      "plannedTerms",
      JSON.stringify(plannedTerms)
    );

    localStorage.setItem(
      "scheduleData",
      JSON.stringify(scheduleData)
    );

    localStorage.removeItem(
      "completedSubjects"
    );

    displaySubjects();
    calculateAll();

    document.dispatchEvent(
      new CustomEvent(
        "planner:data-changed"
      )
    );
  });

  new MutationObserver(addSelects).observe(
    list,
    {
      childList: true,
      subtree: true
    }
  );

  addSelects();
})();
