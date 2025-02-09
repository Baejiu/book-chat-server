import rateLimit from 'express-rate-limit';
import { config } from '../config';

export default rateLimit({
  windowMs: config.rateLimit.wmindowMs,
  max: config.rateLimit.maxRequest,
  handler: (req, res) => {
    res.status(429).json({ error: 'Too many requests, please slow down!' });
  },
});
