CREATE TABLE `pages_hero_links` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`link_type` text DEFAULT 'reference',
	`link_new_tab` integer,
	`link_url` text,
	`link_label` text,
	`link_appearance` text DEFAULT 'default',
	FOREIGN KEY (`_parent_id`) REFERENCES `pages`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `pages_hero_links_order_idx` ON `pages_hero_links` (`_order`);
CREATE INDEX `pages_hero_links_parent_id_idx` ON `pages_hero_links` (`_parent_id`);
CREATE TABLE `pages_blocks_cta_links` (
	`_order` integer NOT NULL,
	`_parent_id` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`link_type` text DEFAULT 'reference',
	`link_new_tab` integer,
	`link_url` text,
	`link_label` text,
	`link_appearance` text DEFAULT 'default',
	FOREIGN KEY (`_parent_id`) REFERENCES `pages_blocks_cta`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `pages_blocks_cta_links_order_idx` ON `pages_blocks_cta_links` (`_order`);
CREATE INDEX `pages_blocks_cta_links_parent_id_idx` ON `pages_blocks_cta_links` (`_parent_id`);
CREATE TABLE `pages_blocks_cta` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`rich_text` text,
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `pages`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `pages_blocks_cta_order_idx` ON `pages_blocks_cta` (`_order`);
CREATE INDEX `pages_blocks_cta_parent_id_idx` ON `pages_blocks_cta` (`_parent_id`);
CREATE INDEX `pages_blocks_cta_path_idx` ON `pages_blocks_cta` (`_path`);
CREATE TABLE `pages_blocks_content_columns` (
	`_order` integer NOT NULL,
	`_parent_id` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`size` text DEFAULT 'oneThird',
	`rich_text` text,
	`enable_link` integer,
	`link_type` text DEFAULT 'reference',
	`link_new_tab` integer,
	`link_url` text,
	`link_label` text,
	`link_appearance` text DEFAULT 'default',
	FOREIGN KEY (`_parent_id`) REFERENCES `pages_blocks_content`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `pages_blocks_content_columns_order_idx` ON `pages_blocks_content_columns` (`_order`);
CREATE INDEX `pages_blocks_content_columns_parent_id_idx` ON `pages_blocks_content_columns` (`_parent_id`);
CREATE TABLE `pages_blocks_content` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `pages`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `pages_blocks_content_order_idx` ON `pages_blocks_content` (`_order`);
CREATE INDEX `pages_blocks_content_parent_id_idx` ON `pages_blocks_content` (`_parent_id`);
CREATE INDEX `pages_blocks_content_path_idx` ON `pages_blocks_content` (`_path`);
CREATE TABLE `pages_blocks_media_block` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`media_id` integer,
	`block_name` text,
	FOREIGN KEY (`media_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`_parent_id`) REFERENCES `pages`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `pages_blocks_media_block_order_idx` ON `pages_blocks_media_block` (`_order`);
CREATE INDEX `pages_blocks_media_block_parent_id_idx` ON `pages_blocks_media_block` (`_parent_id`);
CREATE INDEX `pages_blocks_media_block_path_idx` ON `pages_blocks_media_block` (`_path`);
CREATE INDEX `pages_blocks_media_block_media_idx` ON `pages_blocks_media_block` (`media_id`);
CREATE TABLE `pages_blocks_archive` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`intro_content` text,
	`populate_by` text DEFAULT 'collection',
	`relation_to` text DEFAULT 'posts',
	`limit` numeric DEFAULT 10,
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `pages`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `pages_blocks_archive_order_idx` ON `pages_blocks_archive` (`_order`);
CREATE INDEX `pages_blocks_archive_parent_id_idx` ON `pages_blocks_archive` (`_parent_id`);
CREATE INDEX `pages_blocks_archive_path_idx` ON `pages_blocks_archive` (`_path`);
CREATE TABLE `pages_blocks_form_block` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`form_id` integer,
	`enable_intro` integer,
	`intro_content` text,
	`block_name` text,
	FOREIGN KEY (`form_id`) REFERENCES `forms`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`_parent_id`) REFERENCES `pages`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `pages_blocks_form_block_order_idx` ON `pages_blocks_form_block` (`_order`);
CREATE INDEX `pages_blocks_form_block_parent_id_idx` ON `pages_blocks_form_block` (`_parent_id`);
CREATE INDEX `pages_blocks_form_block_path_idx` ON `pages_blocks_form_block` (`_path`);
CREATE INDEX `pages_blocks_form_block_form_idx` ON `pages_blocks_form_block` (`form_id`);
CREATE TABLE `pages` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text,
	`hero_type` text DEFAULT 'lowImpact',
	`hero_rich_text` text,
	`hero_media_id` integer,
	`meta_title` text,
	`meta_image_id` integer,
	`meta_description` text,
	`published_at` text,
	`generate_slug` integer DEFAULT true,
	`slug` text,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`_status` text DEFAULT 'draft',
	FOREIGN KEY (`hero_media_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`meta_image_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null
);
CREATE INDEX `pages_hero_hero_media_idx` ON `pages` (`hero_media_id`);
CREATE INDEX `pages_meta_meta_image_idx` ON `pages` (`meta_image_id`);
CREATE UNIQUE INDEX `pages_slug_idx` ON `pages` (`slug`);
CREATE INDEX `pages_updated_at_idx` ON `pages` (`updated_at`);
CREATE INDEX `pages_created_at_idx` ON `pages` (`created_at`);
CREATE INDEX `pages__status_idx` ON `pages` (`_status`);
CREATE TABLE `pages_rels` (
	`id` integer PRIMARY KEY NOT NULL,
	`order` integer,
	`parent_id` integer NOT NULL,
	`path` text NOT NULL,
	`pages_id` integer,
	`posts_id` integer,
	`categories_id` integer,
	FOREIGN KEY (`parent_id`) REFERENCES `pages`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`pages_id`) REFERENCES `pages`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`posts_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`categories_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `pages_rels_order_idx` ON `pages_rels` (`order`);
CREATE INDEX `pages_rels_parent_idx` ON `pages_rels` (`parent_id`);
CREATE INDEX `pages_rels_path_idx` ON `pages_rels` (`path`);
CREATE INDEX `pages_rels_pages_id_idx` ON `pages_rels` (`pages_id`);
CREATE INDEX `pages_rels_posts_id_idx` ON `pages_rels` (`posts_id`);
CREATE INDEX `pages_rels_categories_id_idx` ON `pages_rels` (`categories_id`);
CREATE TABLE `_pages_v_version_hero_links` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`id` integer PRIMARY KEY NOT NULL,
	`link_type` text DEFAULT 'reference',
	`link_new_tab` integer,
	`link_url` text,
	`link_label` text,
	`link_appearance` text DEFAULT 'default',
	`_uuid` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `_pages_v`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `_pages_v_version_hero_links_order_idx` ON `_pages_v_version_hero_links` (`_order`);
CREATE INDEX `_pages_v_version_hero_links_parent_id_idx` ON `_pages_v_version_hero_links` (`_parent_id`);
CREATE TABLE `_pages_v_blocks_cta_links` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`id` integer PRIMARY KEY NOT NULL,
	`link_type` text DEFAULT 'reference',
	`link_new_tab` integer,
	`link_url` text,
	`link_label` text,
	`link_appearance` text DEFAULT 'default',
	`_uuid` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `_pages_v_blocks_cta`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `_pages_v_blocks_cta_links_order_idx` ON `_pages_v_blocks_cta_links` (`_order`);
CREATE INDEX `_pages_v_blocks_cta_links_parent_id_idx` ON `_pages_v_blocks_cta_links` (`_parent_id`);
CREATE TABLE `_pages_v_blocks_cta` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` integer PRIMARY KEY NOT NULL,
	`rich_text` text,
	`_uuid` text,
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `_pages_v`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `_pages_v_blocks_cta_order_idx` ON `_pages_v_blocks_cta` (`_order`);
CREATE INDEX `_pages_v_blocks_cta_parent_id_idx` ON `_pages_v_blocks_cta` (`_parent_id`);
CREATE INDEX `_pages_v_blocks_cta_path_idx` ON `_pages_v_blocks_cta` (`_path`);
CREATE TABLE `_pages_v_blocks_content_columns` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`id` integer PRIMARY KEY NOT NULL,
	`size` text DEFAULT 'oneThird',
	`rich_text` text,
	`enable_link` integer,
	`link_type` text DEFAULT 'reference',
	`link_new_tab` integer,
	`link_url` text,
	`link_label` text,
	`link_appearance` text DEFAULT 'default',
	`_uuid` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `_pages_v_blocks_content`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `_pages_v_blocks_content_columns_order_idx` ON `_pages_v_blocks_content_columns` (`_order`);
CREATE INDEX `_pages_v_blocks_content_columns_parent_id_idx` ON `_pages_v_blocks_content_columns` (`_parent_id`);
CREATE TABLE `_pages_v_blocks_content` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` integer PRIMARY KEY NOT NULL,
	`_uuid` text,
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `_pages_v`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `_pages_v_blocks_content_order_idx` ON `_pages_v_blocks_content` (`_order`);
CREATE INDEX `_pages_v_blocks_content_parent_id_idx` ON `_pages_v_blocks_content` (`_parent_id`);
CREATE INDEX `_pages_v_blocks_content_path_idx` ON `_pages_v_blocks_content` (`_path`);
CREATE TABLE `_pages_v_blocks_media_block` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` integer PRIMARY KEY NOT NULL,
	`media_id` integer,
	`_uuid` text,
	`block_name` text,
	FOREIGN KEY (`media_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`_parent_id`) REFERENCES `_pages_v`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `_pages_v_blocks_media_block_order_idx` ON `_pages_v_blocks_media_block` (`_order`);
CREATE INDEX `_pages_v_blocks_media_block_parent_id_idx` ON `_pages_v_blocks_media_block` (`_parent_id`);
CREATE INDEX `_pages_v_blocks_media_block_path_idx` ON `_pages_v_blocks_media_block` (`_path`);
CREATE INDEX `_pages_v_blocks_media_block_media_idx` ON `_pages_v_blocks_media_block` (`media_id`);
CREATE TABLE `_pages_v_blocks_archive` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` integer PRIMARY KEY NOT NULL,
	`intro_content` text,
	`populate_by` text DEFAULT 'collection',
	`relation_to` text DEFAULT 'posts',
	`limit` numeric DEFAULT 10,
	`_uuid` text,
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `_pages_v`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `_pages_v_blocks_archive_order_idx` ON `_pages_v_blocks_archive` (`_order`);
CREATE INDEX `_pages_v_blocks_archive_parent_id_idx` ON `_pages_v_blocks_archive` (`_parent_id`);
CREATE INDEX `_pages_v_blocks_archive_path_idx` ON `_pages_v_blocks_archive` (`_path`);
CREATE TABLE `_pages_v_blocks_form_block` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` integer PRIMARY KEY NOT NULL,
	`form_id` integer,
	`enable_intro` integer,
	`intro_content` text,
	`_uuid` text,
	`block_name` text,
	FOREIGN KEY (`form_id`) REFERENCES `forms`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`_parent_id`) REFERENCES `_pages_v`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `_pages_v_blocks_form_block_order_idx` ON `_pages_v_blocks_form_block` (`_order`);
CREATE INDEX `_pages_v_blocks_form_block_parent_id_idx` ON `_pages_v_blocks_form_block` (`_parent_id`);
CREATE INDEX `_pages_v_blocks_form_block_path_idx` ON `_pages_v_blocks_form_block` (`_path`);
CREATE INDEX `_pages_v_blocks_form_block_form_idx` ON `_pages_v_blocks_form_block` (`form_id`);
CREATE TABLE `_pages_v` (
	`id` integer PRIMARY KEY NOT NULL,
	`parent_id` integer,
	`version_title` text,
	`version_hero_type` text DEFAULT 'lowImpact',
	`version_hero_rich_text` text,
	`version_hero_media_id` integer,
	`version_meta_title` text,
	`version_meta_image_id` integer,
	`version_meta_description` text,
	`version_published_at` text,
	`version_generate_slug` integer DEFAULT true,
	`version_slug` text,
	`version_updated_at` text,
	`version_created_at` text,
	`version__status` text DEFAULT 'draft',
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`latest` integer,
	`autosave` integer,
	FOREIGN KEY (`parent_id`) REFERENCES `pages`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`version_hero_media_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`version_meta_image_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null
);
CREATE INDEX `_pages_v_parent_idx` ON `_pages_v` (`parent_id`);
CREATE INDEX `_pages_v_version_hero_version_hero_media_idx` ON `_pages_v` (`version_hero_media_id`);
CREATE INDEX `_pages_v_version_meta_version_meta_image_idx` ON `_pages_v` (`version_meta_image_id`);
CREATE INDEX `_pages_v_version_version_slug_idx` ON `_pages_v` (`version_slug`);
CREATE INDEX `_pages_v_version_version_updated_at_idx` ON `_pages_v` (`version_updated_at`);
CREATE INDEX `_pages_v_version_version_created_at_idx` ON `_pages_v` (`version_created_at`);
CREATE INDEX `_pages_v_version_version__status_idx` ON `_pages_v` (`version__status`);
CREATE INDEX `_pages_v_created_at_idx` ON `_pages_v` (`created_at`);
CREATE INDEX `_pages_v_updated_at_idx` ON `_pages_v` (`updated_at`);
CREATE INDEX `_pages_v_latest_idx` ON `_pages_v` (`latest`);
CREATE INDEX `_pages_v_autosave_idx` ON `_pages_v` (`autosave`);
CREATE TABLE `_pages_v_rels` (
	`id` integer PRIMARY KEY NOT NULL,
	`order` integer,
	`parent_id` integer NOT NULL,
	`path` text NOT NULL,
	`pages_id` integer,
	`posts_id` integer,
	`categories_id` integer,
	FOREIGN KEY (`parent_id`) REFERENCES `_pages_v`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`pages_id`) REFERENCES `pages`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`posts_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`categories_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `_pages_v_rels_order_idx` ON `_pages_v_rels` (`order`);
CREATE INDEX `_pages_v_rels_parent_idx` ON `_pages_v_rels` (`parent_id`);
CREATE INDEX `_pages_v_rels_path_idx` ON `_pages_v_rels` (`path`);
CREATE INDEX `_pages_v_rels_pages_id_idx` ON `_pages_v_rels` (`pages_id`);
CREATE INDEX `_pages_v_rels_posts_id_idx` ON `_pages_v_rels` (`posts_id`);
CREATE INDEX `_pages_v_rels_categories_id_idx` ON `_pages_v_rels` (`categories_id`);
CREATE TABLE `posts_populated_authors` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `posts_populated_authors_order_idx` ON `posts_populated_authors` (`_order`);
CREATE INDEX `posts_populated_authors_parent_id_idx` ON `posts_populated_authors` (`_parent_id`);
CREATE TABLE `posts` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text,
	`hero_image_id` integer,
	`content` text,
	`meta_title` text,
	`meta_image_id` integer,
	`meta_description` text,
	`published_at` text,
	`generate_slug` integer DEFAULT true,
	`slug` text,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`_status` text DEFAULT 'draft',
	FOREIGN KEY (`hero_image_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`meta_image_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null
);
CREATE INDEX `posts_hero_image_idx` ON `posts` (`hero_image_id`);
CREATE INDEX `posts_meta_meta_image_idx` ON `posts` (`meta_image_id`);
CREATE UNIQUE INDEX `posts_slug_idx` ON `posts` (`slug`);
CREATE INDEX `posts_updated_at_idx` ON `posts` (`updated_at`);
CREATE INDEX `posts_created_at_idx` ON `posts` (`created_at`);
CREATE INDEX `posts__status_idx` ON `posts` (`_status`);
CREATE TABLE `posts_rels` (
	`id` integer PRIMARY KEY NOT NULL,
	`order` integer,
	`parent_id` integer NOT NULL,
	`path` text NOT NULL,
	`posts_id` integer,
	`categories_id` integer,
	`users_id` integer,
	FOREIGN KEY (`parent_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`posts_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`categories_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`users_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `posts_rels_order_idx` ON `posts_rels` (`order`);
CREATE INDEX `posts_rels_parent_idx` ON `posts_rels` (`parent_id`);
CREATE INDEX `posts_rels_path_idx` ON `posts_rels` (`path`);
CREATE INDEX `posts_rels_posts_id_idx` ON `posts_rels` (`posts_id`);
CREATE INDEX `posts_rels_categories_id_idx` ON `posts_rels` (`categories_id`);
CREATE INDEX `posts_rels_users_id_idx` ON `posts_rels` (`users_id`);
CREATE TABLE `_posts_v_version_populated_authors` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`id` integer PRIMARY KEY NOT NULL,
	`_uuid` text,
	`name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `_posts_v`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `_posts_v_version_populated_authors_order_idx` ON `_posts_v_version_populated_authors` (`_order`);
CREATE INDEX `_posts_v_version_populated_authors_parent_id_idx` ON `_posts_v_version_populated_authors` (`_parent_id`);
CREATE TABLE `_posts_v` (
	`id` integer PRIMARY KEY NOT NULL,
	`parent_id` integer,
	`version_title` text,
	`version_hero_image_id` integer,
	`version_content` text,
	`version_meta_title` text,
	`version_meta_image_id` integer,
	`version_meta_description` text,
	`version_published_at` text,
	`version_generate_slug` integer DEFAULT true,
	`version_slug` text,
	`version_updated_at` text,
	`version_created_at` text,
	`version__status` text DEFAULT 'draft',
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`latest` integer,
	`autosave` integer,
	FOREIGN KEY (`parent_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`version_hero_image_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`version_meta_image_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null
);
CREATE INDEX `_posts_v_parent_idx` ON `_posts_v` (`parent_id`);
CREATE INDEX `_posts_v_version_version_hero_image_idx` ON `_posts_v` (`version_hero_image_id`);
CREATE INDEX `_posts_v_version_meta_version_meta_image_idx` ON `_posts_v` (`version_meta_image_id`);
CREATE INDEX `_posts_v_version_version_slug_idx` ON `_posts_v` (`version_slug`);
CREATE INDEX `_posts_v_version_version_updated_at_idx` ON `_posts_v` (`version_updated_at`);
CREATE INDEX `_posts_v_version_version_created_at_idx` ON `_posts_v` (`version_created_at`);
CREATE INDEX `_posts_v_version_version__status_idx` ON `_posts_v` (`version__status`);
CREATE INDEX `_posts_v_created_at_idx` ON `_posts_v` (`created_at`);
CREATE INDEX `_posts_v_updated_at_idx` ON `_posts_v` (`updated_at`);
CREATE INDEX `_posts_v_latest_idx` ON `_posts_v` (`latest`);
CREATE INDEX `_posts_v_autosave_idx` ON `_posts_v` (`autosave`);
CREATE TABLE `_posts_v_rels` (
	`id` integer PRIMARY KEY NOT NULL,
	`order` integer,
	`parent_id` integer NOT NULL,
	`path` text NOT NULL,
	`posts_id` integer,
	`categories_id` integer,
	`users_id` integer,
	FOREIGN KEY (`parent_id`) REFERENCES `_posts_v`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`posts_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`categories_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`users_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `_posts_v_rels_order_idx` ON `_posts_v_rels` (`order`);
CREATE INDEX `_posts_v_rels_parent_idx` ON `_posts_v_rels` (`parent_id`);
CREATE INDEX `_posts_v_rels_path_idx` ON `_posts_v_rels` (`path`);
CREATE INDEX `_posts_v_rels_posts_id_idx` ON `_posts_v_rels` (`posts_id`);
CREATE INDEX `_posts_v_rels_categories_id_idx` ON `_posts_v_rels` (`categories_id`);
CREATE INDEX `_posts_v_rels_users_id_idx` ON `_posts_v_rels` (`users_id`);
CREATE TABLE `media` (
	`id` integer PRIMARY KEY NOT NULL,
	`alt` text,
	`caption` text,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`url` text,
	`thumbnail_u_r_l` text,
	`filename` text,
	`mime_type` text,
	`filesize` numeric,
	`width` numeric,
	`height` numeric,
	`focal_x` numeric,
	`focal_y` numeric,
	`sizes_thumbnail_url` text,
	`sizes_thumbnail_width` numeric,
	`sizes_thumbnail_height` numeric,
	`sizes_thumbnail_mime_type` text,
	`sizes_thumbnail_filesize` numeric,
	`sizes_thumbnail_filename` text,
	`sizes_square_url` text,
	`sizes_square_width` numeric,
	`sizes_square_height` numeric,
	`sizes_square_mime_type` text,
	`sizes_square_filesize` numeric,
	`sizes_square_filename` text,
	`sizes_small_url` text,
	`sizes_small_width` numeric,
	`sizes_small_height` numeric,
	`sizes_small_mime_type` text,
	`sizes_small_filesize` numeric,
	`sizes_small_filename` text,
	`sizes_medium_url` text,
	`sizes_medium_width` numeric,
	`sizes_medium_height` numeric,
	`sizes_medium_mime_type` text,
	`sizes_medium_filesize` numeric,
	`sizes_medium_filename` text,
	`sizes_large_url` text,
	`sizes_large_width` numeric,
	`sizes_large_height` numeric,
	`sizes_large_mime_type` text,
	`sizes_large_filesize` numeric,
	`sizes_large_filename` text,
	`sizes_xlarge_url` text,
	`sizes_xlarge_width` numeric,
	`sizes_xlarge_height` numeric,
	`sizes_xlarge_mime_type` text,
	`sizes_xlarge_filesize` numeric,
	`sizes_xlarge_filename` text,
	`sizes_og_url` text,
	`sizes_og_width` numeric,
	`sizes_og_height` numeric,
	`sizes_og_mime_type` text,
	`sizes_og_filesize` numeric,
	`sizes_og_filename` text
);
CREATE INDEX `media_updated_at_idx` ON `media` (`updated_at`);
CREATE INDEX `media_created_at_idx` ON `media` (`created_at`);
CREATE UNIQUE INDEX `media_filename_idx` ON `media` (`filename`);
CREATE INDEX `media_sizes_thumbnail_sizes_thumbnail_filename_idx` ON `media` (`sizes_thumbnail_filename`);
CREATE INDEX `media_sizes_square_sizes_square_filename_idx` ON `media` (`sizes_square_filename`);
CREATE INDEX `media_sizes_small_sizes_small_filename_idx` ON `media` (`sizes_small_filename`);
CREATE INDEX `media_sizes_medium_sizes_medium_filename_idx` ON `media` (`sizes_medium_filename`);
CREATE INDEX `media_sizes_large_sizes_large_filename_idx` ON `media` (`sizes_large_filename`);
CREATE INDEX `media_sizes_xlarge_sizes_xlarge_filename_idx` ON `media` (`sizes_xlarge_filename`);
CREATE INDEX `media_sizes_og_sizes_og_filename_idx` ON `media` (`sizes_og_filename`);
CREATE TABLE `categories_breadcrumbs` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`doc_id` integer,
	`url` text,
	`label` text,
	FOREIGN KEY (`doc_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`_parent_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `categories_breadcrumbs_order_idx` ON `categories_breadcrumbs` (`_order`);
CREATE INDEX `categories_breadcrumbs_parent_id_idx` ON `categories_breadcrumbs` (`_parent_id`);
CREATE INDEX `categories_breadcrumbs_doc_idx` ON `categories_breadcrumbs` (`doc_id`);
CREATE TABLE `categories` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`generate_slug` integer DEFAULT true,
	`slug` text NOT NULL,
	`parent_id` integer,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	FOREIGN KEY (`parent_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE set null
);
CREATE UNIQUE INDEX `categories_slug_idx` ON `categories` (`slug`);
CREATE INDEX `categories_parent_idx` ON `categories` (`parent_id`);
CREATE INDEX `categories_updated_at_idx` ON `categories` (`updated_at`);
CREATE INDEX `categories_created_at_idx` ON `categories` (`created_at`);
CREATE TABLE `users_sessions` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`created_at` text,
	`expires_at` text NOT NULL,
	FOREIGN KEY (`_parent_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `users_sessions_order_idx` ON `users_sessions` (`_order`);
CREATE INDEX `users_sessions_parent_id_idx` ON `users_sessions` (`_parent_id`);
CREATE TABLE `users` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`email` text NOT NULL,
	`reset_password_token` text,
	`reset_password_expiration` text,
	`salt` text,
	`hash` text,
	`login_attempts` numeric DEFAULT 0,
	`lock_until` text
);
CREATE INDEX `users_updated_at_idx` ON `users` (`updated_at`);
CREATE INDEX `users_created_at_idx` ON `users` (`created_at`);
CREATE UNIQUE INDEX `users_email_idx` ON `users` (`email`);
CREATE TABLE `projects_sections_media` (
	`_order` integer NOT NULL,
	`_parent_id` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`media_item_id` integer,
	`caption` text,
	FOREIGN KEY (`media_item_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`_parent_id`) REFERENCES `projects_sections`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `projects_sections_media_order_idx` ON `projects_sections_media` (`_order`);
CREATE INDEX `projects_sections_media_parent_id_idx` ON `projects_sections_media` (`_parent_id`);
CREATE INDEX `projects_sections_media_media_item_idx` ON `projects_sections_media` (`media_item_id`);
CREATE TABLE `projects_sections` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`section_title` text,
	`text_body` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `projects_sections_order_idx` ON `projects_sections` (`_order`);
CREATE INDEX `projects_sections_parent_id_idx` ON `projects_sections` (`_parent_id`);
CREATE TABLE `projects` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text,
	`slug` text,
	`hero_image_id` integer,
	`published_at` text,
	`year` numeric,
	`newly_added` integer,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`_status` text DEFAULT 'draft',
	FOREIGN KEY (`hero_image_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null
);
CREATE UNIQUE INDEX `projects_slug_idx` ON `projects` (`slug`);
CREATE INDEX `projects_hero_image_idx` ON `projects` (`hero_image_id`);
CREATE INDEX `projects_updated_at_idx` ON `projects` (`updated_at`);
CREATE INDEX `projects_created_at_idx` ON `projects` (`created_at`);
CREATE INDEX `projects__status_idx` ON `projects` (`_status`);
CREATE TABLE `_projects_v_version_sections_media` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`id` integer PRIMARY KEY NOT NULL,
	`media_item_id` integer,
	`caption` text,
	`_uuid` text,
	FOREIGN KEY (`media_item_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`_parent_id`) REFERENCES `_projects_v_version_sections`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `_projects_v_version_sections_media_order_idx` ON `_projects_v_version_sections_media` (`_order`);
CREATE INDEX `_projects_v_version_sections_media_parent_id_idx` ON `_projects_v_version_sections_media` (`_parent_id`);
CREATE INDEX `_projects_v_version_sections_media_media_item_idx` ON `_projects_v_version_sections_media` (`media_item_id`);
CREATE TABLE `_projects_v_version_sections` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`id` integer PRIMARY KEY NOT NULL,
	`section_title` text,
	`text_body` text,
	`_uuid` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `_projects_v`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `_projects_v_version_sections_order_idx` ON `_projects_v_version_sections` (`_order`);
CREATE INDEX `_projects_v_version_sections_parent_id_idx` ON `_projects_v_version_sections` (`_parent_id`);
CREATE TABLE `_projects_v` (
	`id` integer PRIMARY KEY NOT NULL,
	`parent_id` integer,
	`version_title` text,
	`version_slug` text,
	`version_hero_image_id` integer,
	`version_published_at` text,
	`version_year` numeric,
	`version_newly_added` integer,
	`version_updated_at` text,
	`version_created_at` text,
	`version__status` text DEFAULT 'draft',
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`latest` integer,
	FOREIGN KEY (`parent_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`version_hero_image_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null
);
CREATE INDEX `_projects_v_parent_idx` ON `_projects_v` (`parent_id`);
CREATE INDEX `_projects_v_version_version_slug_idx` ON `_projects_v` (`version_slug`);
CREATE INDEX `_projects_v_version_version_hero_image_idx` ON `_projects_v` (`version_hero_image_id`);
CREATE INDEX `_projects_v_version_version_updated_at_idx` ON `_projects_v` (`version_updated_at`);
CREATE INDEX `_projects_v_version_version_created_at_idx` ON `_projects_v` (`version_created_at`);
CREATE INDEX `_projects_v_version_version__status_idx` ON `_projects_v` (`version__status`);
CREATE INDEX `_projects_v_created_at_idx` ON `_projects_v` (`created_at`);
CREATE INDEX `_projects_v_updated_at_idx` ON `_projects_v` (`updated_at`);
CREATE INDEX `_projects_v_latest_idx` ON `_projects_v` (`latest`);
CREATE TABLE `redirects` (
	`id` integer PRIMARY KEY NOT NULL,
	`from` text NOT NULL,
	`to_type` text DEFAULT 'reference',
	`to_url` text,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);
CREATE UNIQUE INDEX `redirects_from_idx` ON `redirects` (`from`);
CREATE INDEX `redirects_updated_at_idx` ON `redirects` (`updated_at`);
CREATE INDEX `redirects_created_at_idx` ON `redirects` (`created_at`);
CREATE TABLE `redirects_rels` (
	`id` integer PRIMARY KEY NOT NULL,
	`order` integer,
	`parent_id` integer NOT NULL,
	`path` text NOT NULL,
	`pages_id` integer,
	`posts_id` integer,
	FOREIGN KEY (`parent_id`) REFERENCES `redirects`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`pages_id`) REFERENCES `pages`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`posts_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `redirects_rels_order_idx` ON `redirects_rels` (`order`);
CREATE INDEX `redirects_rels_parent_idx` ON `redirects_rels` (`parent_id`);
CREATE INDEX `redirects_rels_path_idx` ON `redirects_rels` (`path`);
CREATE INDEX `redirects_rels_pages_id_idx` ON `redirects_rels` (`pages_id`);
CREATE INDEX `redirects_rels_posts_id_idx` ON `redirects_rels` (`posts_id`);
CREATE TABLE `forms_blocks_checkbox` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`label` text,
	`width` numeric,
	`required` integer,
	`default_value` integer,
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `forms`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `forms_blocks_checkbox_order_idx` ON `forms_blocks_checkbox` (`_order`);
CREATE INDEX `forms_blocks_checkbox_parent_id_idx` ON `forms_blocks_checkbox` (`_parent_id`);
CREATE INDEX `forms_blocks_checkbox_path_idx` ON `forms_blocks_checkbox` (`_path`);
CREATE TABLE `forms_blocks_country` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`label` text,
	`width` numeric,
	`required` integer,
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `forms`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `forms_blocks_country_order_idx` ON `forms_blocks_country` (`_order`);
CREATE INDEX `forms_blocks_country_parent_id_idx` ON `forms_blocks_country` (`_parent_id`);
CREATE INDEX `forms_blocks_country_path_idx` ON `forms_blocks_country` (`_path`);
CREATE TABLE `forms_blocks_email` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`label` text,
	`width` numeric,
	`required` integer,
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `forms`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `forms_blocks_email_order_idx` ON `forms_blocks_email` (`_order`);
CREATE INDEX `forms_blocks_email_parent_id_idx` ON `forms_blocks_email` (`_parent_id`);
CREATE INDEX `forms_blocks_email_path_idx` ON `forms_blocks_email` (`_path`);
CREATE TABLE `forms_blocks_message` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`message` text,
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `forms`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `forms_blocks_message_order_idx` ON `forms_blocks_message` (`_order`);
CREATE INDEX `forms_blocks_message_parent_id_idx` ON `forms_blocks_message` (`_parent_id`);
CREATE INDEX `forms_blocks_message_path_idx` ON `forms_blocks_message` (`_path`);
CREATE TABLE `forms_blocks_number` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`label` text,
	`width` numeric,
	`default_value` numeric,
	`required` integer,
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `forms`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `forms_blocks_number_order_idx` ON `forms_blocks_number` (`_order`);
CREATE INDEX `forms_blocks_number_parent_id_idx` ON `forms_blocks_number` (`_parent_id`);
CREATE INDEX `forms_blocks_number_path_idx` ON `forms_blocks_number` (`_path`);
CREATE TABLE `forms_blocks_select_options` (
	`_order` integer NOT NULL,
	`_parent_id` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`label` text NOT NULL,
	`value` text NOT NULL,
	FOREIGN KEY (`_parent_id`) REFERENCES `forms_blocks_select`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `forms_blocks_select_options_order_idx` ON `forms_blocks_select_options` (`_order`);
CREATE INDEX `forms_blocks_select_options_parent_id_idx` ON `forms_blocks_select_options` (`_parent_id`);
CREATE TABLE `forms_blocks_select` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`label` text,
	`width` numeric,
	`default_value` text,
	`placeholder` text,
	`required` integer,
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `forms`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `forms_blocks_select_order_idx` ON `forms_blocks_select` (`_order`);
CREATE INDEX `forms_blocks_select_parent_id_idx` ON `forms_blocks_select` (`_parent_id`);
CREATE INDEX `forms_blocks_select_path_idx` ON `forms_blocks_select` (`_path`);
CREATE TABLE `forms_blocks_state` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`label` text,
	`width` numeric,
	`required` integer,
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `forms`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `forms_blocks_state_order_idx` ON `forms_blocks_state` (`_order`);
CREATE INDEX `forms_blocks_state_parent_id_idx` ON `forms_blocks_state` (`_parent_id`);
CREATE INDEX `forms_blocks_state_path_idx` ON `forms_blocks_state` (`_path`);
CREATE TABLE `forms_blocks_text` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`label` text,
	`width` numeric,
	`default_value` text,
	`required` integer,
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `forms`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `forms_blocks_text_order_idx` ON `forms_blocks_text` (`_order`);
CREATE INDEX `forms_blocks_text_parent_id_idx` ON `forms_blocks_text` (`_parent_id`);
CREATE INDEX `forms_blocks_text_path_idx` ON `forms_blocks_text` (`_path`);
CREATE TABLE `forms_blocks_textarea` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`label` text,
	`width` numeric,
	`default_value` text,
	`required` integer,
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `forms`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `forms_blocks_textarea_order_idx` ON `forms_blocks_textarea` (`_order`);
CREATE INDEX `forms_blocks_textarea_parent_id_idx` ON `forms_blocks_textarea` (`_parent_id`);
CREATE INDEX `forms_blocks_textarea_path_idx` ON `forms_blocks_textarea` (`_path`);
CREATE TABLE `forms_emails` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`email_to` text,
	`cc` text,
	`bcc` text,
	`reply_to` text,
	`email_from` text,
	`subject` text DEFAULT 'You''ve received a new message.' NOT NULL,
	`message` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `forms`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `forms_emails_order_idx` ON `forms_emails` (`_order`);
CREATE INDEX `forms_emails_parent_id_idx` ON `forms_emails` (`_parent_id`);
CREATE TABLE `forms` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`submit_button_label` text,
	`confirmation_type` text DEFAULT 'message',
	`confirmation_message` text,
	`redirect_url` text,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);
CREATE INDEX `forms_updated_at_idx` ON `forms` (`updated_at`);
CREATE INDEX `forms_created_at_idx` ON `forms` (`created_at`);
CREATE TABLE `form_submissions_submission_data` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`field` text NOT NULL,
	`value` text NOT NULL,
	FOREIGN KEY (`_parent_id`) REFERENCES `form_submissions`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `form_submissions_submission_data_order_idx` ON `form_submissions_submission_data` (`_order`);
CREATE INDEX `form_submissions_submission_data_parent_id_idx` ON `form_submissions_submission_data` (`_parent_id`);
CREATE TABLE `form_submissions` (
	`id` integer PRIMARY KEY NOT NULL,
	`form_id` integer NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	FOREIGN KEY (`form_id`) REFERENCES `forms`(`id`) ON UPDATE no action ON DELETE set null
);
CREATE INDEX `form_submissions_form_idx` ON `form_submissions` (`form_id`);
CREATE INDEX `form_submissions_updated_at_idx` ON `form_submissions` (`updated_at`);
CREATE INDEX `form_submissions_created_at_idx` ON `form_submissions` (`created_at`);
CREATE TABLE `search_categories` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`relation_to` text,
	`category_i_d` text,
	`title` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `search`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `search_categories_order_idx` ON `search_categories` (`_order`);
CREATE INDEX `search_categories_parent_id_idx` ON `search_categories` (`_parent_id`);
CREATE TABLE `search` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text,
	`priority` numeric,
	`slug` text,
	`meta_title` text,
	`meta_description` text,
	`meta_image_id` integer,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	FOREIGN KEY (`meta_image_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null
);
CREATE INDEX `search_slug_idx` ON `search` (`slug`);
CREATE INDEX `search_meta_meta_image_idx` ON `search` (`meta_image_id`);
CREATE INDEX `search_updated_at_idx` ON `search` (`updated_at`);
CREATE INDEX `search_created_at_idx` ON `search` (`created_at`);
CREATE TABLE `search_rels` (
	`id` integer PRIMARY KEY NOT NULL,
	`order` integer,
	`parent_id` integer NOT NULL,
	`path` text NOT NULL,
	`posts_id` integer,
	FOREIGN KEY (`parent_id`) REFERENCES `search`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`posts_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `search_rels_order_idx` ON `search_rels` (`order`);
CREATE INDEX `search_rels_parent_idx` ON `search_rels` (`parent_id`);
CREATE INDEX `search_rels_path_idx` ON `search_rels` (`path`);
CREATE INDEX `search_rels_posts_id_idx` ON `search_rels` (`posts_id`);
CREATE TABLE `payload_jobs_log` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`executed_at` text NOT NULL,
	`completed_at` text NOT NULL,
	`task_slug` text NOT NULL,
	`task_i_d` text NOT NULL,
	`input` text,
	`output` text,
	`state` text NOT NULL,
	`error` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `payload_jobs`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `payload_jobs_log_order_idx` ON `payload_jobs_log` (`_order`);
CREATE INDEX `payload_jobs_log_parent_id_idx` ON `payload_jobs_log` (`_parent_id`);
CREATE TABLE `payload_jobs` (
	`id` integer PRIMARY KEY NOT NULL,
	`input` text,
	`completed_at` text,
	`total_tried` numeric DEFAULT 0,
	`has_error` integer DEFAULT false,
	`error` text,
	`task_slug` text,
	`queue` text DEFAULT 'default',
	`wait_until` text,
	`processing` integer DEFAULT false,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);
CREATE INDEX `payload_jobs_completed_at_idx` ON `payload_jobs` (`completed_at`);
CREATE INDEX `payload_jobs_total_tried_idx` ON `payload_jobs` (`total_tried`);
CREATE INDEX `payload_jobs_has_error_idx` ON `payload_jobs` (`has_error`);
CREATE INDEX `payload_jobs_task_slug_idx` ON `payload_jobs` (`task_slug`);
CREATE INDEX `payload_jobs_queue_idx` ON `payload_jobs` (`queue`);
CREATE INDEX `payload_jobs_wait_until_idx` ON `payload_jobs` (`wait_until`);
CREATE INDEX `payload_jobs_processing_idx` ON `payload_jobs` (`processing`);
CREATE INDEX `payload_jobs_updated_at_idx` ON `payload_jobs` (`updated_at`);
CREATE INDEX `payload_jobs_created_at_idx` ON `payload_jobs` (`created_at`);
CREATE TABLE `payload_locked_documents` (
	`id` integer PRIMARY KEY NOT NULL,
	`global_slug` text,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);
CREATE INDEX `payload_locked_documents_global_slug_idx` ON `payload_locked_documents` (`global_slug`);
CREATE INDEX `payload_locked_documents_updated_at_idx` ON `payload_locked_documents` (`updated_at`);
CREATE INDEX `payload_locked_documents_created_at_idx` ON `payload_locked_documents` (`created_at`);
CREATE TABLE `payload_locked_documents_rels` (
	`id` integer PRIMARY KEY NOT NULL,
	`order` integer,
	`parent_id` integer NOT NULL,
	`path` text NOT NULL,
	`pages_id` integer,
	`posts_id` integer,
	`media_id` integer,
	`categories_id` integer,
	`users_id` integer,
	`projects_id` integer,
	`redirects_id` integer,
	`forms_id` integer,
	`form_submissions_id` integer,
	`search_id` integer,
	`payload_jobs_id` integer,
	FOREIGN KEY (`parent_id`) REFERENCES `payload_locked_documents`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`pages_id`) REFERENCES `pages`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`posts_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`media_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`categories_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`users_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`projects_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`redirects_id`) REFERENCES `redirects`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`forms_id`) REFERENCES `forms`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`form_submissions_id`) REFERENCES `form_submissions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`search_id`) REFERENCES `search`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`payload_jobs_id`) REFERENCES `payload_jobs`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `payload_locked_documents_rels_order_idx` ON `payload_locked_documents_rels` (`order`);
CREATE INDEX `payload_locked_documents_rels_parent_idx` ON `payload_locked_documents_rels` (`parent_id`);
CREATE INDEX `payload_locked_documents_rels_path_idx` ON `payload_locked_documents_rels` (`path`);
CREATE INDEX `payload_locked_documents_rels_pages_id_idx` ON `payload_locked_documents_rels` (`pages_id`);
CREATE INDEX `payload_locked_documents_rels_posts_id_idx` ON `payload_locked_documents_rels` (`posts_id`);
CREATE INDEX `payload_locked_documents_rels_media_id_idx` ON `payload_locked_documents_rels` (`media_id`);
CREATE INDEX `payload_locked_documents_rels_categories_id_idx` ON `payload_locked_documents_rels` (`categories_id`);
CREATE INDEX `payload_locked_documents_rels_users_id_idx` ON `payload_locked_documents_rels` (`users_id`);
CREATE INDEX `payload_locked_documents_rels_projects_id_idx` ON `payload_locked_documents_rels` (`projects_id`);
CREATE INDEX `payload_locked_documents_rels_redirects_id_idx` ON `payload_locked_documents_rels` (`redirects_id`);
CREATE INDEX `payload_locked_documents_rels_forms_id_idx` ON `payload_locked_documents_rels` (`forms_id`);
CREATE INDEX `payload_locked_documents_rels_form_submissions_id_idx` ON `payload_locked_documents_rels` (`form_submissions_id`);
CREATE INDEX `payload_locked_documents_rels_search_id_idx` ON `payload_locked_documents_rels` (`search_id`);
CREATE INDEX `payload_locked_documents_rels_payload_jobs_id_idx` ON `payload_locked_documents_rels` (`payload_jobs_id`);
CREATE TABLE `payload_preferences` (
	`id` integer PRIMARY KEY NOT NULL,
	`key` text,
	`value` text,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);
CREATE INDEX `payload_preferences_key_idx` ON `payload_preferences` (`key`);
CREATE INDEX `payload_preferences_updated_at_idx` ON `payload_preferences` (`updated_at`);
CREATE INDEX `payload_preferences_created_at_idx` ON `payload_preferences` (`created_at`);
CREATE TABLE `payload_preferences_rels` (
	`id` integer PRIMARY KEY NOT NULL,
	`order` integer,
	`parent_id` integer NOT NULL,
	`path` text NOT NULL,
	`users_id` integer,
	FOREIGN KEY (`parent_id`) REFERENCES `payload_preferences`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`users_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `payload_preferences_rels_order_idx` ON `payload_preferences_rels` (`order`);
CREATE INDEX `payload_preferences_rels_parent_idx` ON `payload_preferences_rels` (`parent_id`);
CREATE INDEX `payload_preferences_rels_path_idx` ON `payload_preferences_rels` (`path`);
CREATE INDEX `payload_preferences_rels_users_id_idx` ON `payload_preferences_rels` (`users_id`);
CREATE TABLE `payload_migrations` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text,
	`batch` numeric,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);
CREATE INDEX `payload_migrations_updated_at_idx` ON `payload_migrations` (`updated_at`);
CREATE INDEX `payload_migrations_created_at_idx` ON `payload_migrations` (`created_at`);
CREATE TABLE `header_nav_items` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`link_type` text DEFAULT 'reference',
	`link_new_tab` integer,
	`link_url` text,
	`link_label` text NOT NULL,
	FOREIGN KEY (`_parent_id`) REFERENCES `header`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `header_nav_items_order_idx` ON `header_nav_items` (`_order`);
CREATE INDEX `header_nav_items_parent_id_idx` ON `header_nav_items` (`_parent_id`);
CREATE TABLE `header` (
	`id` integer PRIMARY KEY NOT NULL,
	`updated_at` text,
	`created_at` text
);
CREATE TABLE `header_rels` (
	`id` integer PRIMARY KEY NOT NULL,
	`order` integer,
	`parent_id` integer NOT NULL,
	`path` text NOT NULL,
	`pages_id` integer,
	`posts_id` integer,
	FOREIGN KEY (`parent_id`) REFERENCES `header`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`pages_id`) REFERENCES `pages`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`posts_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `header_rels_order_idx` ON `header_rels` (`order`);
CREATE INDEX `header_rels_parent_idx` ON `header_rels` (`parent_id`);
CREATE INDEX `header_rels_path_idx` ON `header_rels` (`path`);
CREATE INDEX `header_rels_pages_id_idx` ON `header_rels` (`pages_id`);
CREATE INDEX `header_rels_posts_id_idx` ON `header_rels` (`posts_id`);
CREATE TABLE `footer_nav_items` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`link_type` text DEFAULT 'reference',
	`link_new_tab` integer,
	`link_url` text,
	`link_label` text NOT NULL,
	FOREIGN KEY (`_parent_id`) REFERENCES `footer`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `footer_nav_items_order_idx` ON `footer_nav_items` (`_order`);
CREATE INDEX `footer_nav_items_parent_id_idx` ON `footer_nav_items` (`_parent_id`);
CREATE TABLE `footer` (
	`id` integer PRIMARY KEY NOT NULL,
	`updated_at` text,
	`created_at` text
);
CREATE TABLE `footer_rels` (
	`id` integer PRIMARY KEY NOT NULL,
	`order` integer,
	`parent_id` integer NOT NULL,
	`path` text NOT NULL,
	`pages_id` integer,
	`posts_id` integer,
	FOREIGN KEY (`parent_id`) REFERENCES `footer`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`pages_id`) REFERENCES `pages`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`posts_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `footer_rels_order_idx` ON `footer_rels` (`order`);
CREATE INDEX `footer_rels_parent_idx` ON `footer_rels` (`parent_id`);
CREATE INDEX `footer_rels_path_idx` ON `footer_rels` (`path`);
CREATE INDEX `footer_rels_pages_id_idx` ON `footer_rels` (`pages_id`);
CREATE INDEX `footer_rels_posts_id_idx` ON `footer_rels` (`posts_id`);
