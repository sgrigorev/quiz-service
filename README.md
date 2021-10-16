# quiz-service

Pet project with the main goal to try nestjs and prisma ORM. This app allows creating questionnaires, fill and check them.

## Start

### Setup environment

1. Install docker https://docs.docker.com/desktop/windows/install/
2. Start docker
3. Start db `$ docker-compose up -d postgres`
4. Create db `$ npm run createDb`
5. Copy .env.example to .env and correct variables there if it is needed
6. Create db schema `$ npm run migrate:dev`

### Start app
You can start the app in the docker container
`$ docker-compose up -d app`
Or you can start it directly
`$ npm run start`

### PgAdmin

You may also start pgadmin to check data in the database `$ docker-compose up -d pgadmin`. Its ui is available on `localhost:8080`. Default email is `admin@pgadmin.com` and password is `admin`.