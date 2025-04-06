import { Duration, intervalToDuration } from "date-fns";

const secondsToDuration = (seconds: number): Duration => {
  const result = intervalToDuration({ start: 0, end: seconds * 1000 });
  return result;
};

export default secondsToDuration;
