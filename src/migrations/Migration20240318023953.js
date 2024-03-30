'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const { Migration } = require('@mikro-orm/migrations');

class Migration20240318023953 extends Migration {

  async up() {
    this.addSql('alter table "quizzes" alter column "is_active" type boolean using ("is_active"::boolean);');
    this.addSql('alter table "quizzes" alter column "is_active" set default false;');
  }

  async down() {
    this.addSql('alter table "quizzes" alter column "is_active" drop default;');
    this.addSql('alter table "quizzes" alter column "is_active" type boolean using ("is_active"::boolean);');
  }

}
exports.Migration20240318023953 = Migration20240318023953;
