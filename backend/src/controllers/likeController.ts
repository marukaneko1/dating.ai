import { Response } from 'express';
import { AuthRequest } from '../types';
import * as likeService from '../services/likeService';

export const createLike = async (req: AuthRequest, res: Response) => {
  try {
    const result = await likeService.createLike(req.userId!, req.body);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteLike = async (req: AuthRequest, res: Response) => {
  try {
    await likeService.deleteLike(req.userId!, req.params.id);
    res.json({ message: 'Like removed' });
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

export const getSentLikes = async (req: AuthRequest, res: Response) => {
  try {
    const likes = await likeService.getSentLikes(req.userId!);
    res.json(likes);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getReceivedLikes = async (req: AuthRequest, res: Response) => {
  try {
    const likes = await likeService.getReceivedLikes(req.userId!);
    res.json(likes);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

