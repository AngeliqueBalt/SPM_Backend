'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const { Migration } = require('@mikro-orm/migrations');

class Migration20240318012425 extends Migration {

  async up() {
    this.addSql('create table "quiz_submissions" ("id" uuid not null default gen_random_uuid(), "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "quiz_id" uuid null, "student_id" uuid null, "total_correct" int not null, "total_questions" int not null, constraint "quiz_submissions_pkey" primary key ("id"));');

    this.addSql('alter table "quiz_submissions" add constraint "quiz_submissions_quiz_id_foreign" foreign key ("quiz_id") references "quizzes" ("id") on delete cascade;');
    this.addSql('alter table "quiz_submissions" add constraint "quiz_submissions_student_id_foreign" foreign key ("student_id") references "users" ("id") on delete cascade;');

    this.addSql('alter table "quizzes" add column "is_active" boolean null;');
  }

  async down() {
    this.addSql('drop table if exists "quiz_submissions" cascade;');

    this.addSql('alter table "quizzes" drop column "is_active";');
  }

}
exports.Migration20240318012425 = Migration20240318012425;
