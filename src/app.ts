import http from "http";
import { sessionMemoryDb as onlineUsers } from "./data/SessionMemoryDb";

import Express from "express";
import { startConnection } from "./typeorm";
import { userRepository } from "./repository/UserRepository";
import { initOnlineUsers } from "./service/OnlineUserService";

import { APP_PORT } from "./setting";
import { logger } from "./logger";
import { connectSocket } from "./socket";

const app = Express();
const server = http.createServer(app);

app.use(Express.static("public"));

connectSocket(server);

startConnection()
  .then(async () => {
    logger.info("Database connected");

    const allUsers = await userRepository.findAll();
    initOnlineUsers(allUsers, onlineUsers);

    return null;
  })
  .catch((error: any) => {
    logger.error("Error on start connection", error);
  });

server.listen(APP_PORT, "0.0.0.0", () => {
  logger.info(`Server Listening on -> ${APP_PORT}`);
});
