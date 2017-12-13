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
## Using APO_API V1

This api takes requests on two endpoints.

#### `/pill/`

Which is used to look for pills in the database. To access this endpoint either a pillID must be used in the endpoint to return information for a specific pill, or query parameters need to be passed into the endpoint. Below are examples on how to use each.

`#GET /pill/{pillID}`
where pillID is a known pillID identifier for a pill

`#GET /pill/search?color={color}&shape={shape}`
To get a full list of possible query parameters see th apoModel.js file within the api>models directory.

##### Saving pill requests for a user
To save an api request as a previous search in the database, the request header should contain a `userid` field with the userID as the value for the field. This will save any pillID queries to the list of recent searches for the user

#### `/user/`
Which is used to register new users, or retrieve a list of recent pill searches for a user.
User registration simply works by adding a user with a userID to the server.
JSON Body should contain 
`{userID: [string]}` for either GET or POST requests.

`#GET /user/`
Which should contain a json object containing userID with a string value which is the userID.
This will return a JSON array of pillIDs corresponding to the recent searches for the user.

`#POST /user/`
Which should contain a single json variable userID with a string which is the userID for the new user. Trying to add a user that exists will result in a 409 status code and a conflict error message in the body.

## Using APO_API V2
Version 2 of the apo API introduces pages to query searches. Results from searching the /pill endpoint will now be returned in chunks of 10
### Requests
Request for API 2 are similar to API 1. The only difference is in requesting for pages beyond the first, which requires the "page" query as shown below.

Requesting for first 10 results
```
http://HOST/api/2/pill/search?<<Search Query>>
```
or
```
http://HOST/api/2/pill/search?<<Search Query>>&page=1
```

Subsequent pages need to have the page value for the page that is being requested. For example, searching for page 2 would require the following request.
```
http://HOST/api/2/pill/search?<<Search Query>>&page=2
```
### Responses
The following elements describe the structure of the response JSON in API 2.
#### search
Contains the query items used for the search results from this response.
#### page
contains the page for the results included in this response.
#### results
contains the array of data for the current page of the search terms for this request. This array is the array that is returned by API 1.

```
{
    "search:": {
        "medicine_name": "Advil",
        "color": "blue"
    },
    "page": "1",
    "results": [<<Results for page 1. This is the array returned by API 1>> ] 
}
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