import { Response } from 'express';
import { AuthRequest } from '../types';
import * as authService from '../services/authService';

export const register = async (req: AuthRequest, res: Response) => {
  try {
    const result = await authService.registerUser(req.body);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req: AuthRequest, res: Response) => {
  try {
    const result = await authService.loginUser(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
};

export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  try {
    const user = await authService.getCurrentUser(req.userId!);
    res.json(user);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

