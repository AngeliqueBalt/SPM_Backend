'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const { Migration } = require('@mikro-orm/migrations');

class Migration20240330231655 extends Migration {

  async up() {
    this.addSql('alter table "quiz_submissions" add column "submitted" timestamptz(0) not null;');
    this.addSql('alter table "quiz_submissions" drop constraint "quiz_submissions_pkey";');
    this.addSql('alter table "quiz_submissions" drop column "id";');
    this.addSql('alter table "quiz_submissions" drop column "created_at";');
    this.addSql('alter table "quiz_submissions" drop column "updated_at";');
    this.addSql('alter table "quiz_submissions" add constraint "quiz_submissions_pkey" primary key ("quiz_id", "student_id");');
  }

  async down() {
    this.addSql('alter table "quiz_submissions" add column "id" uuid not null default gen_random_uuid(), add column "updated_at" timestamptz(0) not null;');
    this.addSql('alter table "quiz_submissions" drop constraint "quiz_submissions_pkey";');
    this.addSql('alter table "quiz_submissions" rename column "submitted" to "created_at";');
    this.addSql('alter table "quiz_submissions" add constraint "quiz_submissions_pkey" primary key ("id", "quiz_id", "student_id");');
  }

}
exports.Migration20240330231655 = Migration20240330231655;
