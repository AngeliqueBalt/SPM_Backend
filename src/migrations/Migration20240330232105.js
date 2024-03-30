'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const { Migration } = require('@mikro-orm/migrations');

class Migration20240330232105 extends Migration {

  async up() {
    this.addSql('alter table "quiz_submissions" drop constraint "quiz_submissions_quiz_id_foreign";');
    this.addSql('alter table "quiz_submissions" drop constraint "quiz_submissions_student_id_foreign";');

    this.addSql('alter table "quiz_submissions" add constraint "quiz_submissions_quiz_id_foreign" foreign key ("quiz_id") references "quizzes" ("id") on delete cascade;');
    this.addSql('alter table "quiz_submissions" add constraint "quiz_submissions_student_id_foreign" foreign key ("student_id") references "users" ("id") on delete cascade;');
  }

  async down() {
    this.addSql('alter table "quiz_submissions" drop constraint "quiz_submissions_quiz_id_foreign";');
    this.addSql('alter table "quiz_submissions" drop constraint "quiz_submissions_student_id_foreign";');

    this.addSql('alter table "quiz_submissions" add constraint "quiz_submissions_quiz_id_foreign" foreign key ("quiz_id") references "quizzes" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "quiz_submissions" add constraint "quiz_submissions_student_id_foreign" foreign key ("student_id") references "users" ("id") on update cascade on delete cascade;');
  }

}
exports.Migration20240330232105 = Migration20240330232105;
