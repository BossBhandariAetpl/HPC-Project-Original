import bcrypt from "bcryptjs"

async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
}

(async () => {
    const password = "aurahpc";
    const hashedPassword = await hashPassword(password);
    console.log(`Hashed password: ${hashedPassword}`);
})();