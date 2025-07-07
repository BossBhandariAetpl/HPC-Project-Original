//utility function to trim strings
const trimStrings = (obj) => {
    Object.keys(obj).forEach(key => {
        if (typeof obj[key] === 'string') {
            obj[key] = obj[key].trim();
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
            trimStrings(obj[key]); // Recursively trim strings in nested objects
        }
    });
    return obj;
};

export default trimStrings;