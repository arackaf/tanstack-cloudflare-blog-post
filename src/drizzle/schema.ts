import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  json,
  integer,
  boolean,
  bigint,
  numeric,
  date,
  index,
  uniqueIndex,
  foreignKey,
  primaryKey,
  unique,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const account = pgTable("account", {
  id: text().primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text(),
  password: text(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const bookScans = pgTable(
  "book_scans",
  {
    id: serial().primaryKey(),
    userId: varchar("user_id", { length: 255 }).notNull(),
    isbn: varchar({ length: 50 }).notNull(),
    dateAdded: timestamp("date_added")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    status: varchar({ length: 50 }),
    bookInfo: json("book_info"),
  },
  (table) => [
    index("idx_book_scans_user_id_date").using(
      "btree",
      table.userId.asc().nullsLast(),
      table.dateAdded.asc().nullsLast(),
    ),
  ],
);

export const books = pgTable(
  "books",
  {
    id: serial().primaryKey(),
    userId: varchar("user_id", { length: 50 }).notNull(),
    dateAdded: timestamp("date_added").notNull(),
    title: varchar({ length: 250 }).notNull(),
    authors: json(),
    isbn: varchar({ length: 25 }),
    pages: integer(),
    isRead: boolean("is_read").notNull(),
    similarBooks: json("similar_books"),
    mobileImage: varchar("mobile_image", { length: 250 }),
    mobileImagePreview: json("mobile_image_preview"),
    smallImage: varchar("small_image", { length: 250 }),
    smallImagePreview: json("small_image_preview"),
    mediumImage: varchar("medium_image", { length: 250 }),
    mediumImagePreview: json("medium_image_preview"),
    publicationDate: varchar("publication_date", { length: 30 }),
    publisher: varchar({ length: 100 }),
    editorialReviews: json("editorial_reviews"),
    averageReview: numeric("average_review", { precision: 2, scale: 1 }),
    numberReviews: integer("number_reviews"),
    amazonSyncEligible: boolean("amazon_sync_eligible"),
    lastAmazonSync: date("last_amazon_sync"),
    lastAmazonSyncSuccess: boolean("last_amazon_sync_success"),
    lastAmazonSyncError: varchar("last_amazon_sync_error"),
  },
  (table) => [
    index("idx_dateadded_user").using(
      "btree",
      table.dateAdded.desc().nullsFirst(),
      table.userId.asc().nullsLast(),
    ),
    index("idx_isbn").using("btree", table.isbn.asc().nullsLast()),
    index("idx_user_dateadded").using(
      "btree",
      table.userId.asc().nullsLast(),
      table.dateAdded.desc().nullsFirst(),
      table.id.desc().nullsFirst(),
    ),
    index("idx_user_pages").using(
      "btree",
      table.userId.asc().nullsLast(),
      table.pages.asc().nullsLast(),
    ),
    index("idx_user_title").using(
      "btree",
      table.userId.asc().nullsLast(),
      table.title.asc().nullsLast(),
    ),
  ],
);

export const booksSubjects = pgTable(
  "books_subjects",
  {
    id: serial().primaryKey(),
    userId: varchar("user_id", { length: 50 }),
    book: integer().notNull(),
    subject: integer().notNull(),
  },
  (table) => [
    uniqueIndex("idx_bookssubjects_book_subject").using(
      "btree",
      table.book.asc().nullsLast(),
      table.subject.asc().nullsLast(),
    ),
    index("idx_bookssubjects_subject").using(
      "btree",
      table.subject.asc().nullsLast(),
    ),
    index("idx_bookssubjects_userid_subject").using(
      "btree",
      table.userId.asc().nullsLast(),
      table.subject.asc().nullsLast(),
    ),
    index("idx_bookstags_book").using("btree", table.book.asc().nullsLast()),
  ],
);

export const booksTags = pgTable(
  "books_tags",
  {
    id: serial().primaryKey(),
    userId: varchar("user_id", { length: 50 }),
    book: integer().notNull(),
    tag: integer().notNull(),
  },
  (table) => [
    index("idx_book").using("btree", table.book.asc().nullsLast()),
    uniqueIndex("idx_bookstags_book_tag").using(
      "btree",
      table.book.asc().nullsLast(),
      table.tag.asc().nullsLast(),
    ),
    index("idx_tag").using("btree", table.tag.asc().nullsLast()),
    index("idx_userid_tag").using(
      "btree",
      table.userId.asc().nullsLast(),
      table.tag.asc().nullsLast(),
    ),
  ],
);

export const session = pgTable(
  "session",
  {
    id: text().primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text().notNull(),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id),
  },
  (table) => [unique("session_token_unique").on(table.token)],
);

export const similarBooks = pgTable(
  "similar_books",
  {
    id: serial().primaryKey(),
    title: varchar({ length: 250 }).notNull(),
    authors: json(),
    authorsLastManualSync: timestamp("authors_last_manual_sync"),
    isbn: varchar({ length: 25 }).notNull(),
    mobileImage: varchar("mobile_image", { length: 250 }),
    mobileImagePreview: json("mobile_image_preview"),
    smallImage: varchar("small_image", { length: 250 }),
    smallImagePreview: json("small_image_preview"),
    unprocessedImage: varchar("unprocessed_image"),
  },
  (table) => [
    index("idx_similarbooks_authors_last_sync").using(
      "btree",
      table.authorsLastManualSync.asc().nullsLast(),
    ),
    index("idx_similarbooks_isbn").using("btree", table.isbn.asc().nullsLast()),
  ],
);

export const subjects = pgTable(
  "subjects",
  {
    id: serial().primaryKey(),
    userId: varchar("user_id", { length: 50 }).notNull(),
    name: varchar({ length: 255 }).notNull(),
    path: varchar({ length: 255 }),
    textColor: varchar("text_color", { length: 255 }),
    backgroundColor: varchar("background_color", { length: 255 }),
  },
  (table) => [
    index("idx_subjects_user_name").using(
      "btree",
      table.userId.asc().nullsLast(),
      table.name.asc().nullsLast(),
    ),
  ],
);

export const tags = pgTable(
  "tags",
  {
    id: serial().primaryKey(),
    userId: varchar("user_id", { length: 50 }).notNull(),
    name: varchar({ length: 255 }).notNull(),
    textColor: varchar("text_color", { length: 255 }),
    backgroundColor: varchar("background_color", { length: 255 }),
  },
  (table) => [
    index("idx_tags_user_name").using(
      "btree",
      table.userId.asc().nullsLast(),
      table.name.asc().nullsLast(),
    ),
  ],
);

export const user = pgTable(
  "user",
  {
    id: text().primaryKey(),
    name: text().notNull(),
    email: text().notNull(),
    emailVerified: boolean("email_verified").notNull(),
    image: text(),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
  },
  (table) => [unique("user_email_unique").on(table.email)],
);

export const userInfo = pgTable("user_info", {
  id: serial().primaryKey(),
  userId: varchar("user_id", { length: 50 }).notNull(),
  publicName: varchar("public_name", { length: 50 }),
  publicBooksHeader: varchar("public_books_header", { length: 50 }),
  isPublic: boolean("is_public"),
});

export const userInfoCache = pgTable("user_info_cache", {
  userId: varchar("user_id", { length: 50 }).primaryKey(),
  name: varchar({ length: 250 }),
  provider: varchar({ length: 50 }),
  email: varchar({ length: 250 }),
  avatar: varchar({ length: 250 }),
  aliasUserId: varchar("alias_user_id", { length: 50 }),
  lastSync: bigint("last_sync", { mode: "number" }).notNull(),
});

export const verification = pgTable("verification", {
  id: text().primaryKey(),
  identifier: text().notNull(),
  value: text().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});
