const jwt = require('jsonwebtoken');

const createResponse = require('../routes/helpers/createResponse');

const auth = (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;
    if (authorizationHeader) {
      const token = authorizationHeader.split(' ')[1];
      const decodedToken = jwt.verify(token, process.env.APP_SECRET);
      const { userId } = decodedToken;
      if (!userId) {
        return res.status(401).json(createResponse({
          error: 'Invalid user ID'
        }));
      } else {
        res.locals.adminId = userId;
        next();
      }
    } else {
      res.status(401).json(createResponse({
        error: 'You need to set the authorization header'
      }));
    }
  } catch (error) {
    next(error);
  }
};

module.exports = auth;
