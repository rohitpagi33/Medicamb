const jwt = require('jsonwebtoken');

// Admin login — credentials come from .env, no DB needed
exports.adminLogin = (req, res) => {
  const { email, password } = req.body;
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    return res.status(500).json({ message: 'Admin credentials not configured on server.' });
  }

  if (email !== adminEmail || password !== adminPassword) {
    return res.status(401).json({ message: 'Invalid admin credentials.' });
  }

  const token = jwt.sign(
    { role: 'admin', email: adminEmail },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '8h' }
  );

  res.json({ token, role: 'admin' });
};

// Middleware: protect admin routes
exports.protectAdmin = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) return res.status(401).json({ message: 'No token, admin access denied.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: admin only.' });
    }
    req.admin = decoded;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired admin token.' });
  }
};
