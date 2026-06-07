import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { desc } from "drizzle-orm";

import { db } from "#/data/db";
import { books } from "#/drizzle/schema";

const getBooks = createServerFn({ method: "GET" }).handler(async () => {
  return db
    .select({
      id: books.id,
      title: books.title,
      mediumImage: books.mediumImage,
      smallImage: books.smallImage,
    })
    .from(books)
    .orderBy(desc(books.dateAdded))
    .limit(10);
});

export const Route = createFileRoute("/books/")({
  loader: () => getBooks(),
  component: BooksPage,
});

function BooksPage() {
  const booksList = Route.useLoaderData();

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold">Books</h1>
      <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {booksList.map((book) => (
          <li key={book.id}>
            <Link
              to="/books/$id"
              params={{ id: String(book.id) }}
              className="group block overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
            >
              {book.mediumImage || book.smallImage ? (
                <img src={book.mediumImage ?? book.smallImage ?? undefined} alt={book.title} className="aspect-2/3 w-full object-cover" />
              ) : (
                <div className="flex aspect-2/3 items-center justify-center bg-gray-100 text-sm text-gray-500">No cover</div>
              )}
              <div className="p-4">
                <h2 className="font-semibold group-hover:underline">{book.title}</h2>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
