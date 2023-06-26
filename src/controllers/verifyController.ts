import { Request, Response } from "express";
import User from "../models/users";
import { EmailToken } from "../models/verify";

// 이메일 인증 //
// 이메일 인증토큰 생성
// POST /verify/email
export const createEmailVerifyToken = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        // 사용자 정보 객체 요청
        const user = await User.findOne({
            email,
        });
        // 중복방지용 이메일 토큰 정보 객체 요청
        const tokenInfo = await EmailToken.findOne({
            email,
        });
        // 새로운 이메일 토큰
        const newEmailToken = Math.floor(Math.random() * 999999);

        console.log(tokenInfo);

        // 사용자가 가입을 하지 않아서 메일이 없는지 확인
        if (!user) {
            return res.status(404).send({
                ok: false,
                status: 404,
                error: "Account is not found. check your email.",
            });
        }

        // 이미 인증된 사용자인지 확인 후 생략
        if (user.active) {
            return res.status(400).send({
                ok: false,
                status: 400,
                error: "This email is already verified. Please login with your account.",
            });
        }

        // 이미 전송된 메일 토큰이면 생략
        if (tokenInfo) {
            return res.status(400).send({
                ok: false,
                status: 400,
                error: "Verify email is already sent. check your inbox or spam",
            });
        }

        // 이메일 토큰 생성
        await EmailToken.create({
            email,
            token: newEmailToken,
        });

        // 토큰 생성 성공
        return res.status(200).send({
            ok: true,
            status: 200,
            message: "Email verify token is successfully generated.",
        });
    } catch (err) {
        res.status(500).send({
            ok: false,
            status: 500,
            error: err.toString(),
        });
    }
};

// 이메일 인증
// GET /verify/email
export const verifyEmail = async (req: Request, res: Response) => {
    try {
        const { token } = req.query;
        const tokenInfo = await EmailToken.findOne({
            token,
        });

        // 토큰 정보가 없는지 확인
        if (!tokenInfo) {
            return res.status(404).send({
                ok: false,
                status: 400,
                error: "This token is invalid. check your code again.",
            });
        }

        // 토큰 정보가 있을 경우 사용자 데이터에서 active를 true로 변경
        await User.updateOne(
            {
                email: tokenInfo?.email,
            },
            {
                active: true,
            },
        );
        // 토큰 인증이 완료 되었으면 삭제
        await tokenInfo.deleteOne({
            token,
        });

        // 이메일 인증 성공 응답 반환
        return res.status(200).send({
            ok: true,
            status: 200,
            message: "Email verification is success.",
        });
    } catch (err) {
        res.status(500).send({
            ok: false,
            status: 500,
            error: err.toString(),
        });
    }
};
