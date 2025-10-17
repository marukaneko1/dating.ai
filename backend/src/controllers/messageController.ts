import { Response } from 'express';
import { AuthRequest } from '../types';
import * as messageService from '../services/messageService';

export const getMessages = async (req: AuthRequest, res: Response) => {
  try {
    const messages = await messageService.getMessages(
      req.userId!,
      req.params.matchId
    );
    res.json(messages);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const message = await messageService.sendMessage(req.userId!, req.body);
    res.status(201).json(message);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const markMessagesAsRead = async (req: AuthRequest, res: Response) => {
  try {
    await messageService.markMessagesAsRead(req.userId!, req.params.matchId);
    res.json({ message: 'Messages marked as read' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

