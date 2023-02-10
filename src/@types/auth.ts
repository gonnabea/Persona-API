import User from "../models/users"
import { CoreOutput } from "./common"

export interface CreateAccount extends CoreOutput {
    data?: any
}