export async function getWeekPlusYear (date: Date): Promise<string> {
    const year = date.getFullYear();
    const oneJan = new Date(year, 0, 1);
    const dayOfYear = Math.ceil((date.getTime() - oneJan.getTime()) / 86400000);
    const weekNumber = Math.ceil((dayOfYear + oneJan.getDay() + 1) / 7);
    return `${String(weekNumber).padStart(2, '0')}, ${year}`;
};