import { Request, Response } from 'express';

export const sendResume = async (req: Request, res: Response) => {
  // const { name, email, password } = req.body;
  // const publisher = await Publisher.create({ name, email, password });
  // res.status(201).json(publisher);
  res.status(200).json({ message: 'Resume sent successfully', data: req.body });
};