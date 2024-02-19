'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const { Migration } = require('@mikro-orm/migrations');

class Migration20240205212416 extends Migration {

  async up() {
    this.addSql('create table "quizzes" ("id" uuid not null default gen_random_uuid(), "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "class_id" uuid not null, "name" text not null, constraint "quizzes_pkey" primary key ("id"));');

    this.addSql('create table "questions" ("id" uuid not null default gen_random_uuid(), "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "quiz_id" uuid not null, "question" text not null, constraint "questions_pkey" primary key ("id"));');

    this.addSql('create table "answers" ("id" uuid not null default gen_random_uuid(), "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "question_id" uuid not null, "answer" text not null, "is_correct" boolean not null, constraint "answers_pkey" primary key ("id"));');

    this.addSql('alter table "quizzes" add constraint "quizzes_class_id_foreign" foreign key ("class_id") references "classes" ("id") on update cascade;');

    this.addSql('alter table "questions" add constraint "questions_quiz_id_foreign" foreign key ("quiz_id") references "quizzes" ("id") on update cascade;');

    this.addSql('alter table "answers" add constraint "answers_question_id_foreign" foreign key ("question_id") references "questions" ("id") on update cascade;');
  }

  async down() {
    this.addSql('alter table "questions" drop constraint "questions_quiz_id_foreign";');

    this.addSql('alter table "answers" drop constraint "answers_question_id_foreign";');

    this.addSql('drop table if exists "quizzes" cascade;');

    this.addSql('drop table if exists "questions" cascade;');

    this.addSql('drop table if exists "answers" cascade;');
  }

}
exports.Migration20240205212416 = Migration20240205212416;
