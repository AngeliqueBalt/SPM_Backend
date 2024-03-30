'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const { Migration } = require('@mikro-orm/migrations');

class Migration20240318024424 extends Migration {

  async up() {
    this.addSql('alter table "quizzes" drop column "is_active";');
  }

  async down() {
    this.addSql('alter table "quizzes" add column "is_active" boolean not null default false;');
  }

}
exports.Migration20240318024424 = Migration20240318024424;
