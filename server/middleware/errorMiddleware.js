// UNSUPPORTED (404) ROUTES

const notFound=(req,res,next)=>{
    const error =new Error(`NOT FOUND -  ${req.originalUrl}`)
    res.status(404);
    next(error);
}


// MIDDLEWARE TO HANDLE ERRROS

const errorHandler = (error,req,res,next)=>{
    if(res.headerSent){
        return next(error)
    }

    res.status(error.code || 500).json({message:error.message || "An Unknow error occured"})
}

module.exports = {notFound,errorHandler}