const jwt = require("jsonwebtoken")

module.exports = authenticatedUser = (req,res,next)=>{
    // const token = req.headers.authorization.split(" ")[1];
    // console.log(token, "TOken")

        try{
     const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, token missing" });
    }

        const token = authHeader.split(" ")[1];
        
        let authorisedUser = jwt.verify(token, "JWT_SECRET");
        if(authorisedUser){
             authorisedUser.isAdmin = authorisedUser.role == "admin";
            req.user = authorisedUser
            next()
    } }catch(err){
        res.status(500).json({
            message: "Something went wrong!"
        })
    }

}
