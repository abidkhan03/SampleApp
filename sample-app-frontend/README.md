# YourFitnessPal App

## Run (Locally)

### 1. Backend

Navigate to the project directory and install the dependencies.

```bash
cd sampleApp/backend
cp .env.example .env
npm install
```

If you want to run the app locally, you need to have a Mysql instance running in your system.

Create a user in mysql and grant privileges and then create database as well.

Note: username and password should be same as in .env file.

```bash
mysql -u root -p

mysql> CREATE USER 'myfitness'@'localhost' IDENTIFIED BY 'myFitness@12';
mysql> GRANT ALL PRIVILEGES ON *.* TO 'myfitness'@'localhost' WITH GRANT OPTION;
mysql> ALTER USER 'myfitness'@'localhost' IDENTIFIED WITH mysql_native_password BY 'myFitness@12';
mysql> CREATE DATABASE sampel_app;
mysql> exit
```

## DB Migrations

Write the command to run the migrations.

```bash
npm run migration:run
```

For dropping Schema

```bash
npm run db:drop
```

TO run the app just type this command

```bash
npm run start:dev
```

You can test backend directly in Postman or Thunder Client like.
`http://localhost:30001/api/categories/create`

```bash
{
    "name": "accessories"
}
```

The backend of this project runs on port 3001 with localhost.

[http://localhost:3001](http://localhost:3001)

## 2. Frontend

```bash
cd sample-app-frontend/
npm install
```

To run the frontend just type the ```bash npm start``` that will navigate url [http://localhost:3000](http://localhost:3000), directly open in a default browser. 

Here's a shot demo of this project.

`https://www.loom.com/share/998af0f7bba548d4957ec41a8caf57bb?sid=b0db8c2b-0018-4159-a3c1-7e1c9196c0d8`