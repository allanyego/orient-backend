const jsonwebtoken = require('jsonwebtoken');

const sign = (user) => {
  return jsonwebtoken.sign(
    { userId: user.id },
    process.env.APP_SECRET,
    { expiresIn: '72h' },
  );
};

module.exports = sign;
