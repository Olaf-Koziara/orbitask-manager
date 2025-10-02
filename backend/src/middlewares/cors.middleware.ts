import { Request, Response, NextFunction } from 'express';


const clientOrigin = process.env.CLIENT_ORIGIN ?? 'http://localhost:3000';
export const corsMiddleware = (
    _req: Request,
    res: Response,
    next: NextFunction
) => {
    res.setHeader('Access-Control-Allow-Origin', clientOrigin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
};
    