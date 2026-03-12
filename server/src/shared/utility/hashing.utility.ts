import bcrypt from "bcrypt";


const SALT_ROUNDS = Number(process.env.PASSWORD_SALT_ROUNDS) || 10;

export const createHash = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    return bcrypt.hash(password, salt);
};

export const compareHash = async (password: string, hashedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(password, hashedPassword);
};
