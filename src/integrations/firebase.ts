import { verifyTokenId } from "@codehelios/verify-tokenid";
import { FIREBASE_PROJECT_ID } from "../config";

async function getUserID(token: string | undefined) {
  if (!token) {
    throw new Error("Invalid Bearer token: No token provided");
  }
  const { isValid, decoded, error } = await verifyTokenId(
    token,
    `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`,
    FIREBASE_PROJECT_ID
  );

  if (!isValid) {
    throw new Error(`Invalid Bearer token: ${error.message}`);
  }

  if (decoded?.payload?.user_id === undefined) {
    throw new Error(`Invalid Bearer token: No user provided`);
  }

  return decoded.payload.user_id;
}

export { getUserID };
