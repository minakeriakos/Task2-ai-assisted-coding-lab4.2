import mongoose from 'mongoose';

// TODO: define the Evaluation schema per README.md section 1.

const evaluationSchema = new mongoose.Schema(
  {
    seminarCode: {
      type: String,
      required: true,
      match: [/^[A-Z]{2}\d{3}$/, 'Please provide a valid seminar code (e.g., SM101)'],
    },
    score: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: false,
    },
    evaluatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
  },
  { timestamps: true }
);

// Compound unique index on seminarCode and evaluatedBy
evaluationSchema.index({ seminarCode: 1, evaluatedBy: 1 }, { unique: true });

export const Evaluation = mongoose.model('Evaluation', evaluationSchema);
