# serverless-magic-link

Serverless REST API to handle [Magic Link](https://magic.link/) user authentication and data persistion

Used stack: NodeJS, Typescript, Mongoose, [Serverless](https://serverless.com/)

## deploying

- get your Magic Link secret key

- get your MongoDB database endpoint

- install [Serverless](https://serverless.com/)

- fill `databaseEndpoint` and `magicLinkSecretKey` environment variables on the [dashboard](https://dashboard.serverless.com/)

- run `serverless deploy`
