# Book store
> Simple full-stack project using typescript

<img width="800" alt="img" src="https://user-images.githubusercontent.com/10775915/89705010-6c162800-d994-11ea-977d-482480f3529e.png"></img>

## Demo page
https://book-store-ts.herokuapp.com/

## Contents
- [Architecture](#architecture)
  - [Frontend](#frontend)
  - [Backend](#backend)
- [Getting stared](#getting-started)
- [Build](#build)
- [Test](#test)
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
├── src
│   ├── app.ts
│   ├── index.ts
│   ├── types.ts
│   ├── models
│   ├── routes
│   └── utils
├── tests
├── jest.config.js
├── package.json
└── tsconfig.json
```

## Getting started
Before getting started, you need ```.env``` file at ```server/build/src/``` following the ```.env.template``` file located in ```server``` directory.

## Build
```shellscript
bash ./build.sh
```
After build project, you have to place ```.env``` file in right position.
Feel free to open a new issue if you're having any problems.

## Test
This test code uses a jest to check the backend server API.
```shellscript
npm run test
```

## Run
```shellscript
bash ./run.sh
```

----

### Todo List
- [ ] Craete user sign up page
- [ ] Create user info page
- [ ] Update error message
- [ ] Create End-to-End test
- [ ] Server Side Rendering
