# Book store 📚
Welcome to books store. 👋

<img width="1000" alt="login" src="https://user-images.githubusercontent.com/10775915/90505751-1d377200-e18e-11ea-816e-735589849995.png"></img>
<img width="1000" alt="main" src="https://user-images.githubusercontent.com/10775915/110192662-ba2fd300-7e72-11eb-94ae-bc8df4beb0f7.png"></img>

## Demo page 👾
https://book.juseong.me

## Stacks 🏭
<img width="300" alt="mern" src="https://user-images.githubusercontent.com/10775915/110192567-31189c00-7e72-11eb-8066-661332938132.jpg"></img>
* [React.js](https://reactjs.org)
* [Express.js](https://expressjs.com)
* [MongoDB](https://mongodb.com)
* [TypeScript](https://www.typescriptlang.org)

## Contents 📦
- [Architecture](#architecture)
  - [Frontend](#frontend)
  - [Backend](#backend)
- [Getting started](#getting-started)
- [Build](#build)
- [Test](#test)
  - [Frontend](#test-frontend)
  - [Backend](#test-backend)
- [Run](#run)
- [API Examples](#api-examples)

## <a id="architecture" style="color: black;">Architecture</a>

### <a id="frontend" style="color: black;">Frontend</a>
This is the directory structure for ```frontend```, it is created by ```create-react-app``` with ```--template typescript``` flag, which helps us to create react project.
```
client
├── build
├── public
├── src
│   ├── constants.ts
│   ├── index.tsx
│   ├── types.ts
│   └── state
├── package.json
└── tsconfig.json
```

### <a id="backend" style="color: black;">Backend</a>
```backend``` directory structure is as follows, and the necessary information is contained in each folder.
```
server
├── build
├── logs
├── src
│   ├── app.ts
│   ├── index.ts
│   ├── types.ts
│   ├── controllers
│   ├── models
│   ├── services
│   └── utils
├── tests
├── jest.config.js
├── package.json
└── tsconfig.json
```

## <a id="getting-started" style="color: black;">Getting started</a>
Before getting started, you need ```.env``` file at ```server/build/src/``` following the ```.env.template``` file located in ```server``` directory.

## <a id="build" style="color: black;">Build</a>
```shellscript
bash ./build.sh
```
After build project, you have to place ```.env``` file in right position.
Feel free to open a new issue if you're having any problems.

## <a id="test" style="color: black;">Test</a>

### <a id="test-frontend" style="color: black;">Test Frontend</a>
Frontend test uses a cypress to check the front page action. You need a local server is required to proceed with the test. Therefore, the local server should be run before run the test.
```shellscript
npm run cypress:run
```
```shellscript
npm run cypress:open
```

### <a id="test-backend" style="color: black;">Test Backend</a>
Backend server test uses a jest to check the backend server API.
```shellscript
npm run test
```

## <a id="run" style="color: black;">Run</a>
```shellscript
bash ./run.sh
```
```shellscript
npm run start:prod
```

# <a id="api-examples">API Examples</a>

## <a id="register">Register</a>
POST: ```/api/auth/register```

### Request
|body|value|
|:---:|:---:|
|username|string|
|password|string|
|name|string <em>(optional)</em>|

```bash
$ curl -X POST \
-H "Content-Type: application/json" \
-d '{"username": "admin@email.com", "password": "abcd1234!", "name": "admin"}' \
localhost:3001/api/auth/register
```

### Response
```javascript
{
  "username": "admin@email.com",
  "name": "admin"
}
```

## <a id="login">Login</a>
POST: ```/api/auth/login```

### Request
|body|value|
|:---:|:---:|
|username|string|
|password|string|

```bash
$ curl -X POST \
-H "Content-Type: application/json" \
-d '{"username": "admin@email.com", "password": "abcd1234!"}' \
localhost:3001/api/auth/login
```

### Response
```javascript
{
  "username": "admin@email.com",
  "id": "60431988ec1e7917e1346b9e",
  "name": "admin"
}
```

## <a id="logout">Logout</a>
POST: ```/api/auth/logout```

### Request
```bash
$ curl -X POST localhost:3001/api/auth/logout
```

## <a id="book-all">Get all books(fragmented by page)</a>
GET: ```/api/books```

### Request
|parameter|value|
|:---:|:---:|
|page|number <em>(optional, default is 1)</em>|
|search|string <em>(optional)</em>|
```bash
$ curl -X GET localhost:3001/api/books?page=3
```
```bash
$ curl -X GET localhost:3001/api/books?page=3&search=dynamic
```
```bash
$ curl -X GET localhost:3001/api/books?search=dynamic
```

### Response
```javascript
{
    "pagination": {
        "total": 1054,
        "count": 20,
        "limit": 20,
        "page": 1
    },
    "data": [
        {
            "genres": [
                "programming",
                "golang"
            ],
            "isbn": "1107078325",
            "title": "Mastering Go lang",
            "published": "2021-03-06",
            "author": "Mr. Go",
            "rating": 5,
            "description": "let's master go programming language",
            "uploader": "60391789a670bc08699bbd8a",
            "createdAt": "2021-03-06T02:27:45.518Z",
            "updatedAt": "2021-03-06T02:27:45.518Z",
            "id": "6042e8a1a9fa7917150e6e2d"
        },
        {
            "genres": [
                "future"
            ],
            "isbn": "9630536112",
            "title": "The World of Robot",
            "published": "2045-10-19",
            "author": "T-1000",
            "rating": 5,
            "description": "Roooobot...",
            "uploader": "5f41396b55397c06fc838910",
            "createdAt": "2020-08-22T15:28:33.056Z",
            "updatedAt": "2020-08-22T15:28:59.678Z",
            "id": "5f4139a055397c06fc838911"
        },
        ...
    ]
}
```

## <a id="book-get">Get book by ISBN</a>
GET: ```/api/books/${isbn}```

### Request
```bash
$ curl -X GET localhost:3001/api/books/1107078325
```

### Response
```javascript
{
    "genres": [
        "programming",
        "golang"
    ],
    "isbn": "1107078325",
    "title": "Mastering Go lang",
    "published": "2021-03-06",
    "author": "Mr. Go",
    "rating": 5,
    "description": "let's master go programming language",
    "uploader": "60391789a670bc08699bbd8a",
    "createdAt": "2021-03-06T02:27:45.518Z",
    "updatedAt": "2021-03-06T02:27:45.518Z",
    "id": "6042e8a1a9fa7917150e6e2d"
}
```

## <a id="book-create">Create a new book</a>
> <h3>This server authenticates based on session cookie. Therefore, you must have your session cookie.</h3>
POST: ```/api/books```

### Request
|body|value|
|:---:|:---:|
|isbn|string|
|title|string|
|published|datetime|
|author|string|
|rating|number (0 to 5)|
|description|string|
``` bash
$ curl -X POST \
-H "Content-Type: application/json" \
-d '{"genres": ["programming", "golang"], "isbn": "155228325", "title": "Mastering Go lang", "published": "2021-03-06", "author": "Mr. Go", "rating": 5, "description": "lets master go programming language"}' \
localhost:3001/api/books 
```

### Response
```javascript
{
    "genres": [
        "programming",
        "golang"
    ],
    "isbn": "155228325",
    "title": "Mastering Go lang",
    "published": "2021-03-06",
    "author": "Mr. Go",
    "rating": 5,
    "description": "let's master go programming language",
    "uploader": "6043204cec1e7917e1346b9f",
    "createdAt": "2021-03-06T06:26:16.853Z",
    "updatedAt": "2021-03-06T06:26:16.853Z",
    "id": "60432088ec1e7917e1346ba0"
}
```

## <a id="book-update">Update the book</a>
> <h3>Only the user who created the book can update it.</h3>
PUT: ```/api/books/${isbn}```

### Request
|body|value|
|:---:|:---:|
|isbn|string <em>(optional)</em>|
|title|string <em>(optional)</em>|
|published|datetime <em>(optional)</em>|
|author|string <em>(optional)</em>|
|rating|number (0 to 5) <em>(optional)</em>|
|description|string <em>(optional)</em>|
```bash
$ curl -X PUT \
-H "Content-Type: application/json" \
-d '{"genres": ["programming", "golang"], "isbn": "155228325", "title": "Mastering Go lang", "published": "2021-03-06", "author": "Mr. Go", "rating": 5, "description": "lets master go programming language!!"}' \
localhost:3001/api/books/155228325
```

## <a id="book-delete">Delete the book</a>
> <h3>Only the user who created the book can delete it.</h3>
DELETE: ```/api/books/${isbn}```

### Request
```bash
$ curl -X DELETE \
-H "Content-Type: application/json" \
localhost:3001/api/books/1552283235
```


### Todo List
- [x] ~~Update pagination feature~~
- [ ] Create search filter
- [ ] Create genre list page
