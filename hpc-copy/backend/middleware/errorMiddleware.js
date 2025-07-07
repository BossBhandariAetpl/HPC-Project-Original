
// catches requests to route that doesn't exist
const notFound = (req, res, next) => {
    // if a user requests a url that doesnt match any route this function will be called 
    const error = new Error(`Not Found -${req.originalUrl}`);
    res.status(404);        //sends 404 error
    next(error)
}

// Handles all other kinds of errors and sends a proper error response
const errorHandler = (err, req, res, next) => {
    //  catches any error passed to it from any route or the notFound function
    let statusCode =  res.statusCode === 200 ? 500 : res.statusCode
    let message = err.message;
    //  error handling from mongodb objectid casting
    if (err.name === 'CastError' && err.kind === 'ObjectId'){
        statusCode = 404;
        message = 'Resource not found';
    }
    // sends a json message 
    res.status(statusCode).json({
        message, // the error message 
        stack: process.env.NODE_ENV === 'production' ? null : err.stack // the error trace
    });
}

export {notFound, errorHandler}