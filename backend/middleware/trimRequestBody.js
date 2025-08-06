import trimStrings from "../utils/trimStrings.js";

// Automatically removes extra spaces from all string fields in the request body before the data is processed.
const trimRequestBody = (req, res, next) => {
    if (req.body && typeof req.body === 'object' && !Array.isArray(req.body)) {
        // Ensures trimming is only applied to plain object bodies
        req.body = trimStrings(req.body); // trimStrings is a helper function
    }
    next(); // jumps onto the next function
};

export default trimRequestBody;
