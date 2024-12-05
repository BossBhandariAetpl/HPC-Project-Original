import trimStrings from "../utils/trimStrings.js";

const trimRequestBody = (req, res, next) => {
    if (req.body) {
        req.body = trimStrings(req.body);
    }
    next();
};

export default trimRequestBody;