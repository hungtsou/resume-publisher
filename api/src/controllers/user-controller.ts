import { type Request, type Response } from 'express';
import { createUser, getAllUsers, getUser } from '../db/schemas/user.ts';

export const createUserController = async (req: Request, res: Response) => {
  try {
    const userData = req.body;

    const user = await createUser({ userName: userData.userName });
    
    
    res.status(200).json({
      message: 'User created successfully',
      user,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      error: 'Failed to create user',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getUsersController = async (req: Request, res: Response) => {
  const users = await getAllUsers();
  res.status(200).json({ users });
};

export const getUserController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await getUser(id);
  res.status(200).json({ user });
};