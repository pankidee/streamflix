const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { signToken } = require('../utils/jwt');

exports.signup = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: 'email, password, and name are required' });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword, name });
    const token = signToken(user.id);

    res.status(201).json({
      token,
      user: { id: user.id, email: user.email, name: user.name, isAdmin: user.isAdmin },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = signToken(user.id);

    res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name, isAdmin: user.isAdmin },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};