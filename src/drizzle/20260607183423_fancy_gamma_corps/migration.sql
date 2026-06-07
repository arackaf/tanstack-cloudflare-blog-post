-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "account" (
	"id" text PRIMARY KEY,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "book_scans" (
	"id" serial PRIMARY KEY,
	"user_id" varchar(255) NOT NULL,
	"isbn" varchar(50) NOT NULL,
	"date_added" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"status" varchar(50),
	"book_info" json
);
--> statement-breakpoint
CREATE TABLE "books" (
	"id" serial PRIMARY KEY,
	"user_id" varchar(50) NOT NULL,
	"date_added" timestamp NOT NULL,
	"title" varchar(250) NOT NULL,
	"authors" json,
	"isbn" varchar(25),
	"pages" integer,
	"is_read" boolean NOT NULL,
	"similar_books" json,
	"mobile_image" varchar(250),
	"mobile_image_preview" json,
	"small_image" varchar(250),
	"small_image_preview" json,
	"medium_image" varchar(250),
	"medium_image_preview" json,
	"publication_date" varchar(30),
	"publisher" varchar(100),
	"editorial_reviews" json,
	"average_review" numeric(2,1),
	"number_reviews" integer,
	"amazon_sync_eligible" boolean,
	"last_amazon_sync" date,
	"last_amazon_sync_success" boolean,
	"last_amazon_sync_error" varchar
);
--> statement-breakpoint
CREATE TABLE "books_subjects" (
	"id" serial PRIMARY KEY,
	"user_id" varchar(50),
	"book" integer NOT NULL,
	"subject" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "books_tags" (
	"id" serial PRIMARY KEY,
	"user_id" varchar(50),
	"book" integer NOT NULL,
	"tag" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL CONSTRAINT "session_token_unique" UNIQUE,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "similar_books" (
	"id" serial PRIMARY KEY,
	"title" varchar(250) NOT NULL,
	"authors" json,
	"authors_last_manual_sync" timestamp,
	"isbn" varchar(25) NOT NULL,
	"mobile_image" varchar(250),
	"mobile_image_preview" json,
	"small_image" varchar(250),
	"small_image_preview" json,
	"unprocessed_image" varchar
);
--> statement-breakpoint
CREATE TABLE "subjects" (
	"id" serial PRIMARY KEY,
	"user_id" varchar(50) NOT NULL,
	"name" varchar(255) NOT NULL,
	"path" varchar(255),
	"text_color" varchar(255),
	"background_color" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" serial PRIMARY KEY,
	"user_id" varchar(50) NOT NULL,
	"name" varchar(255) NOT NULL,
	"text_color" varchar(255),
	"background_color" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"email" text NOT NULL CONSTRAINT "user_email_unique" UNIQUE,
	"email_verified" boolean NOT NULL,
	"image" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_info" (
	"id" serial PRIMARY KEY,
	"user_id" varchar(50) NOT NULL,
	"public_name" varchar(50),
	"public_books_header" varchar(50),
	"is_public" boolean
);
--> statement-breakpoint
CREATE TABLE "user_info_cache" (
	"user_id" varchar(50) PRIMARY KEY,
	"name" varchar(250),
	"provider" varchar(50),
	"email" varchar(250),
	"avatar" varchar(250),
	"alias_user_id" varchar(50),
	"last_sync" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE INDEX "idx_book" ON "books_tags" ("book");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_bookstags_book_tag" ON "books_tags" ("book","tag");--> statement-breakpoint
CREATE INDEX "idx_tag" ON "books_tags" ("tag");--> statement-breakpoint
CREATE INDEX "idx_userid_tag" ON "books_tags" ("user_id","tag");--> statement-breakpoint
CREATE INDEX "idx_book_scans_user_id_date" ON "book_scans" ("user_id","date_added");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_bookssubjects_book_subject" ON "books_subjects" ("book","subject");--> statement-breakpoint
CREATE INDEX "idx_bookssubjects_subject" ON "books_subjects" ("subject");--> statement-breakpoint
CREATE INDEX "idx_bookssubjects_userid_subject" ON "books_subjects" ("user_id","subject");--> statement-breakpoint
CREATE INDEX "idx_bookstags_book" ON "books_subjects" ("book");--> statement-breakpoint
CREATE INDEX "idx_dateadded_user" ON "books" ("date_added" DESC,"user_id");--> statement-breakpoint
CREATE INDEX "idx_isbn" ON "books" ("isbn");--> statement-breakpoint
CREATE INDEX "idx_user_dateadded" ON "books" ("user_id","date_added" DESC,"id" DESC);--> statement-breakpoint
CREATE INDEX "idx_user_pages" ON "books" ("user_id","pages");--> statement-breakpoint
CREATE INDEX "idx_user_title" ON "books" ("user_id","title");--> statement-breakpoint
CREATE INDEX "idx_similarbooks_authors_last_sync" ON "similar_books" ("authors_last_manual_sync");--> statement-breakpoint
CREATE INDEX "idx_similarbooks_isbn" ON "similar_books" ("isbn");--> statement-breakpoint
CREATE INDEX "idx_subjects_user_name" ON "subjects" ("user_id","name");--> statement-breakpoint
CREATE INDEX "idx_tags_user_name" ON "tags" ("user_id","name");--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id");--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id");
*/