import { env } from "cloudflare:workers";
import { Pool } from "pg";
import { createCsrfMiddleware, createMiddleware, createStart } from "@tanstack/react-start";
import { getDb } from "./data/db";

const globalContextMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    const pool = new Pool({
      connectionString: env.HYPERDRIVE.connectionString,
    });

    const db = getDb(pool);

    return next({
      context: {
        db,
      },
    });
  } catch (error) {
    console.log({ msg: "Error in root context middleware", error });
    throw error;
  }
});

const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) => ctx.handlerType === "serverFn",
});

export const startInstance = createStart(() => ({
  requestMiddleware: [csrfMiddleware, globalContextMiddleware],
  functionMiddleware: [],
}));
