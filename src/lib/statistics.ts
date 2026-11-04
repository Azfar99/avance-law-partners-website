export function countPracticeEntries(lawyers: ReadonlyArray<{ practice_areas?: readonly string[] }>) {
  // Entries shared by different lawyers are intentionally counted for each lawyer.
  return lawyers.reduce((total, lawyer) => total + (lawyer.practice_areas?.length ?? 0), 0)
}

export function yearsOfPractice(established: string, currentYear = new Date().getFullYear()) {
  const year = Number(established)
  return Number.isInteger(year) && year >= 1800 && year <= currentYear ? currentYear - year : 0
}
