'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const { Migration } = require('@mikro-orm/migrations');

class Migration20231123020856 extends Migration {

  async up() {
    this.addSql('alter table "users" add column "is_teacher" boolean not null;');
  }

  async down() {
    this.addSql('alter table "users" drop column "is_teacher";');
  }

}
exports.Migration20231123020856 = Migration20231123020856;
