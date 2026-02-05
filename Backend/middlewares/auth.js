import jwt from "jsonwebtoken"

export const auth = async (req , res , next) => {
    try {
        const token = req.cookies.token; 

        if(!token) return res.status(404).json({message : "Token not found"});

        const decode = jwt.verify(token, process.env.SECRET_KEY);
        if(!decode) return res.status(404).json({message : "Unauthorized - Invalid Token"});

        req.user = decode;
        next();
    } catch (error) {
       console.log(`Error in auth : ${error.message}`);
       return res.status(404).json({message : error.message});
    };
};