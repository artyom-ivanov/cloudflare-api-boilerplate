import { responseWithCORS } from "../../helpers";
import { getUserID } from "../../integrations/firebase";
import { supabaseClient } from "../../integrations/supabase";
import { User } from "../../models/entities.types";

type GetUserResponse = User;

async function getMe(request: Request): Promise<Response> {
  try {
    const token = request.headers.get("Authorization")?.split(" ")[1];
    const uid = await getUserID(token);
    if (!uid) {
      throw new Error("Empty uid was received");
    }

    // Get user by uid
    const { data: me, error: getMeError } = await supabaseClient
      .from<User>("users")
      .select("*")
      .eq("id", uid)
      .maybeSingle();

    if (getMeError) {
      throw new Error(getMeError.message);
    }

    if (!me) {
      return responseWithCORS(
        { message: "User not found" },
        { isError: true, code: 404 }
      );
    }

    const response: GetUserResponse = me;

    return responseWithCORS(response);
  } catch (e: any) {
    return responseWithCORS(e, { isError: true });
  }
}

export { getMe };
