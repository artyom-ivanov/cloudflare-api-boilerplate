import { detectError } from "./errorHandler";

type Config = {
  isError?: boolean;
  code?: number;
};

export type Locales = "ru" | "en";

export function responseWithCORS(
  data: any,
  config: Config = { isError: false, code: 500 }
) {
  let response: Response;

  if (config.isError) {
    // auto detect error
    const autoDetectedError = detectError(data.message, "ru");
    if (!autoDetectedError) {
      response = new Response(
        JSON.stringify({
          status: "error",
          message: data.message,
        }),
        { status: config.code ?? 500 }
      );
    } else {
      response = new Response(
        JSON.stringify({
          status: "error",
          code: autoDetectedError.code,
          message: autoDetectedError.message,
        }),
        { status: autoDetectedError.status_code }
      );
    }
  } else {
    response = new Response(
      JSON.stringify({
        status: "success",
        data,
      })
    );
  }

  response.headers.set("Content-Type", "application/json");
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.append("Vary", "Origin");
  return response;
}
