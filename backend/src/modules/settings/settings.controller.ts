import { Request, Response, NextFunction } from "express";
import * as settingsService from "./settings.service";

export async function listSettings(req: Request, res: Response, next: NextFunction) {
  try {
    res.json({ success: true, data: await settingsService.listSettings(req.query.category as string | undefined) });
  } catch (e) { next(e); }
}

export async function getSetting(req: Request, res: Response, next: NextFunction) {
  try { res.json({ success: true, data: await settingsService.getSetting(req.params.key) }); } catch (e) { next(e); }
}

export async function setSetting(req: Request, res: Response, next: NextFunction) {
  try { res.status(201).json({ success: true, data: await settingsService.setSetting(req.body) }); } catch (e) { next(e); }
}

export async function updateSetting(req: Request, res: Response, next: NextFunction) {
  try {
    res.json({ success: true, data: await settingsService.updateSetting(req.params.key, req.body.value, req.body.category, req.body.updatedBy) });
  } catch (e) { next(e); }
}

export async function deleteSetting(req: Request, res: Response, next: NextFunction) {
  try { res.json({ success: true, message: "Setting deleted" }); await settingsService.deleteSetting(req.params.key); } catch (e) { next(e); }
}

export async function seedSettings(req: Request, res: Response, next: NextFunction) {
  try {
    const defaults = await settingsService.seedDefaultSettings();
    res.json({ success: true, data: defaults, message: "Default settings seeded" });
  } catch (e) { next(e); }
}