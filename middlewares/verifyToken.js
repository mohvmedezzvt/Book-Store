const jwt = require('jsonwebtoken');

// Verify token
function verifyToken(req, res, next) {
  const token = req.headers.token;
  if (!token) return res.status(401).json({ message: 'Access denied.' });

  try {
    // eslint-disable-next-line no-undef
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.' });
  }
}

// Verify token & authorize user
function verifyTokenAndAuthorization(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      res.status(403).json({ message: 'You are not authorized to perform this action.' });
    }
  });
}

// Verify token & Admin
function verifyTokenAndAdmin(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      return next();
    } else {
      res.status(403).json({ message: 'You are not authorized to perform this action.' });
    }
  });
}

module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
};
