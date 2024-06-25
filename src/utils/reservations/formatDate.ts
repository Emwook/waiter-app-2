export const formatDate = (timestamp: any): string => {
    const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
    return date.toLocaleDateString(); // Adjust format here if needed
  };