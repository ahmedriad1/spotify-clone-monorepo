export function isBrowser() {
  return typeof window !== 'undefined';
}

export const shuffle = <T>(arr: T[][]) =>
  arr
    .flatMap((a) =>
      a
        .sort(() => Math.random() - 0.5)
        .map((v) => {
          let o = Math.random();
          return [(o++ - 0.1 + Math.random() / 5) / a.length, v];
        })
    )
    .sort(([a], [b]) => (a as any) - (b as any))
    .map((a) => a[1]) as T[];
