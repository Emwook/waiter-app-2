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
  // Generate a random 5-letter identifier
  const randomIdentifier1 = generateRandomLetters(3);
  const randomIdentifier2 = generateRandomLetters(4);

  // Combine all parts into a single string with hyphens as separators
  const reservationId = `${randomIdentifier1}-${randomIdentifier2}`;

  return reservationId;
};
