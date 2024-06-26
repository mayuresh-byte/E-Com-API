const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token;
    if(authHeader) {
        jwt.verify(authHeader, process.env.JWT_SEC, (err, user) => {
            if(err) {
                return res.status(401).json({msg: "Token is not valid"});
            } else {
                req.user = user;
            }
        });
        next();
    } else {
        return res.status(401).json({msg: "You are not authenticated"})
    }
}

const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
      if (req.user.id === req.params.id || req.user.isAdmin) {
        next();
      } else {
        res.status(403).json("You are not alowed to do that!");
      }
    });
};

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("You are not alowed to do that!");
    }
  });
};

module.exports = {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin};