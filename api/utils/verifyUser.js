import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';


// On verify si l'utilisateur est connecter par rapport a son cookie avant de faire l'update du profile


export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
      return next(errorHandler(401, 'Unauthorized'));
    }
    // Verifier le token  , this is will give us two things erreur or userdata from the cookie parse one
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
          return next(errorHandler(401, 'Unauthorized'));
        }
        req.user = user;
        next();
      });
    };