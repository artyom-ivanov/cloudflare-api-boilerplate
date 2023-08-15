import { decode } from "base64-arraybuffer";
import { nanoid } from "nanoid";
import { responseWithCORS } from "../../helpers";
import { getUserID } from "../../integrations/firebase";
import { supabaseClient } from "../../integrations/supabase";
import { notify } from "../../integrations/telegram";
import { cleanupUserAvatarFolder } from "./helpers";
import { User } from "../../models/entities.types";

type SaveMeRequest = {
  display_name: string | undefined;
  email: string | undefined;
  photo_base64: string | null;
  photo_url: string | null;
};

async function saveMe(request: Request): Promise<Response> {
  try {
    const token = request.headers.get("Authorization")?.split(" ")[1];
    const uid = await getUserID(token);
    if (!uid) {
      throw new Error("Empty uid was received");
    }

    const { display_name, photo_base64, photo_url, email } =
      (await request.json()) as SaveMeRequest;

    let photo_url_to_save = photo_url;

    // Delete photo if both empty
    if ((!photo_base64 || photo_base64 === "") && !photo_url) {
      photo_url_to_save = null;
      await cleanupUserAvatarFolder(uid);
    }

    // Save base64 photo if exists
    if (!!photo_base64) {
      const photoUrlPath = `${uid}/avatar/photo_${nanoid(8)}.jpeg`;
      await cleanupUserAvatarFolder(uid);

      const { error: uploadError } = await supabaseClient.storage
        .from("public")
        .upload(photoUrlPath, decode(photo_base64), {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      const { publicURL } = supabaseClient.storage
        .from("public")
        .getPublicUrl(photoUrlPath);

      photo_url_to_save = publicURL;
    }

    // check if user is already registered
    const { data: checkData, error: checkError } = await supabaseClient
      .from("users")
      .select("id")
      .eq("id", uid)
      .maybeSingle();

    if (checkError) {
      throw new Error(checkError.message);
    }

    if (!checkData) {
      // create user
      const { data: insertedData, error: insertedError } = await supabaseClient
        .from<User>("users")
        .insert({
          id: uid,
          display_name: display_name,
          photo_url: photo_url_to_save,
          meta: {
            email,
          },
        })
        .select();

      if (insertedError) {
        throw new Error(insertedError.message);
      }

      if (!insertedData) {
        throw new Error("Cannot create user");
      }

      return responseWithCORS(insertedData[0]);
    }
    // update user
    const { data: updatedData, error: updatedError } = await supabaseClient
      .from("users")
      .update({
        display_name: display_name,
        photo_url: photo_url_to_save,
        meta: {
          email,
        },
      })
      .eq("id", uid)
      .select();

    if (updatedError) {
      throw new Error(updatedError.message);
    }

    if (!updatedData) {
      throw new Error("Cannot update user");
    }

    await notify(
      `👤 User ${uid} updated profile\n\nDisplay name: ${display_name}\nE-mail: ${email}`
    );

    return responseWithCORS(updatedData[0]);
  } catch (e: any) {
    return responseWithCORS(e, { isError: true });
  }
}

export { saveMe };
