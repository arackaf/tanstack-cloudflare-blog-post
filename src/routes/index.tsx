import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
//import { env } from "cloudflare:workers";

const getSecrets = createServerFn({ method: "GET" }).handler(async () => {
  const secret1 = process.env.SECRET_1;
  const secret2 = process.env.SECRET_2;

  return {
    secret1,
    secret2,
  };
});

export const Route = createFileRoute("/")({
  loader: async () => {
    const result = await getSecrets();
    return result;
  },
  component: Home,
});

function Home() {
  const { secret1, secret2 } = Route.useLoaderData();
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold">Welcome to TanStack Start</h1>
      <p className="mt-4 text-lg">
        <Link to="/books">View some books</Link>
      </p>
      <div className="flex flex-col gap-2">
        <div className="text-sm text-gray-600 flex items-center gap-2">
          <span>Secret 1:</span> {secret1}
        </div>
        <div className="text-sm text-gray-600 flex items-center gap-2">
          <span>Secret 2:</span> {secret2}
        </div>
      </div>
    </div>
  );
}
