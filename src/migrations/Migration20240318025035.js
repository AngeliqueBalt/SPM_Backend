'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const { Migration } = require('@mikro-orm/migrations');

class Migration20240318025035 extends Migration {

  async up() {
    this.addSql('alter table "classes" add column "active_quiz_id" uuid null;');
    this.addSql('alter table "classes" add constraint "classes_active_quiz_id_foreign" foreign key ("active_quiz_id") references "quizzes" ("id") on update cascade on delete set null;');
    this.addSql('alter table "classes" add constraint "classes_active_quiz_id_unique" unique ("active_quiz_id");');
  }

  async down() {
    this.addSql('alter table "classes" drop constraint "classes_active_quiz_id_foreign";');

    this.addSql('alter table "classes" drop constraint "classes_active_quiz_id_unique";');
    this.addSql('alter table "classes" drop column "active_quiz_id";');
  }

}
exports.Migration20240318025035 = Migration20240318025035;
