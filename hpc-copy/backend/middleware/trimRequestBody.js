import trimStrings from "../utils/trimStrings.js";
//  Automatically removes extra spaces from all string fields in the request body before the data is processed.
const trimRequestBody = (req, res, next) => {
    if (req.body) {             // checks if the request body exists 
        req.body = trimStrings(req.body);  // trimstrings is a helper function 
    }
    next();   // jumps onto the next function 
};

export default trimRequestBody;