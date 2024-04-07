'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const { Migration } = require('@mikro-orm/migrations');

class Migration20240406135009 extends Migration {

  async up() {
    this.addSql('alter table "classes" drop constraint "classes_teacher_id_foreign";');

    this.addSql('alter table "classes" alter column "teacher_id" drop default;');
    this.addSql('alter table "classes" alter column "teacher_id" type uuid using ("teacher_id"::text::uuid);');
    this.addSql('alter table "classes" alter column "teacher_id" drop not null;');
    this.addSql('alter table "classes" add constraint "classes_teacher_id_foreign" foreign key ("teacher_id") references "users" ("id") on update cascade on delete cascade;');
  }

  async down() {
    this.addSql('alter table "classes" drop constraint "classes_teacher_id_foreign";');

    this.addSql('alter table "classes" alter column "teacher_id" drop default;');
    this.addSql('alter table "classes" alter column "teacher_id" type uuid using ("teacher_id"::text::uuid);');
    this.addSql('alter table "classes" alter column "teacher_id" set not null;');
    this.addSql('alter table "classes" add constraint "classes_teacher_id_foreign" foreign key ("teacher_id") references "users" ("id") on update cascade;');
  }

}
exports.Migration20240406135009 = Migration20240406135009;
