const checkIfLate = (
  eta: number,
  eventTime: string
): { isLate: boolean; lateAmount: number } => {
  const eventTimeInMs = new Date(eventTime).getTime(); // Convert event start time to milliseconds
  const etaInMs = eta * 1000; // ETA in seconds, convert to milliseconds

  // Check if the ETA is after the event time
  if (etaInMs > eventTimeInMs) {
    const lateAmountInMs = etaInMs - eventTimeInMs;
    const lateAmountInMinutes = lateAmountInMs / (1000 * 60); // Convert late amount to minutes
    return {
      isLate: true,
      lateAmount: lateAmountInMinutes,
    };
  }

  return {
    isLate: false,
    lateAmount: 0,
  };
};

export default checkIfLate;