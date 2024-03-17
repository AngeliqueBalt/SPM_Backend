'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const { Migration } = require('@mikro-orm/migrations');

class Migration20240310001442 extends Migration {

  async up() {
    this.addSql('alter table "answers" drop constraint "answers_question_id_foreign";');

    this.addSql('drop table if exists "questions" cascade;');

    this.addSql('drop table if exists "answers" cascade;');

    this.addSql('alter table "quizzes" add column "questions" jsonb not null;');
  }

  async down() {
    this.addSql('create table "questions" ("id" uuid not null default gen_random_uuid(), "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "quiz_id" uuid not null, "question" text not null, constraint "questions_pkey" primary key ("id"));');

    this.addSql('create table "answers" ("id" uuid not null default gen_random_uuid(), "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "question_id" uuid not null, "answer" text not null, "is_correct" boolean not null, constraint "answers_pkey" primary key ("id"));');

    this.addSql('alter table "questions" add constraint "questions_quiz_id_foreign" foreign key ("quiz_id") references "quizzes" ("id") on update cascade;');

    this.addSql('alter table "answers" add constraint "answers_question_id_foreign" foreign key ("question_id") references "questions" ("id") on update cascade;');

    this.addSql('alter table "quizzes" drop column "questions";');
  }

}
exports.Migration20240310001442 = Migration20240310001442;
