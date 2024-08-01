export const formatHour = (hour: number): string => {
    const hours = Math.floor(hour);
    const minutes = Math.round((hour - hours) * 60);

    // Ensuring two digits for hours and minutes
    const formattedHour = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');

    return `${formattedHour}:${formattedMinutes}`;
}

export const parseFormattedHour = (time: string): number => {
    const [hoursStr, minutesStr] = time.split(':');
    let hours = parseInt(hoursStr, 10);
    let minutes = parseInt(minutesStr, 10);

    // Floor minutes to the nearest multiple of 15
    minutes = Math.floor(minutes / 15) * 15;

    // Convert hours and minutes to a decimal hour value
    const decimalHour = hours + (minutes / 60);

    return decimalHour;
};
