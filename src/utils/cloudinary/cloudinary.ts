import { envConfig } from "../../config/env.config";

export const Buildimage = (publicId: string): string => {
  console.log("hello");
  let a = envConfig.cloudinaryBaseUrl;
  console.log("a", a);
  let url = `${envConfig.cloudinaryBaseUrl}/${publicId}`;
  console.log("url", url);
  return url;
};
