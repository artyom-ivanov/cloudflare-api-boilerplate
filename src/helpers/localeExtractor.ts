function extractLocale(request: any): "ru" | "en" {
  const locale = request.headers.get("Accept-Language")?.split(",")[0] ?? "en";

  return locale === "ru" ? "ru" : "en";
}

export { extractLocale };
