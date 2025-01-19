import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import * as userRepository from '../data/auth.js';
import { config } from '../config.js';

export async function signup(req, res, next) {
  const { name, nickname, password, email, url } = req.body;
  const found = await userRepository.findBynickname(nickname);
  if (found) {
    return res.status(409).json({ message: `${nickname} already exists` });
  }
  const hashed = await bcrypt.hash(password, config.bcrypt.saltRounds);
  const userId = await userRepository.createUser({
    nickname,
    password: hashed,
    name,
    email,
    url,
  });
  const token = createJwtToken(userId);
  res.status(201).json({ token, nickname });
}

export async function login(req, res, next) {
  const { nickname, password } = req.body;
  const user = await userRepository.findBynickname(nickname);
  if (!user) {
    return res.status(401).json({ message: 'Invalid user or password' });
  }
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(401).json({ message: 'Invalid user or password' });
  }
  const token = createJwtToken(user.id);
  res.status(200).json({ token, nickname });
}

export async function me(req, res, next) {
  const user = await userRepository.findById(req.userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.status(200).json({ token: req.token, nickname: user.nickname });
}
function createJwtToken(id) {
  return jwt.sign({ id }, config.jwt.secritKey, {
    expiresIn: config.jwt.expiresInSec,
  });
}
