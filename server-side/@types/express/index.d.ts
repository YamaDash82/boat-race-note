import { UsersModel } from "declarations/models/users.model"

declare namespace Express {
  export interface Request {
    user: UsersModel
  }
}