#!bash/sh
cd client && npm i && cd ../server && npm i && rm -rf build && npm run build && cd ../client && rm -rf build && npm run build && mkdir ../server/build/src/build && cp -r build/* ../server/build/src/build/ && cd ..
