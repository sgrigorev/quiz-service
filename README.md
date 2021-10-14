# quiz-service

Pet project with the main goal to try nestjs and prisma ORM. This app allows creating questionnaires, fill and check them.

## Start

1. Install docker https://docs.docker.com/desktop/windows/install/
2. Start docker
3. Start db `$ docker-compose up -d postgres`
4. Start app `$ docker-compose up -d app` or `$ npm start`

You may also start pgadmin to check data in the database `$ docker-compose up -d pgadmin`. Its ui is available on `localhost:8080`. Default email is `admin@pgadmin.com` and password is `admin`.