import jwt from "jsonwebtoken";
import { VerifyJwt } from "../@types/auth";


const verifyJwt = (token: string): void => {
    return jwt.verify(token, process.env.SECRET_KEY, function(err, decoded) {
        if (err) {
            return {
                ok: false,
                error: err,
                status: 400,
            };
        }
        else {
            return {
                ok: true,
                msg: "jwt verified.",
                decoded,
                status: 200,
            };
        }
    });

   
    
};

export default verifyJwt;
