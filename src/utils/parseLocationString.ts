export interface AppLocation {
  latitude: number;
  longitude: number;
}

export const parseLocationString = (locationString: string): AppLocation => {
  const [longitude, latitude] = locationString.split(",").map(Number);
  return { latitude, longitude };
};
