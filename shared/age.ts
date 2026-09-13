export interface AgeData {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
}

function isValidDate(date: Date, year: number, month: number, day: number): boolean {
  return date.getFullYear() === year && date.getMonth() === month && date.getDate() === day;
}

function addMonthClamped(date: Date): Date {
  const result = new Date(date);
  const day = result.getDate();
  result.setDate(1);
  result.setMonth(result.getMonth() + 1);
  const lastDay = new Date(result.getFullYear(), result.getMonth() + 1, 0).getDate();
  result.setDate(Math.min(day, lastDay));
  return result;
}

export function parseBirthDate(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText) - 1;
  const day = Number(dayText);
  const date = new Date(year, month, day);

  return isValidDate(date, year, month, day) ? date : null;
}

export function calculateAge(birthDate: string, now = new Date()): AgeData | null {
  const birth = parseBirthDate(birthDate);
  if (!birth || birth.getTime() > now.getTime()) return null;

  let years = now.getFullYear() - birth.getFullYear();
  let anniversary = new Date(birth);
  anniversary.setFullYear(birth.getFullYear() + years);

  // Treat February 29 birthdays as February 28 in non-leap years.
  if (birth.getMonth() === 1 && birth.getDate() === 29 && anniversary.getMonth() !== 1) {
    anniversary = new Date(now.getFullYear(), 1, 28, birth.getHours(), birth.getMinutes(), birth.getSeconds(), birth.getMilliseconds());
  }

  if (anniversary.getTime() > now.getTime()) {
    years--;
    anniversary = new Date(birth);
    anniversary.setFullYear(birth.getFullYear() + years);
  }

  let months = 0;
  let monthStart = new Date(anniversary);
  while (true) {
    const nextMonth = addMonthClamped(monthStart);
    if (nextMonth.getTime() > now.getTime()) break;
    monthStart = nextMonth;
    months++;
  }

  const remainderMs = now.getTime() - monthStart.getTime();
  const dayMs = 24 * 60 * 60 * 1000;
  const hourMs = 60 * 60 * 1000;
  const minuteMs = 60 * 1000;
  const days = Math.floor(remainderMs / dayMs);
  const hours = Math.floor((remainderMs % dayMs) / hourMs);
  const minutes = Math.floor((remainderMs % hourMs) / minuteMs);
  const seconds = Math.floor((remainderMs % minuteMs) / 1000);

  return {
    years,
    months,
    days,
    hours,
    minutes,
    seconds,
    totalMs: now.getTime() - birth.getTime(),
  };
}
