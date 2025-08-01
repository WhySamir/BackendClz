// check if the token has been passed or not (if not token access denied)
import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { User } from "../models/User";

interface AuthenticatedRequest extends Request {
    user?: any;
}

export const authenticate = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        res.status(401).json({
            success: false,
            message: "Access denied. No token provided.",
        });
        return;
    }

    const decoded = verifyToken(token) as { userId: string };
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
        res.status(401).json({
            success: false,
            message: "Invalid token. User not found.",
        });
        return;
    }

    req.user = user;
    next();
    } catch (error) {
    res.status(401).json({
        success: false,
        message: "Invalid token.",
    });
    }
};