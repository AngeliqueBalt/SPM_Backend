'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const { Migration } = require('@mikro-orm/migrations');

class Migration20231123015235 extends Migration {

  async up() {
    this.addSql('create table "users" ("id" uuid not null default gen_random_uuid(), "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "email" varchar(255) not null, "username" varchar(255) not null, "display_name" text null, "avatar" text null, "password" varchar(256) not null, "is_admin" boolean not null, constraint "users_pkey" primary key ("id"));');
    this.addSql('alter table "users" add constraint "users_email_unique" unique ("email");');
    this.addSql('alter table "users" add constraint "users_username_unique" unique ("username");');

    this.addSql('create table "sessions" ("id" uuid not null default gen_random_uuid(), "request_token" varchar(684) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "user_id" uuid not null, "device_user_agent" text null, "ip_address" varchar(36) null, constraint "sessions_pkey" primary key ("id", "request_token"));');
    this.addSql('alter table "sessions" add constraint "sessions_request_token_unique" unique ("request_token");');
    this.addSql('alter table "sessions" add constraint "sessions_user_id_unique" unique ("user_id");');

    this.addSql('create table "assets" ("id" uuid not null default gen_random_uuid(), "type" text check ("type" in (\'profileImage\')) not null, "name" text null, "mime_type" text not null, "payload" bytea not null, "created_at" timestamptz(0) not null, "metadata" jsonb null, "owner_id" uuid not null, constraint "assets_pkey" primary key ("id"));');

    this.addSql('alter table "sessions" add constraint "sessions_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "assets" add constraint "assets_owner_id_foreign" foreign key ("owner_id") references "users" ("id") on update cascade on delete cascade;');
  }

  async down() {
    this.addSql('alter table "sessions" drop constraint "sessions_user_id_foreign";');

    this.addSql('alter table "assets" drop constraint "assets_owner_id_foreign";');

    this.addSql('drop table if exists "users" cascade;');

    this.addSql('drop table if exists "sessions" cascade;');

    this.addSql('drop table if exists "assets" cascade;');
  }

}
exports.Migration20231123015235 = Migration20231123015235;
