import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { desc, eq } from "drizzle-orm";

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
    .where(eq(books.userId, "106394015208813116232"))
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
      <ul className="mt-8 flex flex-col gap-3">
        {booksList.map((book) => (
          <li key={book.id}>
            <Link
              to="/books/$id"
              params={{ id: String(book.id) }}
              className="flex items-center gap-3 hover:underline"
            >
              {book.mediumImage || book.smallImage ? (
                <img
                  src={book.mediumImage ?? book.smallImage ?? undefined}
                  alt={book.title}
                  className="max-w-[50px] shrink-0"
                />
              ) : (
                <div className="flex h-[75px] w-[50px] shrink-0 items-center justify-center bg-gray-100 text-xs text-gray-500">
                  No cover
                </div>
              )}
              <span>{book.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
