import { Response } from 'express';
import { AuthRequest } from '../types';
import * as discoveryService from '../services/discoveryService';

export const getNextProfile = async (req: AuthRequest, res: Response) => {
  try {
    const profile = await discoveryService.getNextProfile(req.userId!);
    if (!profile) {
      res.json({ message: 'No more profiles available' });
      return;
    }
    res.json(profile);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getPrompts = async (req: AuthRequest, res: Response) => {
  try {
    const prompts = await discoveryService.getAllPrompts();
    res.json(prompts);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

