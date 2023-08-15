const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS,PATCH,DELETE",
  "Access-Control-Max-Age": "86400",
};

function handleOptions(request: Request) {
  const headers = request.headers;

  if (
    headers.get("Origin") !== null &&
    headers.get("Access-Control-Request-Method") !== null &&
    headers.get("Access-Control-Request-Headers") !== null
  ) {
    const respHeaders = {
      ...corsHeaders,
      // Allow all future content Request headers to go back to browser
      // such as Authorization (Bearer) or X-Client-Name-Version
      "Access-Control-Allow-Headers": request.headers.get(
        "Access-Control-Request-Headers"
      )!,
    };
    return new Response(null, { headers: respHeaders });
  }

  // Handle standard OPTIONS request.
  // If you want to allow other HTTP Methods, you can do that here.
  return new Response(null, {
    headers: { Allow: "GET, HEAD, POST, OPTIONS, PATCH, DELETE" },
  });
}

export { handleOptions };
