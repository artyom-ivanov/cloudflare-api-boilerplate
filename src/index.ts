import { Router, Route, Request } from "itty-router";
import { handleOptions } from "./handlers/options";
import { userDeleteMe, userGetMe, userSaveMe } from "./api/users";

type MethodType = "GET" | "POST" | "OPTIONS" | "PATCH" | "DELETE";

interface IRequest extends Request {
  method: MethodType;
  url: string;
}

interface IMethods {
  get: Route;
  post: Route;
  patch: Route;
  options: Route;
  delete: Route;
}

const BASE_URL = "/v1";
const router = Router<IRequest, IMethods>();

router.options("*", handleOptions);

router.get(
  BASE_URL,
  () =>
    new Response(
      JSON.stringify({
        status: "success",
        version: "API v0.0.1",
      }),
      { status: 200 }
    )
);

// User
router.get(`${BASE_URL}/users/me`, userGetMe);
router.post(`${BASE_URL}/users/me`, userSaveMe);
router.delete(`${BASE_URL}/users/me`, userDeleteMe);

router.all(
  "*",
  () =>
    new Response(
      JSON.stringify({
        status: "error",
        message: "API Endpoint not found",
      }),
      { status: 404 }
    )
);

export default {
  async fetch(request: IRequest) {
    return router.handle(request);
  },
};
