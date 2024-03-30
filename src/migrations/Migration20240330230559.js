'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const { Migration } = require('@mikro-orm/migrations');

class Migration20240330230559 extends Migration {

  async up() {
    this.addSql('alter table "quiz_submissions" drop constraint "quiz_submissions_pkey";');
    this.addSql('alter table "quiz_submissions" add constraint "quiz_submissions_pkey" primary key ("id", "quiz_id", "student_id");');
  }

  async down() {
    this.addSql('alter table "quiz_submissions" drop constraint "quiz_submissions_pkey";');
    this.addSql('alter table "quiz_submissions" add constraint "quiz_submissions_pkey" primary key ("id");');
  }

}
exports.Migration20240330230559 = Migration20240330230559;
