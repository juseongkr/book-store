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

----

### Todo List
- [x] ~~Update pagination feature~~
- [ ] Create search filter
- [ ] Create genre list page
