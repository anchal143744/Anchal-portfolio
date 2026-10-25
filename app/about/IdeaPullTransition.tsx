"use client";

import {
  AnimationEvent,
  KeyboardEvent,
  MouseEvent,
  PointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

type InteractionState = "idle" | "hovering" | "animating" | "dragging" | "built";

const DEFAULT_WEB_PATH = "M150 91 Q455 54 792 76";
const DRAG_START = { x: 150, y: 91 };

export function IdeaPullTransition() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const ideaRef = useRef<HTMLButtonElement | null>(null);
  const draggingRef = useRef(false);
  const reducedMotionRef = useRef(false);
  const dragOriginRef = useRef({ pointerX: 0, pointerY: 0, boxX: 0, boxY: 0 });
  const hoverRafRef = useRef<number | null>(null);
  const [interactionState, setInteractionState] = useState<InteractionState>("idle");
  const [playKey, setPlayKey] = useState(0);
  const [webPath, setWebPath] = useState(DEFAULT_WEB_PATH);

  const clearHoverFrame = useCallback(() => {
    if (hoverRafRef.current === null) return;
    window.cancelAnimationFrame(hoverRafRef.current);
    hoverRafRef.current = null;
  }, []);

  const setHoverMotion = useCallback((x = 0, y = 0, rotation = 0, scale = 1) => {
    const stage = stageRef.current;
    if (!stage) return;

    stage.style.setProperty("--hand-hover-x", `${x}px`);
    stage.style.setProperty("--hand-hover-y", `${y}px`);
    stage.style.setProperty("--hand-hover-rotate", `${rotation}deg`);
    stage.style.setProperty("--hand-hover-scale", `${scale}`);
  }, []);

  const setIdeaMotion = useCallback((x = 0, y = 0, rotation = 0, scale = 1) => {
    const stage = stageRef.current;
    if (!stage) return;

    stage.style.setProperty("--idea-drag-x", `${x}px`);
    stage.style.setProperty("--idea-drag-y", `${y}px`);
    stage.style.setProperty("--idea-drag-rotate", `${rotation}deg`);
    stage.style.setProperty("--idea-drag-scale", `${scale}`);
  }, []);

  const updateDragWeb = useCallback((x: number, y: number) => {
    const stage = stageRef.current;
    const idea = ideaRef.current;
    if (!stage || !idea) return;

    const stageRect = stage.getBoundingClientRect();
    const ideaRect = idea.getBoundingClientRect();
    const endX = ((ideaRect.left + ideaRect.width * 0.12 + x - stageRect.left) / stageRect.width) * 1000;
    const endY = ((ideaRect.top + ideaRect.height * 0.52 + y - stageRect.top) / stageRect.height) * 170;
    const distance = Math.max(90, endX - DRAG_START.x);
    const controlX = DRAG_START.x + distance * 0.48;
    const controlY = Math.min(130, Math.max(34, (DRAG_START.y + endY) / 2 - distance * 0.035));

    setWebPath(`M${DRAG_START.x} ${DRAG_START.y} Q${controlX.toFixed(1)} ${controlY.toFixed(1)} ${endX.toFixed(1)} ${endY.toFixed(1)}`);
  }, []);

  const resetHoverMotion = useCallback(() => {
    clearHoverFrame();
    setHoverMotion();
  }, [clearHoverFrame, setHoverMotion]);

  const resetInteraction = useCallback(() => {
    draggingRef.current = false;
    resetHoverMotion();
    setIdeaMotion();
    setWebPath(DEFAULT_WEB_PATH);
    setInteractionState("idle");
  }, [resetHoverMotion, setIdeaMotion]);

  const completeInteraction = useCallback(() => {
    draggingRef.current = false;
    resetHoverMotion();
    setIdeaMotion();
    setWebPath(DEFAULT_WEB_PATH);
    setInteractionState("built");
  }, [resetHoverMotion, setIdeaMotion]);

  const playAnimation = useCallback(() => {
    if (interactionState === "animating" || interactionState === "dragging") return;

    resetHoverMotion();
    setIdeaMotion();
    setWebPath(DEFAULT_WEB_PATH);

    if (reducedMotionRef.current) {
      setInteractionState("built");
      return;
    }

    setInteractionState("animating");
    setPlayKey((key) => key + 1);
  }, [interactionState, resetHoverMotion, setIdeaMotion]);

  const handlePointerEnter = () => {
    if (interactionState !== "idle" && interactionState !== "hovering") return;
    playAnimation();
  };

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (interactionState !== "idle" && interactionState !== "hovering" && interactionState !== "built") return;

    clearHoverFrame();
    hoverRafRef.current = window.requestAnimationFrame(() => {
      const stage = stageRef.current;
      if (!stage) return;

      const rect = stage.getBoundingClientRect();
      const normalizedX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      const normalizedY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      const isOverHandZone =
        event.clientX < rect.left + rect.width * 0.28 &&
        event.clientY > rect.top + rect.height * 0.24;

      setHoverMotion(
        Math.max(-6, Math.min(6, normalizedX * 6)),
        Math.max(-8, Math.min(8, normalizedY * 8)) + (isOverHandZone ? -2 : 0),
        Math.max(-2, Math.min(2, normalizedX * 2)),
        isOverHandZone ? 1.015 : 1,
      );
    });
  };

  const handlePointerLeave = () => {
    if (draggingRef.current) return;

    resetHoverMotion();
    resetInteraction();
  };

  const handleIdeaPointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    if (interactionState === "animating") return;
    if (event.pointerType === "touch" || window.matchMedia("(max-width: 760px)").matches) return;
    if (interactionState === "built") return;

    event.preventDefault();
    event.stopPropagation();
    draggingRef.current = true;
    resetHoverMotion();
    setInteractionState("dragging");
    event.currentTarget.setPointerCapture(event.pointerId);
    dragOriginRef.current = {
      pointerX: event.clientX,
      pointerY: event.clientY,
      boxX: 0,
      boxY: 0,
    };
    updateDragWeb(0, 0);
  };

  const handleIdeaPointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (!draggingRef.current) return;

    event.preventDefault();
    const stage = stageRef.current;
    const idea = ideaRef.current;
    if (!stage || !idea) return;

    const stageRect = stage.getBoundingClientRect();
    const ideaRect = idea.getBoundingClientRect();
    const minX = -Math.max(0, ideaRect.left - stageRect.left - 38);
    const maxX = Math.max(0, stageRect.right - ideaRect.right - 38);
    const minY = -Math.max(0, ideaRect.top - stageRect.top - 22);
    const maxY = Math.max(0, stageRect.bottom - ideaRect.bottom - 22);
    const rawX = event.clientX - dragOriginRef.current.pointerX;
    const rawY = event.clientY - dragOriginRef.current.pointerY;
    const x = Math.max(minX, Math.min(maxX, rawX));
    const y = Math.max(minY, Math.min(maxY, rawY));
    const progress = Math.min(1, Math.abs(x) / Math.max(1, stageRect.width * 0.34));

    setIdeaMotion(x, y, -progress * 2.2, 1 + progress * 0.018);
    setHoverMotion(progress * 4, -progress * 3, -progress * 1.2);
    updateDragWeb(x, y);
  };

  const finishDrag = (event: PointerEvent<HTMLButtonElement>) => {
    if (!draggingRef.current) return;

    event.preventDefault();
    const stage = stageRef.current;
    const rawX = event.clientX - dragOriginRef.current.pointerX;
    const shouldBuild = stage ? rawX <= -stage.getBoundingClientRect().width * 0.28 : false;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    if (shouldBuild) {
      completeInteraction();
      return;
    }

    draggingRef.current = false;
    resetHoverMotion();
    setIdeaMotion();
    setWebPath(DEFAULT_WEB_PATH);
    setInteractionState("idle");
  };

  const handleIdeaClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (interactionState === "animating" || interactionState === "dragging") return;
    if (interactionState === "built") {
      resetInteraction();
      return;
    }
    playAnimation();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();

    if (interactionState === "built") {
      resetInteraction();
      return;
    }

    playAnimation();
  };

  const handleAnimationEnd = (event: AnimationEvent<HTMLDivElement>) => {
    if (event.animationName !== "builtWordIn") return;
    if (interactionState !== "animating") return;
    completeInteraction();
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncReducedMotion = () => {
      reducedMotionRef.current = mediaQuery.matches;
    };

    syncReducedMotion();
    mediaQuery.addEventListener("change", syncReducedMotion);

    return () => {
      mediaQuery.removeEventListener("change", syncReducedMotion);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      resetHoverMotion();
      if (interactionState === "dragging") {
        resetInteraction();
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, [interactionState, resetHoverMotion, resetInteraction]);

  const isBuilt = interactionState === "built";

  return (
    <section
      aria-label="Idea transforms into built interaction"
      className={`idea-transition about-section is-${interactionState}`}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      ref={sectionRef}
    >
      <p className="eyebrow">Pulling Ideas Into Reality</p>
      <div
        className="idea-stage"
        key={playKey}
        onAnimationEnd={handleAnimationEnd}
        ref={stageRef}
      >
        <div className="hand-main-motion">
          <div className="hand-hover-motion">
            <svg
              aria-hidden="true"
              className="idea-arm"
              fill="none"
              viewBox="0 0 380 220"
            >
              <g className="idea-speed-lines">
                <path d="M5 78 L58 65" />
                <path d="M-2 109 L48 103" />
                <path d="M8 143 L66 151" />
                <path className="speed-accent" d="M30 54 L82 43" />
              </g>

              <g className="idea-sleeve-group">
                <path
                  className="idea-sleeve-shadow"
                  d="M-20 101 C33 78 89 70 145 83 L134 181 C76 166 25 169 -24 191 Z"
                />
                <path
                  className="idea-sleeve"
                  d="M-18 90 C38 68 98 64 156 82 C148 112 143 147 137 184 C82 169 29 170 -24 195 Z"
                />
                <path
                  className="idea-sleeve-grain"
                  d="M8 102 C49 89 91 87 133 98 M14 129 C55 121 92 123 130 137 M4 157 C45 151 84 154 125 169"
                />
                <path
                  className="idea-cuff"
                  d="M133 77 C150 80 165 88 177 100 C167 124 159 151 155 179 C141 183 129 182 118 176 C121 142 125 108 133 77 Z"
                />
              </g>

              <g className="idea-hand-group">
                <path
                  className="idea-hand-fill"
                  d="M160 90 C178 75 201 74 218 90 C229 100 235 112 249 117 C260 121 269 127 275 138 C282 151 276 165 263 172 C244 182 218 179 196 166 C175 153 158 135 151 115 C148 105 151 96 160 90 Z"
                />
                <path
                  className="idea-hand-outline"
                  d="M160 90 C178 75 201 74 218 90 C229 100 235 112 249 117 C260 121 269 127 275 138 C282 151 276 165 263 172 C244 182 218 179 196 166 C175 153 158 135 151 115 C148 105 151 96 160 90 Z"
                />
                <path
                  className="idea-finger-line pointing-finger"
                  d="M216 94 C222 70 233 52 250 37 C257 31 265 35 263 44 C258 65 249 85 239 105"
                />
                <path
                  className="idea-finger-line"
                  d="M235 113 C257 100 278 95 303 96 C313 96 317 106 309 113 C291 128 271 135 249 137"
                />
                <path
                  className="idea-finger-line"
                  d="M246 134 C267 132 286 136 306 145 C315 149 315 160 306 164 C287 171 267 168 248 158"
                />
                <path
                  className="idea-finger-line"
                  d="M235 155 C250 166 262 179 271 195 C276 204 268 211 259 205 C242 194 229 182 218 166"
                />
                <path
                  className="idea-thumb-line"
                  d="M182 103 C193 112 200 123 205 139 C190 139 176 134 162 122"
                />
                <path
                  className="idea-inner-line"
                  d="M187 91 C200 94 210 103 216 117"
                />
                <path
                  className="idea-inner-line"
                  d="M194 150 C207 158 221 162 238 163"
                />
                <path
                  className="idea-inner-line"
                  d="M213 128 C220 123 229 120 239 120"
                />
                <path className="idea-nail-line" d="M249 40 C253 43 256 45 259 48" />
                <path className="idea-nail-line" d="M303 99 C305 103 306 107 304 111" />
                <path className="idea-nail-line" d="M303 148 C306 152 306 156 303 160" />
                <path className="idea-nail-line" d="M264 195 C267 198 268 201 267 204" />
              </g>

              <g className="idea-origin-spark">
                <circle className="idea-spark-dot" cx="306" cy="96" r="4" />
                <path d="M316 85 L327 76" />
                <path d="M320 99 L337 101" />
                <path d="M313 111 L324 122" />
                <path className="spark-accent" d="M303 78 L305 63" />
              </g>
            </svg>
          </div>
        </div>

        <svg
          aria-hidden="true"
          className="idea-string"
          preserveAspectRatio="none"
          viewBox="0 0 1000 170"
        >
          <path d={webPath} />
        </svg>

        <div className="idea-spark" aria-hidden="true" />

        <button
          aria-label={isBuilt ? "Reset built idea" : "Pull idea into built result"}
          aria-pressed={isBuilt}
          className="idea-object"
          onClick={handleIdeaClick}
          onKeyDown={handleKeyDown}
          onPointerCancel={finishDrag}
          onPointerDown={handleIdeaPointerDown}
          onPointerMove={handleIdeaPointerMove}
          onPointerUp={finishDrag}
          ref={ideaRef}
          type="button"
        >
          <span className="idea-word">Idea</span>
          <span className="built-word">Built ✓</span>
          <small>{isBuilt ? "Reset ↺" : "Make it real →"}</small>
        </button>
      </div>
    </section>
  );
}
