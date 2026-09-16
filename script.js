
(() => {
  "use strict";

  /* ============================================================
     01. DOM REFERENCES
  ============================================================ */

  const steps = Array.from(document.querySelectorAll(".step"));

  const progressRail = document.querySelector(".progress-rail");
  const progressFill = document.getElementById("progressFill");

  const envelope = document.getElementById("envelope");
  const envelopeWrap = document.getElementById("envelopeWrap");
  const openBtn = document.getElementById("openBtn");

  const continueBtn = document.getElementById("continueBtn");
  const introLines = document.querySelectorAll(".intro-line");

  const letterStep = document.getElementById("step-letter");
  const letterScroll = document.getElementById("letterScroll");
  const letterCards = document.querySelectorAll(".letter-card");

  const oneMoreThingBtn = document.getElementById("oneMoreThingBtn");
  const toFinalBtn = document.getElementById("toFinalBtn");

  const heartToggle = document.getElementById("heartToggle");

  const audio = document.getElementById("audio");
  const player = document.getElementById("player");
  const playerToggle = document.getElementById("playerToggle");
  const playerIcon = document.getElementById("playerIcon");
  const playerStatus = document.getElementById("playerStatus");
  const playerBar = document.getElementById("playerBar");
  const playerBarFill = document.getElementById("playerBarFill");

  const canvas = document.getElementById("bg-canvas");
  const ctx = canvas ? canvas.getContext("2d") : null;


  /* ============================================================
     02. STEP NAVIGATION
  ============================================================ */

  let currentStep = "opening";
  let isTransitioning = false;

  function goToStep(name) {

    if (currentStep === name || isTransitioning) return;

    const target = steps.find(
      (step) => step.dataset.step === name
    );

    if (!target) return;

    isTransitioning = true;

    steps.forEach((step) => {

      step.classList.toggle(
        "step--active",
        step.dataset.step === name
      );

    });

    currentStep = name;

    if (progressRail) {

      progressRail.classList.toggle(
        "is-visible",
        name === "letter"
      );

    }

    if (name === "letter") {

      resetLetterScroll();

    }

    window.scrollTo({
      top: 0,
      behavior: "auto"
    });

    setTimeout(() => {

      isTransitioning = false;

    }, 900);

  }

  function resetLetterScroll() {

    if (!letterStep) return;

    letterStep.scrollTop = 0;

    if (letterScroll) {
      letterScroll.scrollTop = 0;
    }

    if (progressFill) {
      progressFill.style.width = "0%";
    }

  }


  /* ============================================================
     03. AMBIENT PARTICLES
  ============================================================ */

  let particles = [];
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let animationFrame = null;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  function resizeCanvas() {

    if (!canvas || !ctx) return;

    dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;

    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  }

  function makeParticles() {

    const count = window.innerWidth < 640 ? 14 : 26;

    particles = Array.from(
      { length: count },
      () => ({

        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,

        r: Math.random() * 2.2 + 0.6,

        speed: Math.random() * 0.16 + 0.035,

        drift: Math.random() * 0.4 - 0.2,

        opacity: Math.random() * 0.24 + 0.08,

        isHeart: Math.random() < 0.15

      })
    );

  }

  function drawHeart(x, y, size, opacity) {

    if (!ctx) return;

    ctx.save();

    ctx.globalAlpha = opacity;

    ctx.translate(x, y);

    ctx.scale(size / 10, size / 10);

    ctx.beginPath();

    ctx.moveTo(0, 3);

    ctx.bezierCurveTo(0, 1, -3, -2, -6, -1);
    ctx.bezierCurveTo(-9, 0.5, -6, 4, 0, 8);
    ctx.bezierCurveTo(6, 4, 9, 0.5, 6, -1);
    ctx.bezierCurveTo(3, -2, 0, 1, 0, 3);

    ctx.fillStyle = "#d98da3";

    ctx.fill();

    ctx.restore();

  }

  function tick() {

    if (!ctx || !canvas) return;

    ctx.clearRect(
      0,
      0,
      window.innerWidth,
      window.innerHeight
    );

    for (const particle of particles) {

      particle.y -= particle.speed;

      particle.x +=
        Math.sin(particle.y * 0.01) *
        particle.drift *
        0.2;

      if (particle.y < -20) {

        particle.y = window.innerHeight + 20;
        particle.x = Math.random() * window.innerWidth;

      }

      if (particle.isHeart) {

        drawHeart(
          particle.x,
          particle.y,
          particle.r * 4,
          particle.opacity
        );

      } else {

        ctx.beginPath();

        ctx.arc(
          particle.x,
          particle.y,
          particle.r,
          0,
          Math.PI * 2
        );

        ctx.fillStyle =
          `rgba(230, 170, 185, ${particle.opacity})`;

        ctx.fill();

      }

    }

    animationFrame = requestAnimationFrame(tick);

  }

  function startParticles() {

    resizeCanvas();
    makeParticles();

    if (!prefersReducedMotion) {
      animationFrame = requestAnimationFrame(tick);
    }

  }

  startParticles();

  window.addEventListener("resize", () => {

    resizeCanvas();
    makeParticles();

  }, { passive: true });


  /* ============================================================
     04. OPENING NAME REVEAL
  ============================================================ */

  document.querySelectorAll("#nameReveal span").forEach(
    (span, index) => {

      span.style.animationDelay =
        `${0.5 + index * 0.06}s`;

    }
  );


  /* ============================================================
     05. AUDIO PLAYER
  ============================================================ */

  let audioStarted = false;

  function updatePlayer(isPlaying) {

    if (!playerIcon || !playerToggle) return;

    playerIcon.textContent = isPlaying ? "❧" : "♡";

    playerIcon.classList.toggle(
      "is-playing",
      isPlaying
    );

    playerToggle.setAttribute(
      "aria-pressed",
      String(isPlaying)
    );

    if (playerStatus) {

      playerStatus.textContent =
        isPlaying ? "NOW PLAYING" : "PAUSED";

    }

  }

  function showPlayer() {

    if (player) {
      player.classList.add("is-shown");
    }

  }

  function startAudio() {

    if (audioStarted) return;

    audioStarted = true;

    showPlayer();

    if (!audio) return;

    audio.play()
      .then(() => {

        updatePlayer(true);

      })
      .catch(() => {

        updatePlayer(false);

      });

  }

  function toggleAudio() {

    if (!audio) return;

    showPlayer();

    if (audio.paused) {

      audio.play()
        .then(() => {

          updatePlayer(true);

        })
        .catch(() => {

          updatePlayer(false);

        });

    } else {

      audio.pause();

      updatePlayer(false);

    }

  }

  if (playerToggle) {

    playerToggle.addEventListener(
      "click",
      toggleAudio
    );

  }

  if (audio) {

    audio.addEventListener("play", () => {
      updatePlayer(true);
    });

    audio.addEventListener("pause", () => {
      updatePlayer(false);
    });

    audio.addEventListener("timeupdate", () => {

      if (!audio.duration || !playerBarFill) return;

      const percentage =
        (audio.currentTime / audio.duration) * 100;

      playerBarFill.style.width = `${percentage}%`;

      if (playerBar) {

        playerBar.setAttribute(
          "aria-valuenow",
          percentage.toFixed(1)
        );

      }

    });

  }

  function seekAudio(clientX) {

    if (!audio || !audio.duration || !playerBar) return;

    const rect = playerBar.getBoundingClientRect();

    const ratio = Math.max(
      0,
      Math.min(
        1,
        (clientX - rect.left) / rect.width
      )
    );

    audio.currentTime = ratio * audio.duration;

  }

  if (playerBar) {

    playerBar.addEventListener("click", (event) => {

      seekAudio(event.clientX);

    });

    playerBar.addEventListener("keydown", (event) => {

      if (!audio || !audio.duration) return;

      if (
        event.key !== "ArrowLeft" &&
        event.key !== "ArrowRight"
      ) return;

      event.preventDefault();

      const amount = event.key === "ArrowRight"
        ? 5
        : -5;

      audio.currentTime = Math.max(
        0,
        Math.min(
          audio.duration,
          audio.currentTime + amount
        )
      );

    });

  }


  /* ============================================================
     06. OPENING — ENVELOPE INTERACTION
  ============================================================ */

  let envelopeOpened = false;

  function openEnvelope() {

    if (envelopeOpened) return;

    envelopeOpened = true;

    if (envelope) {
      envelope.classList.add("is-open");
    }

    startAudio();

    setTimeout(() => {

      goToStep("intro");

    }, 1000);

  }

  if (openBtn) {

    openBtn.addEventListener(
      "click",
      openEnvelope
    );

  }

  if (envelope) {

    envelope.addEventListener(
      "click",
      openEnvelope
    );

    envelope.addEventListener(
      "keydown",
      (event) => {

        if (
          event.key === "Enter" ||
          event.key === " "
        ) {

          event.preventDefault();

          openEnvelope();

        }

      }
    );

  }


  /* ============================================================
     07. INTRO REVEAL
  ============================================================ */

  let introRevealed = false;

  function revealIntro() {

    if (introRevealed) return;

    introRevealed = true;

    introLines.forEach((line, index) => {

      setTimeout(() => {

        line.classList.add("is-shown");

      }, 450 + index * 950);

    });

  }

  if (continueBtn) {

    continueBtn.addEventListener(
      "click",
      () => goToStep("letter")
    );

  }

  const introObserver = new MutationObserver(() => {

    const introStep = document.getElementById("step-intro");

    if (
      introStep &&
      introStep.classList.contains("step--active")
    ) {

      revealIntro();

    }

  });

  const introStep = document.getElementById("step-intro");

  if (introStep) {

    introObserver.observe(introStep, {

      attributes: true,
      attributeFilter: ["class"]

    });

  }


  /* ============================================================
     08. LETTER CARD REVEAL
  ============================================================ */

  function spawnHeart() {

    const el = document.createElement("span");

    el.className = "spawned-heart";

    el.textContent =
      Math.random() < 0.5 ? "🤍" : "♡";

    el.style.left =
      `${10 + Math.random() * 80}vw`;

    el.style.bottom = "12vh";

    el.style.fontSize =
      `${0.8 + Math.random() * 0.8}rem`;

    document.body.appendChild(el);

    setTimeout(() => {

      el.remove();

    }, 3600);

  }

  const cardObserver = new IntersectionObserver(
    (entries) => {

      entries.forEach((entry) => {

        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");

        if (Math.random() < 0.65) {
          spawnHeart();
        }

      });

    },
    {
      threshold: 0.28
    }
  );

  letterCards.forEach((card) => {

    cardObserver.observe(card);

  });


  /* ============================================================
     09. LETTER PROGRESS
  ============================================================ */

  function updateLetterProgress() {

    if (!letterStep || !progressFill) return;

    const max =
      letterStep.scrollHeight - letterStep.clientHeight;

    const percentage = max > 0
      ? (letterStep.scrollTop / max) * 100
      : 0;

    progressFill.style.width =
      `${Math.max(0, Math.min(100, percentage))}%`;

  }

  if (letterStep) {

    letterStep.addEventListener(
      "scroll",
      updateLetterProgress,
      { passive: true }
    );

  }


  /* ============================================================
     10. LETTER -> HIDDEN MESSAGE
  ============================================================ */

  if (oneMoreThingBtn) {

    oneMoreThingBtn.addEventListener(
      "click",
      () => goToStep("hidden")
    );

  }


  /* ============================================================
     11. HIDDEN MESSAGE -> FINAL
  ============================================================ */

  if (toFinalBtn) {

    toFinalBtn.addEventListener(
      "click",
      () => goToStep("final")
    );

  }


  /* ============================================================
     12. FINAL HEART BURST
  ============================================================ */

  function createBurstHeart(originX, originY, index, count) {

    const el = document.createElement("span");

    el.className = "burst-heart";

    el.textContent =
      Math.random() < 0.5 ? "❤️" : "🤍";

    el.style.position = "fixed";
    el.style.zIndex = "100";
    el.style.pointerEvents = "none";

    el.style.left = `${originX}px`;
    el.style.top = `${originY}px`;

    const angle =
      (Math.PI * 2 * index) / count +
      Math.random() * 0.3;

    const distance =
      70 + Math.random() * 65;

    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance - 30;

    el.style.setProperty(
      "--fly-to",
      `translate(${dx}px, ${dy}px)`
    );

    document.body.appendChild(el);

    setTimeout(() => {

      el.remove();

    }, 1500);

  }

  if (heartToggle) {

    heartToggle.addEventListener("click", () => {

      heartToggle.classList.remove("is-burst");

      void heartToggle.offsetWidth;

      heartToggle.classList.add("is-burst");

      const rect =
        heartToggle.getBoundingClientRect();

      const originX =
        rect.left + rect.width / 2;

      const originY =
        rect.top + rect.height / 2;

      const count = 10;

      for (let index = 0; index < count; index++) {

        createBurstHeart(
          originX,
          originY,
          index,
          count
        );

      }

    });

  }


  /* ============================================================
     13. DESKTOP CURSOR HEARTS
  ============================================================ */

  const isDesktop =
    window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;

  if (isDesktop && !prefersReducedMotion) {

    let lastSpawn = 0;

    window.addEventListener("mousemove", (event) => {

      const now = performance.now();

      if (now - lastSpawn < 240) return;

      lastSpawn = now;

      if (Math.random() > 0.28) return;

      const el = document.createElement("span");

      el.className = "cursor-heart";

      el.textContent = "♡";

      el.style.left = `${event.clientX}px`;
      el.style.top = `${event.clientY}px`;

      document.body.appendChild(el);

      setTimeout(() => {

        el.remove();

      }, 1800);

    });

  }


  /* ============================================================
     14. INITIAL STATE
  ============================================================ */

  steps.forEach((step) => {

    step.classList.toggle(
      "step--active",
      step.dataset.step === "opening"
    );

  });

  if (progressRail) {

    progressRail.classList.remove("is-visible");

  }

  if (player) {

    player.classList.remove("is-shown");

  }

  if (animationFrame && prefersReducedMotion) {

    cancelAnimationFrame(animationFrame);

  }

})();