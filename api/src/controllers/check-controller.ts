import { type Request, type Response } from 'express';

export const getCheck = (req: Request, res: Response): void => {
  res.json({
    status: 'ok',
    message: 'API check endpoint is working',
    timestamp: new Date().toISOString(),
  });
};
