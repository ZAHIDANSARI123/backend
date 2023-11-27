const JWT = require('jsonwebtoken');

const jwtAuth = (req, res, next) =>{
              const token = (req.cookies && req.cookies.token) || null;

             if (!token) {
              return res.status(401).json({
                            success: false,
                            message: 'Unauthorized'
              })

             }
// +++++++++++++++++token verify++++++++++++++++++++++

             try {
              const payload = jwt.verify(token, process.env.SECRET);
              req.user = { id: payload.id, email: payload.email }
             } catch (e) {
              return res.status(401).json({
                success: false,
                message: 'Unauthorized'
              }) 
             
             }
              next();
}


module.exports = jwtAuth;