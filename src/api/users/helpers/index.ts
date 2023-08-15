import { SUPABASE_STORAGE_BUCKET } from "../../../config";
import { supabaseClient } from "../../../integrations/supabase";

export const cleanupUserAvatarFolder = async (uid: string) => {
  // Remove all from user avatars folder
  const { data: avatarsList, error: avatarsListError } =
    await supabaseClient.storage
      .from(SUPABASE_STORAGE_BUCKET)
      .list(`${uid}/avatar`);

  if (avatarsListError) {
    throw new Error(avatarsListError.message);
  }

  if (avatarsList && avatarsList.length) {
    const avatarsToRemove = avatarsList.map((i) => `${uid}/avatar/${i.name}`);
    const { error: removeError } = await supabaseClient.storage
      .from(SUPABASE_STORAGE_BUCKET)
      .remove(avatarsToRemove);
    if (removeError) {
      throw new Error(removeError.message);
    }
  }
};
