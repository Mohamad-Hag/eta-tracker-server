const checkTimingStatus = (
  eta: number, // ETA in seconds from now
  eventTime: string, // ISO string
  earlyThresholdMinutes: number = 5 // Optional threshold for "too early"
): {
  isLate: boolean;
  lateAmount: number;     // in seconds
  isEarly: boolean;
  earlyAmount: number;    // in seconds
} => {
  const now = Date.now(); // current time in ms
  const arrivalTimeInMs = now + eta * 1000;
  const eventTimeInMs = new Date(eventTime).getTime();

  const isLate = arrivalTimeInMs > eventTimeInMs;
  const isEarly = arrivalTimeInMs < eventTimeInMs - earlyThresholdMinutes * 60 * 1000;

  const lateAmount = isLate ? Math.floor((arrivalTimeInMs - eventTimeInMs) / 1000) : 0;
  const earlyAmount = isEarly ? Math.floor((eventTimeInMs - arrivalTimeInMs) / 1000) : 0;

  return {
    isLate,
    lateAmount,
    isEarly,
    earlyAmount,
  };
};

export default checkTimingStatus;
