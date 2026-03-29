import Aos from "aos";

/** Slower than AOS default (400ms); shared so re-inits from each section stay consistent. */
export function initClassicAos(): void {
  Aos.init({
    duration: 1000,
    easing: "ease-out-cubic",
  });
}
