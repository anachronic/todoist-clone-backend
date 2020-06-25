# GraphQL typescript server boilerplate

This repository contains boilerplate for a typescript server that has:

- [Typescript](https://www.typescriptlang.org/)
- GraphQL through [Type-GraphQL](https://github.com/MichalLytek/type-graphql)
- ORM through [TypeORM](https://typeorm.io/)
- Server with [Express](https://expressjs.com/)
- [ESLint](https://eslint.org/) with [Prettier](https://prettier.io/)

And other few testing and development goodies

## Setup

We're gonna use yarn as our package manager but you can use npm if you want.
Default configuration variables will can be found in
[.default.env](./.default.env). It's not advised to modify this file as it's
just a reference. Instead, create a `.development.env` file in the root and
replace the values you need. The server will pick them up automagically. This
file is in `.gitignore` so it won't be pushed anywhere. If you need to
provide a production file, the server will also read from `.prod.env`, taking
precedence over anything. You can read about dotenv
[here](https://github.com/motdotla/dotenv).

Then, install and run the dev server:

```
$ yarn install
$ yarn start
```

## Building

You can build your app using the `build` script.

```
$ yarn build
```

This will **delete** your `build` folder and regenerate it. The result build
should be ready for production as is. Note that it will **not** pick up your
`.env` files. You shouldn't do that anyway. Just use docker or any kind of
decent service that can inject env variables for you in production.

There's a script that runs your server, it's called `start:production`

```
$ yarn build
$ yarn start:production # This one does not pick up env variables
```

## Testing

To be documented

## Debugging

The development app runs with `--inspect` enabled so that anyone can debug it. At the time, I've only tried vscode for this. I decided against committing the file because not everyone may use it.

For VSCode, here's a snippet for `.vscode/launch.json`.

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "attach",
      "name": "debug",
      "processId": "${command:PickProcess}",
      "restart": true,
      "protocol": "inspector"
    }
  ]
}
```

That should allow you to get a debugger instantly.
