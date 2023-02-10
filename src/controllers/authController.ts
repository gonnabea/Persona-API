import { Request, Response } from "express";
import { checkEmailValid } from "../utils";
import { CreateAccount } from "../@types/auth";
import User from "../models/users";

export const createAccount = async (req: Request, res: Response): Promise<CreateAccount> => {
    try {
        const { email, password, password2 } = req.body;

        const checkPW : boolean = password === password2

        const emailValid : boolean = checkEmailValid(email);

        if(checkPW && emailValid) {
            // 계정 생성 성공
            const newUser = await User.create({
                email,
                password
            })

            return {
                ok: true,
                msg: "new account created.",
                status: 200,
                data: newUser
            }
        }
        else if (!checkPW) {
            // 비밀번호가 다를 경우
            return {
                ok: false,
                error: "Password not matching",
                status: 401
            }
        }
        else if (!emailValid) {
            // 유효하지 않은 이메일 형식일 경우
            return {
                ok: false,
                error: "Email is not valid",
                status: 401
            }
        }
        else {
            // 알 수 없는 오류일 경우
            return {
                ok: false,
                error: "Can't create account.",
                status: 400
            }
        }

    }
    catch(err) {
        console.log("createAccount: ", err);
    }

    
}