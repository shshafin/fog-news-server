/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { JwtPayload } from "jsonwebtoken";
declare module "multer";

declare global {
  namespace Express {
    interface Request {
      user: JwtPayload | null;
    }
    export interface Request {
      file: any;
      files: any;
    }
  }
}
