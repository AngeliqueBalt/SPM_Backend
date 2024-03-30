'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const { Migration } = require('@mikro-orm/migrations');

class Migration20240330195310 extends Migration {

  async up() {
    this.addSql('alter table "quiz_submissions" add column "total_questions" int not null;');
    this.addSql('alter table "quiz_submissions" rename column "score" to "total_correct";');
  }

  async down() {
    this.addSql('alter table "quiz_submissions" drop column "total_questions";');
    this.addSql('alter table "quiz_submissions" rename column "total_correct" to "score";');
  }

}
exports.Migration20240330195310 = Migration20240330195310;
