import { Response } from 'express';
import { AuthRequest } from '../types';
import * as matchService from '../services/matchService';

export const getMatches = async (req: AuthRequest, res: Response) => {
  try {
    const matches = await matchService.getMatches(req.userId!);
    res.json(matches);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteMatch = async (req: AuthRequest, res: Response) => {
  try {
    await matchService.deleteMatch(req.userId!, req.params.id);
    res.json({ message: 'Match deleted' });
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

