import { envConfig } from "../../config/env.config";

export const Buildimage = (publicId: string): string => {
  const url = `${envConfig.cloudinaryBaseUrl}/${publicId}`;
  console.log("url", url);
  return url;
};
