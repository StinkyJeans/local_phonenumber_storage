import { createUserDatabase } from '../../db';

export default async function handler(req, res) {
  const { username } = req.body;

  // Ensure the user does not already exist (implement your own logic)
  const userExists = false; // Replace with actual check

  if (userExists) {
    return res.status(400).json({ error: 'User already exists' });
  }

  createUserDatabase(username);
  res.status(201).json({ message: 'User registered successfully' });
}
