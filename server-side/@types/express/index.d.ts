import { UserPayload } from "declarations/models/users.model"

declare namespace Express {
  export interface Request {
    user: {
      user: UserPayload, 
      iat: number, 
      exp: number, 
    } | UserPayload
  }
}