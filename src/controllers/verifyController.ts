import { Request, Response } from "express";
import User from "../models/users";
import { EmailToken, ResetPasswordToken } from "../models/verify";
import { sendMail } from "../utils";

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
        // 중복방지를 위한 기존에 생성된 이메일 인증 토큰 객체 요청
        const tokenInfo = await EmailToken.findOne({
            email,
        });
        // 새로운 이메일 토큰
        const newEmailToken = Math.floor(
            Math.random() * (999999 - 111111) + 111111,
        );

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

        // 이메일 전송
        await sendMail({
            to: email,
            subject: "[PERSONA] 이메일 인증 안내",
            html: `
                <h1>이메일 인증 안내</h1>
                <p>아래 인증번호 6자리를 입력하여 인증을 완료해주세요.</p>
                <h3>${newEmailToken}</h3>
                <p>보안상의 이유로 인증번호는 이메일 발송 시점부터 24시간 동안 유지됩니다.</p>
            `,
        });

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

// 비밀번호 찾기 인증 //
// 비밀번호 찾기 토큰 생성
export const createResetPasswordToken = async (req: Request, res: Response) => {
    try {
        const s =
            "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

        const { email } = req.body;
        // 사용자 정보 객체 요청
        const user = await User.findOne({
            email,
        });
        // 중복방지를 위한 기존에 생성된 비밀번호 찾기 인증 토큰 객체 요청
        const tokenInfo = await ResetPasswordToken.findOne({
            email,
        });
        // 새로운 비밀번호 찾기 인증 토큰
        const newToken = Array(16)
            .join()
            .split(",")
            .map(function () {
                return s.charAt(Math.floor(Math.random() * s.length));
            })
            .join("");
        // 사용자가 가입을 하지 않아서 메일이 없는지 확인
        if (!user) {
            return res.status(404).send({
                ok: false,
                status: 404,
                error: "Account is not found. check your email.",
            });
        }

        // 이미 전송된 비밀번호 찾기 인증용 토큰이 있으면 생략
        if (tokenInfo) {
            return res.status(400).send({
                ok: false,
                status: 400,
                error: "Verify email is already sent. check your inbox or spam",
            });
        }

        // 토큰 생성
        await ResetPasswordToken.create({
            email,
            token: newToken,
        });

        // 이메일 전송
        await sendMail({
            to: email,
            subject: "[PERSONA] 비밀번호 찾기 안내",
            html: `
                <h1>비밀번호 찾기 안내</h1>
                <p>비밀번호 초기화가 요청되었습니다. 아래 버튼을 클릭하여 비밀번호를 변경하십시오.</p>
                <a
                    href="${process.env.BASE_URL}/resetPassword/set?token=${newToken}"
                    alt="reset-pw"
                >
                    <button>비밀번호 초기화</button>
                </a>
                <p>버튼이 작동하지 않는다면 하단 URL을 눌러주세요.</p>
                <p>${process.env.BASE_URL}/resetPassword/set?token=${newToken}</p>
                <p>보안상의 이유로 비밀번호 변경은 이메일 발송 시점부터 24시간 동안 가능합니다.</p>
            `,
        });

        return res.status(200).send({
            ok: true,
            status: 200,
            message: "Email is successfully sent. check your inbox.",
        });
    } catch (err) {
        res.status(500).send({
            ok: false,
            status: 500,
            error: err.toString(),
        });
    }
};
