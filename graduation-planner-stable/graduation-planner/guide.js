(() => {
  const header =
    document.querySelector(".header-inner");

  if (!header) return;

  const style =
    document.createElement("style");

  style.textContent = `
    .guide-button {
      margin-top: 15px;
      padding: 8px 13px;
      border: 1px solid #dfe3e8;
      border-radius: 9px;
      background: #fff;
      color: #555c66;
      font: inherit;
      font-size: 11px;
      font-weight: 700;
      cursor: pointer;
    }

    .guide-button:hover {
      border-color: #2775ff;
      color: #2775ff;
    }

    .guide-overlay {
      position: fixed;
      z-index: 2000;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 18px;
      background: rgba(20, 25, 35, 0.48);
      opacity: 0;
      visibility: hidden;
      transition: 0.2s;
    }

    .guide-overlay.show {
      opacity: 1;
      visibility: visible;
    }

    .guide-dialog {
      width: min(520px, 100%);
      max-height: 85vh;
      overflow-y: auto;
      padding: 24px;
      background: #fff;
      border-radius: 18px;
      box-shadow:
        0 20px 60px rgba(0, 0, 0, 0.25);
      transform: translateY(10px);
      transition: 0.2s;
    }

    .guide-overlay.show .guide-dialog {
      transform: translateY(0);
    }

    .guide-dialog h2 {
      margin: 0 0 6px;
      font-size: 21px;
    }

    .guide-intro {
      margin: 0 0 18px;
      color: #777e88;
      font-size: 12px;
      line-height: 1.7;
    }

    .guide-steps {
      display: grid;
      gap: 9px;
    }

    .guide-step {
      display: grid;
      grid-template-columns: 28px 1fr;
      gap: 10px;
      padding: 11px;
      background: #f7f8fa;
      border-radius: 10px;
    }

    .guide-number {
      display: flex;
      width: 28px;
      height: 28px;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: #22262d;
      color: #fff;
      font-size: 11px;
      font-weight: 700;
    }

    .guide-step strong {
      display: block;
      margin-bottom: 3px;
      font-size: 12px;
    }

    .guide-step p {
      margin: 0;
      color: #707782;
      font-size: 11px;
      line-height: 1.6;
    }

    .guide-warning {
      margin: 14px 0 0;
      padding: 11px 12px;
      border-radius: 9px;
      background: #fff8e8;
      color: #805f20;
      font-size: 10px;
      line-height: 1.7;
    }

    .guide-close {
      width: 100%;
      margin-top: 16px;
      padding: 11px;
      border: 0;
      border-radius: 10px;
      background: #22262d;
      color: #fff;
      font: inherit;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
    }

    body.guide-open {
      overflow: hidden;
    }

    @media (max-width: 700px) {
      .guide-button {
        min-height: 40px;
      }

      .guide-dialog {
        padding: 19px 16px;
        border-radius: 15px;
      }
    }
  `;

  document.head.appendChild(style);

  const button =
    document.createElement("button");

  button.className = "guide-button";
  button.type = "button";
  button.textContent = "？ 使い方";

  header.appendChild(button);

  const overlay =
    document.createElement("div");

  overlay.className = "guide-overlay";

  overlay.innerHTML = `
    <div
      class="guide-dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="guideTitle"
    >
      <h2 id="guideTitle">
        卒業単位チェッカーの使い方
      </h2>

      <p class="guide-intro">
        科目の状況を入力すると、単位数と
        卒業・卒着条件を自動で確認できます。
      </p>

      <div class="guide-steps">
        <div class="guide-step">
          <span class="guide-number">1</span>

          <div>
            <strong>科目の状況を選ぶ</strong>

            <p>
              各科目を「未履修・履修予定・履修中・
              修得済み」から選択します。
            </p>
          </div>
        </div>

        <div class="guide-step">
          <span class="guide-number">2</span>

          <div>
            <strong>履修計画を確認する</strong>

            <p>
              履修予定の学期を指定し、
              学期ごとの単位数を確認します。
            </p>
          </div>
        </div>

        <div class="guide-step">
          <span class="guide-number">3</span>

          <div>
            <strong>時間割を作る</strong>

            <p>
              曜日・時限・教室を入力します。
              授業が重なると警告が表示されます。
            </p>
          </div>
        </div>

        <div class="guide-step">
          <span class="guide-number">4</span>

          <div>
            <strong>判定へ反映する</strong>

            <p>
              履修中・履修予定を合計に含めるか、
              スイッチで個別に変更できます。
            </p>
          </div>
        </div>

        <div class="guide-step">
          <span class="guide-number">5</span>

          <div>
            <strong>バックアップする</strong>

            <p>
              入力後はバックアップを保存しておくと、
              データ消失に備えられます。
            </p>
          </div>
        </div>
      </div>

      <p class="guide-warning">
        ※ 本アプリの判定は履修計画の補助を
        目的としています。最終確認は大学の
        履修要覧・成績表・教務担当窓口で
        行ってください。
      </p>

      <button
        class="guide-close"
        type="button"
      >
        使い始める
      </button>
    </div>
  `;

  document.body.appendChild(overlay);

  function openGuide() {
    overlay.classList.add("show");

    document.body.classList.add(
      "guide-open"
    );

    setTimeout(() => {
      overlay
        .querySelector(".guide-close")
        .focus();
    }, 0);
  }

  function closeGuide() {
    overlay.classList.remove("show");

    document.body.classList.remove(
      "guide-open"
    );

    localStorage.setItem(
      "guideSeen",
      "true"
    );
  }

  button.addEventListener(
    "click",
    openGuide
  );

  overlay
    .querySelector(".guide-close")
    .addEventListener(
      "click",
      closeGuide
    );

  overlay.addEventListener(
    "click",
    event => {
      if (event.target === overlay) {
        closeGuide();
      }
    }
  );

  document.addEventListener(
    "keydown",
    event => {
      if (
        event.key === "Escape" &&
        overlay.classList.contains("show")
      ) {
        closeGuide();
      }
    }
  );

  if (
    localStorage.getItem("guideSeen") !==
    "true"
  ) {
    openGuide();
  }
})();