'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const { Migration } = require('@mikro-orm/migrations');

class Migration20240316182427 extends Migration {

  async up() {
    this.addSql('alter table "quizzes" drop constraint "quizzes_class_id_foreign";');

    this.addSql('alter table "questions" drop constraint "questions_quiz_id_foreign";');

    this.addSql('alter table "answers" drop constraint "answers_question_id_foreign";');

    this.addSql('alter table "quizzes" alter column "class_id" drop default;');
    this.addSql('alter table "quizzes" alter column "class_id" type uuid using ("class_id"::text::uuid);');
    this.addSql('alter table "quizzes" alter column "class_id" drop not null;');
    this.addSql('alter table "quizzes" add constraint "quizzes_class_id_foreign" foreign key ("class_id") references "classes" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "questions" alter column "quiz_id" drop default;');
    this.addSql('alter table "questions" alter column "quiz_id" type uuid using ("quiz_id"::text::uuid);');
    this.addSql('alter table "questions" alter column "quiz_id" drop not null;');
    this.addSql('alter table "questions" add constraint "questions_quiz_id_foreign" foreign key ("quiz_id") references "quizzes" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "answers" alter column "question_id" drop default;');
    this.addSql('alter table "answers" alter column "question_id" type uuid using ("question_id"::text::uuid);');
    this.addSql('alter table "answers" alter column "question_id" drop not null;');
    this.addSql('alter table "answers" add constraint "answers_question_id_foreign" foreign key ("question_id") references "questions" ("id") on update cascade on delete cascade;');
  }

  async down() {
    this.addSql('alter table "quizzes" drop constraint "quizzes_class_id_foreign";');

    this.addSql('alter table "questions" drop constraint "questions_quiz_id_foreign";');

    this.addSql('alter table "answers" drop constraint "answers_question_id_foreign";');

    this.addSql('alter table "quizzes" alter column "class_id" drop default;');
    this.addSql('alter table "quizzes" alter column "class_id" type uuid using ("class_id"::text::uuid);');
    this.addSql('alter table "quizzes" alter column "class_id" set not null;');
    this.addSql('alter table "quizzes" add constraint "quizzes_class_id_foreign" foreign key ("class_id") references "classes" ("id") on update cascade;');

    this.addSql('alter table "questions" alter column "quiz_id" drop default;');
    this.addSql('alter table "questions" alter column "quiz_id" type uuid using ("quiz_id"::text::uuid);');
    this.addSql('alter table "questions" alter column "quiz_id" set not null;');
    this.addSql('alter table "questions" add constraint "questions_quiz_id_foreign" foreign key ("quiz_id") references "quizzes" ("id") on update cascade;');

    this.addSql('alter table "answers" alter column "question_id" drop default;');
    this.addSql('alter table "answers" alter column "question_id" type uuid using ("question_id"::text::uuid);');
    this.addSql('alter table "answers" alter column "question_id" set not null;');
    this.addSql('alter table "answers" add constraint "answers_question_id_foreign" foreign key ("question_id") references "questions" ("id") on update cascade;');
  }

}
exports.Migration20240316182427 = Migration20240316182427;
