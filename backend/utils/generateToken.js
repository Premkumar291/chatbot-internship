import jwt from "jsonwebtoken";

export const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment");
}
  const expiresIn = process.env.JWT_EXPIRES_IN || "30d";
  return jwt.sign(
    { 
        id: userId 
    }, 
    secret, 
    { expiresIn }
    );
};


