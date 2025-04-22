import DevModes from "../types/DevModes";

export default function getEnv(): DevModes {
  const env = (process.env.ENV as DevModes) || "development";
  console.log(`Environment: ${env}`);
  return env;
}
