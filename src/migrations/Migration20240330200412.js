'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const { Migration } = require('@mikro-orm/migrations');

class Migration20240330200412 extends Migration {

  async up() {
    this.addSql('alter table "quiz_submissions" add column "score" int not null;');
    this.addSql('alter table "quiz_submissions" drop column "total_correct";');
    this.addSql('alter table "quiz_submissions" drop column "total_questions";');
  }

  async down() {
    this.addSql('alter table "quiz_submissions" add column "total_questions" int not null;');
    this.addSql('alter table "quiz_submissions" rename column "score" to "total_correct";');
  }

}
exports.Migration20240330200412 = Migration20240330200412;
