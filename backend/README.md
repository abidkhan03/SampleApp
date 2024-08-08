# YourFitnessPal App

## Run (Locally)

First, open the terminal/CMD in your system and then paste the following commands.

```bash
https://github.com/abidkhan03/YourFitnessPal.git
```

Navigate to the project directory and install the dependencies.

```bash
cd YourFitnessPal/backend/app
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

This project runs on port 3000 with localhost just copy the url and paste it on a browser.

[http://localhost:3000](http://localhost:3000)
