# Book store
> Simple full-stack project using typescript

<img width="800" alt="img2" src="https://user-images.githubusercontent.com/10775915/90505751-1d377200-e18e-11ea-816e-735589849995.png"></img>
<img width="800" alt="img" src="https://user-images.githubusercontent.com/10775915/89705010-6c162800-d994-11ea-977d-482480f3529e.png"></img>

## Demo page
http://book.juseong.me

## Contents
- [Architecture](#architecture)
  - [Frontend](#frontend)
  - [Backend](#backend)
- [Getting stared](#getting-started)
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
│   ├── models
│   ├── routes
│   └── utils
├── tests
├── jest.config.js
├── package.json
└── tsconfig.json
```

## <a id="getting-started" style="color: black;">Getting stared</a>
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

### <a id="test-backend" style="color: black;">Test Backend</a>
Backend server test uses a jest to check the backend server API.
```shellscript
npm run test
```

## <a id="run" style="color: black;">Run</a>
```shellscript
bash ./run.sh
```

----

### Todo List
- [ ] Create user info page
- [ ] Update list page
- [ ] Server Side Rendering
