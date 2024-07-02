export const formatDate = (timestamp: { seconds: number; nanoseconds: number }): string => {
  const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() is zero-based
  const year = String(date.getFullYear()).slice(-2); // get last two digits of the year
  return `${day}/${month}/${year}`;
};

export const parseDate = (dateString: string, hour: number): Date => {
  if (!dateString) {
    console.error("parseDate received an undefined or invalid dateString, corresponding date hour:", hour);
    return new Date(); // or handle it appropriately
  }

  const [day, month, year] = dateString.split('/').map(Number);
  
  const hourInt = Math.floor(hour); // Get the integer part of the hour
  const minute = (hour - hourInt) * 60; // Calculate the minutes from the fractional part
  return new Date(`20${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hourInt).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`);
};
