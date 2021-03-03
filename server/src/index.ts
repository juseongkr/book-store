import app from "./app";
import http from "http";
import logger from "./utils/logger";
import { PORT } from "./utils/config";

const server: http.Server = http.createServer(app);

server.listen(PORT, (): void => {
  logger.info(`Server running on port: ${PORT}`);
});
