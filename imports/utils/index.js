import {settings} from "../settings";

export const instanceId = process.env.GALAXY_CONTAINER_ID
  ? process.env.GALAXY_CONTAINER_ID
  : process.env.APP_ID + '-' + process.env.METEOR_PARENT_PID;
