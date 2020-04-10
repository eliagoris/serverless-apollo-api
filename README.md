# serverless-magic-link

Serverless REST API to handle [Magic Link](https://magic.link/) user authentication and data persistion

Used stack: NodeJS, Typescript, Mongoose, [Serverless](https://serverless.com/)

## deploying

- get your Magic Link secret key

- get your MongoDB database endpoint

- install [Serverless](https://serverless.com/)

- fill `databaseEndpoint` and `magicLinkSecretKey` environment variables on the [dashboard](https://dashboard.serverless.com/)

- run `serverless deploy`

## usage

After using Magic Link to login on client-side, send the DID token to the API `/login` route. It will save the user into the database and generate an `access_token`

With the `access_token`, the logged in user can be retrieved through the `/user` route

Additional routes have to be made to handle CRUD operations on the user entity
