'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const { Migration } = require('@mikro-orm/migrations');

class Migration20240205184613 extends Migration {

  async up() {
    this.addSql('create table "classes" ("id" uuid not null default gen_random_uuid(), "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" text not null, "teacher_id" uuid not null, constraint "classes_pkey" primary key ("id"));');

    this.addSql('create table "classes_students" ("class_id" uuid not null, "user_id" uuid not null, constraint "classes_students_pkey" primary key ("class_id", "user_id"));');

    this.addSql('alter table "classes" add constraint "classes_teacher_id_foreign" foreign key ("teacher_id") references "users" ("id") on update cascade;');

    this.addSql('alter table "classes_students" add constraint "classes_students_class_id_foreign" foreign key ("class_id") references "classes" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "classes_students" add constraint "classes_students_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade on delete cascade;');
  }

  async down() {
    this.addSql('alter table "classes_students" drop constraint "classes_students_class_id_foreign";');

    this.addSql('drop table if exists "classes" cascade;');

    this.addSql('drop table if exists "classes_students" cascade;');
  }

}
exports.Migration20240205184613 = Migration20240205184613;
