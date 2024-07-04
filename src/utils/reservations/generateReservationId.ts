const generateRandomLetters = (length: number): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export const generateReservationId = (
  date: string,
  repeat: string
): string => {
  // Convert date from 'dd/mm/yy' to 'ddmmyy'
  const dateParts = date.split('/');
  const formattedDate = dateParts.join('');

  // Map the repeat string to its corresponding single character
  let repeatChar: string;
  switch (repeat.toLowerCase()) {
    case 'false':
      repeatChar = 'F';
      break;
    case 'daily':
      repeatChar = 'D';
      break;
    case 'weekly':
      repeatChar = 'W';
      break;
    case 'monthly':
      repeatChar = 'M';
      break;
    case 'yearly':
      repeatChar = 'Y';
      break;
    default:
      repeatChar = 'U'; // Unknown
  }

  // Generate a random 5-letter identifier
  const randomIdentifier = generateRandomLetters(6);

  // Combine all parts into a single string with hyphens as separators
  const reservationId = `${repeatChar}${formattedDate}${randomIdentifier}`;

  return reservationId;
};
