import { responseWithCORS } from "../../helpers";
import { getUserID } from "../../integrations/firebase";
import { supabaseClient } from "../../integrations/supabase";
import { notify } from "../../integrations/telegram";
import { User } from "../../models/entities.types";
import { cleanupUserAvatarFolder } from "./helpers";

async function deleteMe(request: Request): Promise<Response> {
  try {
    const token = request.headers.get("Authorization")?.split(" ")[1];
    const uid = await getUserID(token);
    if (!uid) {
      throw new Error("Empty uid was received");
    }

    await cleanupUserAvatarFolder(uid);

    // Delete user
    const { error: deleteError } = await supabaseClient
      .from<User>("users")
      .delete()
      .eq("id", uid);

    if (deleteError) {
      throw new Error(deleteError.message);
    }

    await notify(`🗑️ User ${uid} deleted his account.`);

    return responseWithCORS({
      message: "User was deleted",
    });
  } catch (e: any) {
    return responseWithCORS(e, { isError: true });
  }
}

export { deleteMe };
