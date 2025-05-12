import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
);

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const { userId } = JSON.parse(event.body);

    if (!userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "User ID is required" }),
      };
    }

    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Account deleted successfully" }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "An unexpected error occurred" }, err),
    };
  }
};
