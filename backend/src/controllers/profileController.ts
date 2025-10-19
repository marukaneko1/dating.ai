import { Response } from 'express';
import { AuthRequest } from '../types';
import * as profileService from '../services/profileService';

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const profile = await profileService.getProfile(req.userId!);
    res.json(profile);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Profile not found';
    res.status(404).json({ error: message });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const profile = await profileService.updateProfile(req.userId!, req.body);
    res.json(profile);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Update failed';
    res.status(400).json({ error: message });
  }
};

export const uploadPhoto = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    const order = parseInt(req.body.order || '0');
    const photo = await profileService.addPhoto(
      req.userId!,
      req.file.filename,
      order
    );
    res.status(201).json(photo);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upload failed';
    res.status(400).json({ error: message });
  }
};

export const deletePhoto = async (req: AuthRequest, res: Response) => {
  try {
    await profileService.deletePhoto(req.userId!, req.params.id);
    res.json({ message: 'Photo deleted' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Delete failed';
    res.status(404).json({ error: message });
  }
};

export const addPromptAnswer = async (req: AuthRequest, res: Response) => {
  try {
    const answer = await profileService.addPromptAnswer(req.userId!, req.body);
    res.status(201).json(answer);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to add prompt';
    res.status(400).json({ error: message });
  }
};

export const updatePromptAnswer = async (req: AuthRequest, res: Response) => {
  try {
    const answer = await profileService.updatePromptAnswer(
      req.userId!,
      req.params.id,
      req.body.answer
    );
    res.json(answer);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Update failed';
    res.status(404).json({ error: message });
  }
};

export const deletePromptAnswer = async (req: AuthRequest, res: Response) => {
  try {
    await profileService.deletePromptAnswer(req.userId!, req.params.id);
    res.json({ message: 'Prompt answer deleted' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Delete failed';
    res.status(404).json({ error: message });
  }
};

export const generateAIInsight = async (req: AuthRequest, res: Response) => {
  try {
    const profile = await profileService.generateAIInsight(req.userId!);
    res.json(profile);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to generate insight';
    res.status(500).json({ error: message });
  }
};

export const resetUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    await profileService.resetUserProfile(req.userId!);
    res.json({ message: 'User profile reset' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Reset failed';
    res.status(400).json({ error: message });
  }
};

