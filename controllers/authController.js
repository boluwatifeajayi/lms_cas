const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    if (username !== 'admin' || password !== 'admin123') {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ username: 'admin' }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
