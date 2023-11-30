# student-progress-monitor
Welcome to student-progress-monitor, by angelique!

Powered by [Apollo Software Limited](https://apollosoftware.xyz)'s Cinnamon
framework.

## Getting Started

- Refer to the Cinnamon [documentation](https://docs.apollosoftware.xyz/cinnamon)
for more information on how to use Cinnamon.

Get started with your project by running the following commands:

```bash
$ yarn
$ yarn start
```

Lint your code with:

```bash
$ yarn lint
$ yarn lint:fix # fix linting errors
```

## Database Support

You've enabled database support! You can create a database schema and apply it
to the database defined in [`cinnamon.toml`](./cinnamon.toml) with:

```bash
$ yarn db:create
```

As you change your database models and schema, you can generate migrations with:

```bash
$ yarn db:migrate:create
```

You, and others, can then apply the migrations to update the database with:

```bash
$ yarn db:migrate
```
