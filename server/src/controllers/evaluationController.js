import { Evaluation } from '../models/Evaluation.js';
import Joi from 'joi';

const createSchema = Joi.object({
  seminarCode: Joi.string().pattern(/^[A-Z]{2}\d{3}$/).required(),
  score: Joi.number().min(1).max(5).required(),
  comment: Joi.string(),
  evaluatedBy: Joi.string().hex().length(24)
});

const updateSchema = Joi.object({
  seminarCode: Joi.string().pattern(/^[A-Z]{2}\d{3}$/),
  score: Joi.number().min(1).max(5),
  comment: Joi.string(),
  evaluatedBy: Joi.string().hex().length(24)
});

// GET /api/evaluations
export async function getAllEvaluations(req, res, next) {
  try {
    const evaluations = await Evaluation.find();
    res.status(200).json({ evaluations });
  } catch (err) { next(err); }
}

// GET /api/evaluations/:id
export async function getEvaluation(req, res, next) {
  try {
    const evaluation = await Evaluation.findById(req.params.id);
    if (!evaluation) {
      return res.status(404).json({ message: 'Evaluation not found' });
    }
    res.status(200).json({ evaluation });
  } catch (err) { next(err); }
}

// POST /api/evaluations
export async function createEvaluation(req, res, next) {
  try {
    const evaluation = await Evaluation.create(req.body);
    res.status(201).json({ evaluation });
  } catch (err) { next(err); }
}

// GET /api/evaluations/summary?seminarCode=SM101
export async function getEvaluationSummary(req, res, next) {
  try {
    const { seminarCode } = req.query;

    if (!seminarCode) {
      return res.status(400).json({ message: 'seminarCode is required' });
    }

    const summary = await Evaluation.aggregate([
      { $match: { seminarCode } },
      {
        $group: {
          _id: '$seminarCode',
          averageScore: { $avg: '$score' },
          evaluationCount: { $sum: 1 }
        }
      }
    ]);

    if (summary.length === 0) {
      return res.status(200).json({
        seminarCode,
        averageScore: 0,
        evaluationCount: 0
      });
    }

    const result = summary[0];
    res.status(200).json({
      seminarCode: result._id,
      averageScore: result.averageScore,
      evaluationCount: result.evaluationCount
    });
  } catch (err) { next(err); }
}
