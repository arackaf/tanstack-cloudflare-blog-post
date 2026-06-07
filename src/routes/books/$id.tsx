import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";

import { books } from "#/drizzle/schema";

const getBook = createServerFn({ method: "GET" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data, context }) => {
    const { db } = context;

    const [book] = await db
      .select({
        id: books.id,
        title: books.title,
        authors: books.authors,
        isbn: books.isbn,
        pages: books.pages,
        isRead: books.isRead,
        mediumImage: books.mediumImage,
        smallImage: books.smallImage,
        publicationDate: books.publicationDate,
        publisher: books.publisher,
        editorialReviews: books.editorialReviews,
        averageReview: books.averageReview,
        numberReviews: books.numberReviews,
        dateAdded: books.dateAdded,
      })
      .from(books)
      .where(and(eq(books.id, Number(data.id)), eq(books.userId, "106394015208813116232")))
      .limit(1);

    if (!book) {
      return null;
    }

    return {
      ...book,
      authors: book.authors as string[] | string | null,
      editorialReviews: book.editorialReviews as string | null,
      dateAdded: book.dateAdded.toISOString(),
    };
  });

export const Route = createFileRoute("/books/$id")({
  loader: ({ params }) => getBook({ data: { id: params.id } }),
  component: BookPage,
});

function formatAuthors(authors: unknown) {
  if (Array.isArray(authors)) {
    return authors.join(", ");
  }

  if (typeof authors === "string") {
    return authors;
  }

  return null;
}

function BookPage() {
  const book = Route.useLoaderData();

  if (!book) {
    return (
      <div className="p-8">
        <Link to="/books" className="text-blue-600 hover:underline">
          ← Back to books
        </Link>
        <p className="mt-4 text-lg">Book not found.</p>
      </div>
    );
  }

  const authors = formatAuthors(book.authors);
  const coverImage = book.mediumImage ?? book.smallImage;

  return (
    <div className="p-8">
      <Link to="/books" className="text-blue-600 hover:underline">
        ← Back to books
      </Link>

      <div className="mt-8 flex flex-col gap-8 lg:flex-row">
        {coverImage ? (
          <img src={coverImage} alt={book.title} className="w-full max-w-xs rounded-lg shadow-md" />
        ) : (
          <div className="flex h-80 w-full max-w-xs items-center justify-center rounded-lg bg-gray-100 text-gray-500">No cover</div>
        )}

        <div className="flex-1">
          <h1 className="text-4xl font-bold">{book.title}</h1>

          {authors ? <p className="mt-2 text-lg text-gray-700">by {authors}</p> : null}

          <dl className="mt-6 space-y-3">
            {book.isbn ? (
              <div>
                <dt className="font-semibold">ISBN</dt>
                <dd>{book.isbn}</dd>
              </div>
            ) : null}

            {book.publisher ? (
              <div>
                <dt className="font-semibold">Publisher</dt>
                <dd>{book.publisher}</dd>
              </div>
            ) : null}

            {book.publicationDate ? (
              <div>
                <dt className="font-semibold">Published</dt>
                <dd>{book.publicationDate}</dd>
              </div>
            ) : null}

            {book.pages != null ? (
              <div>
                <dt className="font-semibold">Pages</dt>
                <dd>{book.pages}</dd>
              </div>
            ) : null}

            <div>
              <dt className="font-semibold">Read</dt>
              <dd>{book.isRead ? "Yes" : "No"}</dd>
            </div>

            {book.averageReview != null ? (
              <div>
                <dt className="font-semibold">Average review</dt>
                <dd>
                  {book.averageReview}
                  {book.numberReviews != null ? ` (${book.numberReviews} reviews)` : null}
                </dd>
              </div>
            ) : null}
          </dl>

          {book.editorialReviews ? (
            <div className="mt-8">
              <h2 className="text-xl font-semibold">Editorial reviews</h2>
              <pre className="mt-2 whitespace-pre-wrap rounded-lg bg-gray-50 p-4 text-sm text-gray-700">
                {JSON.stringify(book.editorialReviews, null, 2)}
              </pre>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
