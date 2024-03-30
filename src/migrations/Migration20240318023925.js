'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const { Migration } = require('@mikro-orm/migrations');

class Migration20240318023925 extends Migration {

  async up() {
    this.addSql('alter table "quizzes" alter column "is_active" type boolean using ("is_active"::boolean);');
    this.addSql('alter table "quizzes" alter column "is_active" set not null;');
  }

  async down() {
    this.addSql('alter table "quizzes" alter column "is_active" type boolean using ("is_active"::boolean);');
    this.addSql('alter table "quizzes" alter column "is_active" drop not null;');
  }

}
exports.Migration20240318023925 = Migration20240318023925;
