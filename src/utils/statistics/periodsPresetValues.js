const today = new Date();
today.setHours(0, 0, 0, 0);

const dayForCalcMonday = new Date(today);
const dayForCalcPrevWeek = new Date(today);

const dayOfWeek = dayForCalcMonday.getDay(); // 0 is Sunday, 1 is Monday, ..., 6 is Saturday
const diff = dayForCalcMonday.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // adjust when today is Sunday

dayForCalcPrevWeek.setDate(dayForCalcMonday.getDate() - 7); // Go back 7 days for the previous week

const diffSundayPrevWeek = dayForCalcPrevWeek.getDate() - dayOfWeek + 7; // adjust when today is Sunday
const sundayOfPreviousWeek = new Date(dayForCalcPrevWeek);
sundayOfPreviousWeek.setDate(diffSundayPrevWeek);

const diffMondayPrevWeek = dayForCalcPrevWeek.getDate() - dayOfWeek + 1; // adjust when today is Sunday
const mondayOfPreviousWeek = new Date(dayForCalcPrevWeek);
mondayOfPreviousWeek.setDate(diffMondayPrevWeek);

const mondayOfCurrentWeek = new Date(dayForCalcMonday.setDate(diff));

const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);


export function periodByPreset(preset) {
  const period = {};
  if (preset === "today") {
    period.startSearchDay = today.getTime();
    period.endSearchDay = today.getTime();
  }
  if (preset === "current_week") {
    period.startSearchDay = mondayOfCurrentWeek.getTime();
    period.endSearchDay = today.getTime();
  }
  if (preset === "previous_week") {
    period.startSearchDay = mondayOfPreviousWeek.getTime();
    period.endSearchDay = sundayOfPreviousWeek.getTime();
  }
  if (preset === "current_month") {
    period.startSearchDay = firstDayOfMonth.getTime();
    period.endSearchDay = today.getTime();
  }
  return period;
}
