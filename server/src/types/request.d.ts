import { Request } from "express-serve-static-core";
declare module "express-serve-static-core" {
  interface Request {
    validatedBody?: any;
    userId?: string;
    isMobile?: boolean;
  }
}
