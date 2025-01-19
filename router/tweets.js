import express from 'express';
import 'express-async-errors';
import { body, param, validationResult } from 'express-validator';
import * as tweetController from '../controller/tweet.js';
import { validate } from '../middleware/validate.js';
import { isAuth } from '../middleware/auth.js';

const router = express.Router();
const validateTweet = [
  body('text')
    .trim()
    .isLength({ min: 3 })
    .withMessage('text should ve at least 3 characters'),
  validate,
];

// GET /tweets
// GET /tweets?nickname=:nickname
router.get('/', tweetController.getTweets);

// GET /tweets/:id
router.get('/:id', tweetController.getTweet);

// POST /tweeets
router.post('/', isAuth, validateTweet, tweetController.createTweet);

// PUT /tweets/:id
router.put('/:id', isAuth, validateTweet, tweetController.updateTweet);

// DELETE /tweets/:id
router.delete('/:id', isAuth, tweetController.deleteTweet);

export default router;
