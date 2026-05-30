import { uploadSingle, uploadMultiple } from '../middlewares/upload.middleware.js';
import {
  analyzeResumeService,
  getHistoryService,
  getAnalysisDetailService,
  bulkRankService,
} from '../services/resume.service.js';

export const analyzeResume = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message });

    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'Vui lòng upload file CV (PDF)' });
      }
      if (!req.body?.jdText) {
        return res.status(400).json({ success: false, message: 'Vui lòng cung cấp mô tả công việc (jdText)' });
      }

      const result = await analyzeResumeService({
        cvBuffer: req.file.buffer,
        cvFileName: req.file.originalname,
        jdText: req.body.jdText,
        userId: req.user.userId,
      });

      res.json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });
};

export const getHistory = async (req, res) => {
  try {
    const history = await getHistoryService(req.user.userId);
    res.json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAnalysisDetail = async (req, res) => {
  try {
    const analysis = await getAnalysisDetailService(req.params.id, req.user.userId);
    res.json({ success: true, data: analysis });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const bulkRank = (req, res) => {
  uploadMultiple(req, res, async (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message });

    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ success: false, message: 'Vui lòng upload ít nhất 1 file CV' });
      }
      if (!req.body?.jdText) {
        return res.status(400).json({ success: false, message: 'Vui lòng cung cấp mô tả công việc (jdText)' });
      }

      const cvBuffers = req.files.map((f) => ({ buffer: f.buffer, filename: f.originalname }));
      const results = await bulkRankService({ cvBuffers, jdText: req.body.jdText });

      res.json({ success: true, count: results.length, data: results });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });
};
