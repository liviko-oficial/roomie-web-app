import bcrypt from "bcrypt";
const SALT_ROUNDS = 15;
export const make_hash = async (pass: string) => {
  const hash = await bcrypt.hash(pass, SALT_ROUNDS);
  return hash;
};
export const verify_password = async (pass: string, hash: string) => {
  return await bcrypt.compare(pass, hash);
};
