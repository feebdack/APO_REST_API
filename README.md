# APO_Rest_API

[![Build status](https://ci.appveyor.com/api/projects/status/r8j0fxr738ix223s?svg=true)](https://ci.appveyor.com/project/jgonzalezcastello/apo-rest-api)

This is the APO pill identification REST API server implementation. This server handles HTTP REST requests from mobile applications requesting information about pills.
## Getting APO REST API Running
The following instructions will get you a copy of this code up and running on your local machine.
### Prerequisites
The following software should already be installed on your system before moving forward.

[Node.JS](https://nodejs.org)

[NPM](https://www.npmjs.com/get-npm)

[MongoDB](https://docs.mongodb.com/manual/installation/)

### Installation
After downloading the code, or cloning the repository, make sure you are in your terminal and in the root directory of the repository.
Install NPM Packages
```
npm install
```
### Importing data to database
Once installation is complete, the database needs to be populated with data.
```
npm run import_dev
```
This command will take the data supplied as a tsv file in the 'data' directory, and import it into the local mongodb database.
### Starting the server
To start the server, simply run the development script
```
npm run dev
```
### Test server
To begin testing the server code, run the test script
```
npm test
```
## Built with
The following frameworks were used in the development of this server.

[Express.js](https://expressjs.com/) - used for http routing and controlling

[mongoose.js](http://mongoosejs.com/) - used for connections to mongodb

[mocha.js](https://mochajs.org/) - used as the testing framework
## Authors
This program was developed by [Jesus Sergio Gonzalez](https://github.com/jgonzalezcastello/) 2017
## Acknowledgements
Set up of this RESTful server was largely guided through [Olatunde Garuba's article on codementor.io](https://www.codementor.io/olatundegaruba/nodejs-restful-apis-in-10-minutes-q0sgsfhbd), and the vast resources publicly available on sites such as stackoverflow.com and restcookbook.com.
Testing information also largely guided by [this article](https://www.codementor.io/olatundegaruba/integration-testing-supertest-mocha-chai-6zbh6sefz).