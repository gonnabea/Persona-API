import { Request, Response } from "express";
import { checkEmailValid, checkPassword } from "../utils";
import { CreateAccount, Login } from "../@types/auth";
import User from "../models/users";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Promise<CreateAccount>
export const createAccount = async (req: Request, res: Response) => {
    try {
        const { email, password, password2 } = req.body;

        const checkPW: boolean = password === password2;

        const emailValid: boolean = checkEmailValid(email);

        if (checkPW && emailValid) {
            const saltRounds = 10;

            // 비밀번호 해시 & 솔트 처리
            const salt = await bcrypt.genSalt(saltRounds);
            const hashed = await bcrypt.hash(password, salt);

            // 계정 생성 성공
            const newUser = await User.create({
                email,
                password: hashed,
            });

            res.send({
                ok: true,
                msg: "new account created.",
                status: 200,
                data: newUser,
            });
        } else if (!emailValid) {
            // 유효하지 않은 이메일 형식일 경우
            res.send({
                ok: false,
                error: "Email is not valid.",
                status: 400,
            });
        } else if (!checkPW) {
            // 비밀번호가 다를 경우
            res.send({
                ok: false,
                error: "Password not matching.",
                status: 400,
            });
        } else {
            // 알 수 없는 오류일 경우
            res.send({
                ok: false,
                error: "Can't create account.",
                status: 400,
            });
        }
    } catch (err) {
        console.log("createAccount:: ", err);
    }
};

// Promise<Login>
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({
            email,
        });

        if (!user) {
            return res.send({
                ok: false,
                status: 400,
                error: "",
            });
        }

        const pwVerified = await bcrypt.compare(password, user.password);

        const pwValid = checkPassword(password);

        if (!pwValid) {
            return res.send({
                ok: false,
                status: 400,
                error: "1. password should include 1 character and number \n 2. password should at least 8 characters",
            });
        }

        if (!pwVerified) {
            return res.send({
                ok: false,
                status: 400,
                error: "wrong password",
            });
        }

        if (pwVerified && pwValid) {
            const token = jwt.sign(
                {
                    data: {
                        email,
                    },
                },
                process.env.SECRET_KEY,
                { expiresIn: "2h", algorithm: "HS256" },
            ); // 2시간 뒤 토큰 만료

            console.log(token);

            return res.send({
                ok: true,
                status: 200,
                msg: "login success.",
                token,
            });
        }
    } catch (err) {
        console.log("login:: ", err);
    }
};
