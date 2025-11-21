import jwt from "jsonwebtoken"

export const generateToken = (userId, res) => {
    const { JWT_SECRET, NODE_ENV } = process.env;
    
    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not set.")
    }
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d"
    })

    res.cookie("jwtToken", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,//in MS
        httpOnly: true,//prevent XSS attack: cross-site scripting
        sameSite: "strict", //CSRF attacks
        secure: NODE_ENV === "development" ? false : true
    })

    return token;
}