export const formatDate = (date: Date): { dateString: string; hour: number } => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() is zero-based
  const year = String(date.getFullYear()).slice(-2); // get last two digits of the year
  const hour = date.getHours();
  const minute = date.getMinutes();
  const hourDecimal = hour + minute / 60;

  const dateString = `${day}/${month}/${year}`;

  return { dateString, hour: hourDecimal };
};


export const parseDate = (dateString: string, hour: number): Date => {
  if (!dateString) {
    console.error("parseDate received an undefined or invalid dateString, corresponding date hour:", hour);
    return new Date();
  }

  const [day, month, year] = dateString.split('/').map(Number);
  
  const hourInt = Math.floor(hour);
  const minute = (hour - hourInt) * 60;
  return new Date(`20${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hourInt).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`);
};


export const getPreviousDate = (date: string): string => {
  const dateSource = parseDate(date, 12);
  const selectedDate = new Date(dateSource);
  selectedDate.setDate(selectedDate.getDate() - 1);
  const { dateString } = formatDate(selectedDate)
  return dateString;
};

export const getNextDate = (date: string): string => {
  const dateSource = parseDate(date, 12);
  const selectedDate = new Date(dateSource);
  selectedDate.setDate(selectedDate.getDate() + 1);
  const { dateString } = formatDate(selectedDate)
  return dateString;
};