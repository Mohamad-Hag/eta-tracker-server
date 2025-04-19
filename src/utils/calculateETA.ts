// import TransportMode from "../types/TransportMode";
// import axios from "axios";
// import { AppLocation } from "./parseLocationString";

// type CalculateETAReturnType = {
//   duration: number;
//   trafficDelay: number;
// } | null;

// const etaCache = new Map<
//   string,
//   { data: CalculateETAReturnType; timestamp: number }
// >();
// const THROTTLE_LIMIT_MS = 1000; // 1 second
// const CACHE_EXPIRY_MS = 60000; // 1 minute
// let lastRequestTime = 0;

// export const calculateETA = async (
//   location: AppLocation,
//   eventLocation: AppLocation,
//   transportMode: TransportMode = "car"
// ): Promise<CalculateETAReturnType> => {
//   try {
//     const hereApiKey = process.env.HERE_API_KEY;
//     if (!hereApiKey) throw new Error("HERE API Key is missing.");

//     const cacheKey = `${transportMode}-${location.latitude},${location.longitude}-${eventLocation.latitude},${eventLocation.longitude}`;
//     const now = Date.now();

//     // Check cache
//     const cached = etaCache.get(cacheKey);
//     if (cached && now - cached.timestamp < CACHE_EXPIRY_MS) {
//       return cached.data;
//     }

//     // Throttle requests
//     if (now - lastRequestTime < THROTTLE_LIMIT_MS) {

//       console.warn("Throttling ETA request to avoid rate limit.");
//       return null;
//     }
//     lastRequestTime = now;

//     const response = await axios.get(`https://router.hereapi.com/v8/routes`, {
//       params: {
//         transportMode,
//         origin: `${location.latitude},${location.longitude}`,
//         destination: `${eventLocation.latitude},${eventLocation.longitude}`,
//         return: "travelSummary,summary",
//         apiKey: hereApiKey,
//       },
//     });

//     const section = response.data?.routes?.[0]?.sections?.[0];
//     const routeSummary = section?.travelSummary;

//     if (!section || !routeSummary)
//       throw new Error("Invalid response from HERE API.");

//     const result = {
//       duration: routeSummary.duration,
//       trafficDelay: routeSummary.trafficDelay || 0,
//     };

//     etaCache.set(cacheKey, { data: result, timestamp: now });
//     return result;
//   } catch (error) {
//     console.error("Error fetching ETA:", error);
//     return null;
//   }
// };
import TransportMode from "../types/TransportMode";
import { AppLocation } from "./parseLocationString";

type CalculateETAReturnType = {
  duration: number;
  trafficDelay: number;
} | null;

// Utility to simulate network delay
const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const calculateETA = async (
  location: AppLocation,
  eventLocation: AppLocation,
  transportMode: TransportMode = "car"
): Promise<CalculateETAReturnType> => {
  console.log("Mock calculateETA called with:");
  console.log("From:", location);
  console.log("To:", eventLocation);
  console.log("Mode:", transportMode);

  // Simulate delay like a real API
  await wait(500 + Math.random() * 1000);

  // Simulate some dynamic values
  const distance = Math.sqrt(
    Math.pow(location.latitude - eventLocation.latitude, 2) +
      Math.pow(location.longitude - eventLocation.longitude, 2)
  );

  const baseDuration = distance * 10000 + Math.random() * 300; // randomize a bit
  const trafficDelay =
    transportMode === "car" ? Math.floor(Math.random() * 60) : 0;

  return {
    duration: Math.floor(baseDuration),
    trafficDelay,
  };
};
