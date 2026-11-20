const ANNOUNCEMENT_SOUND_SRC = "/sounds/announcement.wav";

let announcementAudio: HTMLAudioElement | null = null;
let audioContext: AudioContext | null = null;
let unlocked = false;
let pendingPlay = false;
let unlockListenersAttached = false;

function getAnnouncementAudio() {
  if (typeof window === "undefined") return null;
  if (!announcementAudio) {
    announcementAudio = new Audio(ANNOUNCEMENT_SOUND_SRC);
    announcementAudio.preload = "auto";
    announcementAudio.volume = 0.7;
  }
  return announcementAudio;
}

function getAudioContext() {
  if (typeof window === "undefined") return null;
  const Ctx =
    window.AudioContext ||
    (window as Window & { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!Ctx) return null;
  if (!audioContext) audioContext = new Ctx();
  return audioContext;
}

/** Short synthesized chime — works after AudioContext is unlocked. */
function playSynthesizedChime() {
  const ctx = getAudioContext();
  if (!ctx) return false;

  const now = ctx.currentTime;
  const gain = ctx.createGain();
  gain.connect(ctx.destination);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.35, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

  for (const [freq, startOffset] of [
    [880, 0],
    [1174.66, 0.08],
  ] as const) {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;
    osc.connect(gain);
    osc.start(now + startOffset);
    osc.stop(now + 0.4);
  }

  return true;
}

async function playHtmlAudio() {
  const audio = getAnnouncementAudio();
  if (!audio) return false;
  audio.currentTime = 0;
  await audio.play();
  return true;
}

/**
 * Call once from a user gesture (or attach via ensureAnnouncementSoundUnlock).
 * Unlocks autoplay and replays any toast sound that was blocked.
 */
export async function unlockAnnouncementSound() {
  if (typeof window === "undefined") return;

  const ctx = getAudioContext();
  if (ctx && ctx.state === "suspended") {
    try {
      await ctx.resume();
    } catch {
      // ignore
    }
  }

  // Prime HTMLAudioElement inside the gesture so later plays are allowed.
  const audio = getAnnouncementAudio();
  if (audio) {
    try {
      audio.muted = true;
      await audio.play();
      audio.pause();
      audio.currentTime = 0;
      audio.muted = false;
    } catch {
      // ignore priming failures
    }
  }

  unlocked = true;

  if (pendingPlay) {
    pendingPlay = false;
    playAnnouncementSound();
  }
}

/** Attach one-time listeners so the first click/keypress unlocks audio. */
export function ensureAnnouncementSoundUnlock() {
  if (typeof window === "undefined" || unlockListenersAttached) return () => {};

  unlockListenersAttached = true;

  const onInteract = () => {
    void unlockAnnouncementSound();
    window.removeEventListener("pointerdown", onInteract, true);
    window.removeEventListener("keydown", onInteract, true);
  };

  window.addEventListener("pointerdown", onInteract, true);
  window.addEventListener("keydown", onInteract, true);

  return () => {
    window.removeEventListener("pointerdown", onInteract, true);
    window.removeEventListener("keydown", onInteract, true);
    unlockListenersAttached = false;
  };
}

/** Plays the announcement chime. Queues if the browser blocks autoplay. */
export function playAnnouncementSound() {
  if (typeof window === "undefined") return;

  const attempt = async () => {
    try {
      if (unlocked) {
        const playedFile = await playHtmlAudio().catch(() => false);
        if (playedFile) return;
        playSynthesizedChime();
        return;
      }

      // Try anyway (some browsers allow it); otherwise queue for first gesture.
      await playHtmlAudio();
      unlocked = true;
    } catch {
      pendingPlay = true;
      if (unlocked) {
        playSynthesizedChime();
        pendingPlay = false;
      }
    }
  };

  void attempt();
}
