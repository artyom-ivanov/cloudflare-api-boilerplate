import { createClient } from "@supabase/supabase-js";
import {
  SUPABASE_CLIENT_TOKEN,
  SUPABASE_PROJECT,
  SUPABASE_SERVICE_TOKEN,
} from "../config";
import { Database } from "../models/database.types";

export const supabaseClient = createClient<Database>(
  SUPABASE_PROJECT,
  SUPABASE_CLIENT_TOKEN
);

supabaseClient.auth.setAuth(SUPABASE_SERVICE_TOKEN);
