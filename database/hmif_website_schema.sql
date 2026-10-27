-- HMIF Website CMS - MySQL 8+
-- Initial schema for the public website and single-admin CMS.
-- Review the notes below before applying to a production database.

CREATE DATABASE IF NOT EXISTS hmif_website
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;

USE hmif_website;

-- 1. Admin accounts (no public registration endpoint)
CREATE TABLE IF NOT EXISTS admins (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_admins_email (email)
) ENGINE=InnoDB;

-- 2. News categories
CREATE TABLE IF NOT EXISTS news_categories (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(120) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_news_categories_name (name),
  UNIQUE KEY uq_news_categories_slug (slug)
) ENGINE=InnoDB;

-- 3. News articles
CREATE TABLE IF NOT EXISTS news_articles (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  category_id BIGINT UNSIGNED NOT NULL,
  admin_id BIGINT UNSIGNED NULL,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(280) NOT NULL,
  excerpt TEXT NULL,
  content LONGTEXT NOT NULL,
  cover_image VARCHAR(500) NULL,
  status ENUM('draft', 'published') NOT NULL DEFAULT 'draft',
  published_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_news_articles_slug (slug),
  KEY idx_news_articles_status_published (status, published_at),
  KEY idx_news_articles_category (category_id),
  KEY idx_news_articles_admin (admin_id),
  CONSTRAINT fk_news_articles_category
    FOREIGN KEY (category_id) REFERENCES news_categories (id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_news_articles_admin
    FOREIGN KEY (admin_id) REFERENCES admins (id)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB;

-- 4. Organization divisions
CREATE TABLE IF NOT EXISTS organization_divisions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(150) NOT NULL,
  description TEXT NULL,
  display_order INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_organization_divisions_name (name),
  KEY idx_organization_divisions_order (display_order, name)
) ENGINE=InnoDB;

-- 5. Programs / work plans
-- execution status and public catalog publication status are intentionally separate.
CREATE TABLE IF NOT EXISTS programs (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  division_id BIGINT UNSIGNED NULL,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(280) NOT NULL,
  description LONGTEXT NOT NULL,
  period VARCHAR(100) NOT NULL,
  pic_name VARCHAR(150) NULL,
  start_date DATE NULL,
  end_date DATE NULL,
  status ENUM('planned', 'ongoing', 'completed') NOT NULL DEFAULT 'planned',
  publication_status ENUM('draft', 'published') NOT NULL DEFAULT 'draft',
  cover_image VARCHAR(500) NULL,
  display_order INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_programs_slug (slug),
  KEY idx_programs_publication_status (publication_status, display_order),
  KEY idx_programs_execution_status (status),
  KEY idx_programs_division (division_id),
  CONSTRAINT fk_programs_division
    FOREIGN KEY (division_id) REFERENCES organization_divisions (id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT chk_programs_date_range
    CHECK (start_date IS NULL OR end_date IS NULL OR end_date >= start_date)
) ENGINE=InnoDB;

-- 6. Organization members / positions
CREATE TABLE IF NOT EXISTS organization_members (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  division_id BIGINT UNSIGNED NULL,
  name VARCHAR(150) NOT NULL,
  position VARCHAR(150) NOT NULL,
  photo_url VARCHAR(500) NULL,
  bio TEXT NULL,
  term_start YEAR NULL,
  term_end YEAR NULL,
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_org_members_division (division_id),
  KEY idx_org_members_active_order (is_active, display_order),
  CONSTRAINT fk_org_members_division
    FOREIGN KEY (division_id) REFERENCES organization_divisions (id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT chk_org_member_term
    CHECK (term_start IS NULL OR term_end IS NULL OR term_end >= term_start)
) ENGINE=InnoDB;

-- 7. Many-to-many relation between programs and news articles.
CREATE TABLE IF NOT EXISTS program_news (
  program_id BIGINT UNSIGNED NOT NULL,
  article_id BIGINT UNSIGNED NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (program_id, article_id),
  KEY idx_program_news_article (article_id),
  CONSTRAINT fk_program_news_program
    FOREIGN KEY (program_id) REFERENCES programs (id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_program_news_article
    FOREIGN KEY (article_id) REFERENCES news_articles (id)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

-- 8. Website settings, grouped by key.
CREATE TABLE IF NOT EXISTS website_settings (
  setting_key VARCHAR(100) NOT NULL,
  setting_value JSON NOT NULL,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (setting_key)
) ENGINE=InnoDB;

-- 9. Admin activity log
CREATE TABLE IF NOT EXISTS activity_logs (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  admin_id BIGINT UNSIGNED NULL,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100) NULL,
  entity_id BIGINT UNSIGNED NULL,
  metadata JSON NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_activity_logs_created (created_at),
  KEY idx_activity_logs_admin (admin_id),
  CONSTRAINT fk_activity_logs_admin
    FOREIGN KEY (admin_id) REFERENCES admins (id)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB;

-- Initial categories only; no fake organization/program/news records are inserted.
INSERT INTO news_categories (name, slug)
VALUES
  ('Kegiatan', 'kegiatan'),
  ('Prestasi', 'prestasi'),
  ('Pengumuman', 'pengumuman'),
  ('Akademik', 'akademik')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- No admin is seeded here. Create the first admin through a controlled setup script
-- or a one-time protected initialization flow; do not add a public registration page.
