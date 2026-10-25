// The 1.4x distance is configured in HeroOverlap; this only compensates native flow.
// Direct progress intentionally has no temporal interpolation or trailing movement.
export function foregroundOffset(progress: number, extra: number) {
  return -extra * (1 - Math.max(0, Math.min(1, progress)));
}

// Hold the first 10%; stagger each line by 4% of the existing hero sequence.
export function headlineProgress(progress: number, line: number) {
  return Math.max(0, Math.min(1, (progress - .10 - line * .04) / .58));
}
