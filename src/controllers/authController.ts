import { Request, Response } from "express";
import { checkEmailValid } from "../utils";
import User from "../models/users";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { ResetPasswordToken } from "../models/verify";

// Promise<CreateAccount>
export const createAccount = async (req: Request, res: Response) => {
    try {
        const { email, username, password, password2 } = req.body;

        const checkPW: boolean = password === password2;

        const emailValid: boolean = checkEmailValid(email);

        const alreadyExist = await User.find().or([{ email }, { username }]);

        console.log(checkPW);
        console.log(emailValid);
        console.log(alreadyExist);

        if (checkPW && emailValid && alreadyExist.length === 0) {
            const saltRounds = 10;

            // 비밀번호 해시 & 솔트 처리
            const salt = await bcrypt.genSalt(saltRounds);
            const hashed = await bcrypt.hash(password, salt);

            // 계정 생성 성공
            const newUser = await User.create({
                email,
                password: hashed,
                username,
            });

            res.status(200).send({
                ok: true,
                msg: "new account created.",
                status: 200,
                data: newUser,
            });
        } else if (!emailValid) {
            // 유효하지 않은 이메일 형식일 경우
            res.status(400).send({
                ok: false,
                error: "Email is not valid.",
                status: 400,
            });
        } else if (!checkPW) {
            // 비밀번호가 다를 경우
            res.status(400).send({
                ok: false,
                error: "Password not matching.",
                status: 400,
            });
        } else {
            // 알 수 없는 오류일 경우
            res.status(400).send({
                ok: false,
                error: "Can't create account.",
                status: 400,
            });
        }
    } catch (err) {
        res.status(500).send({
            ok: false,
            status: 500,
            error: err.toString(),
        });
    }
};

// Promise<Login>
export const login = async (req: Request, res: Response) => {
    try {
        const { email, username, password } = req.body;

        const user = await User.findOne({
            email,
        });

        console.log(user);

        // 사용자 없을 때 에러 반환
        if (!user) {
            return res.status(400).send({
                ok: false,
                status: 400,
                error: "cannot find an user.",
            });
        }

        // 이메일 인증 검증
        // if (!user.active) {
        //     return res.status(400).send({
        //         ok: false,
        //         status: 400,
        //         error: "This Email not validated.",
        //     });
        // }

        // 비밀번호 검증
        const pwVerified = await bcrypt.compare(password, user.password);
        if (!pwVerified) {
            return res.status(400).send({
                ok: false,
                status: 400,
                error: "wrong password",
            });
        }

        if (pwVerified) {
            const token = jwt.sign(
                {
                    data: {
                        email,
                        username,
                    },
                },
                process.env.SECRET_KEY,
                { expiresIn: "2h", algorithm: "HS256" },
            ); // 2시간 뒤 토큰 만료

            console.log(token);

            return res.status(200).send({
                ok: true,
                status: 200,
                msg: "login success.",
                data: user,
                token,
            });
        }
    } catch (err) {
        res.status(500).send({
            ok: false,
            status: 500,
            error: err.toString(),
        });
    }
};

// 비밀번호 초기화
export const resetPassword = async (req: Request, res: Response) => {
    try {
        // 비밀번호, 비밀번호 확인, 토큰
        const { password, password2, token } = req.body;
        console.log(password, password2, token);
        // 이미 존재하는 토큰 확인
        const validTokenInfo = await ResetPasswordToken.findOne({
            token: token,
        });
        // 사용자 정보를 토큰에서 검색
        const validUserInfo = await User.findOne({
            email: validTokenInfo?.email,
        });
        const saltRounds = 10;
        // 비밀번호 해시 & 솔트 처리
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedNewPassword = await bcrypt.hash(password, salt);

        // 발급된 토큰이 있는지 확인
        if (!validTokenInfo) {
            return res.status(400).send({
                ok: false,
                status: 400,
                error: "Invalid token",
            });
        }

        // 비밀번호 1, 비밀번호 2 검증
        if (password !== password2) {
            return res.status(400).send({
                ok: false,
                status: 400,
                error: "Password is incorrect please check your password",
            });
        }

        // 비밀번호 변경
        await validUserInfo.updateOne({
            password: hashedNewPassword,
        });

        // 발급된 토큰 삭제
        await validTokenInfo.remove();

        // 초기화 성공
        return res.status(200).send({
            ok: true,
            status: 200,
            msg: "reset password is successfully done.",
        });
    } catch (err) {
        return res.status(500).send({
            ok: false,
            status: 500,
            error: err.toString(),
        });
    }
};
