import { test, describe, expect } from "vitest";
import {
  disconnectUser,
  initOnlineUsers,
} from "../../src/service/OnlineUserService";
import { SessionMemoryDb } from "../../src/data/SessionMemoryDb";
import { UserEntity } from "../../src/entity/UserEntity";

const USER_1_ID = 1;

const SESSION_MEMORY_DB_1 = {
  id: USER_1_ID,
  name: "user1",
  online: false,
  lastLogin: null,
  socketId: "",
};

const DB_USER_1 = {
  id: USER_1_ID,
  name: "user1",
};

const USER_2_ID = 2;

const SESSION_MEMORY_DB_2 = {
  id: USER_2_ID,
  name: "user1",
  online: false,
  lastLogin: null,
  socketId: "",
};

const DB_USER_2 = {
  id: USER_2_ID,
  name: "user1",
};

describe("Test initOnlineUsers", () => {
  test("when current users in DB is empty, then SessionMemoryDB is empty", async () => {
    const sessionMemoryDB = new SessionMemoryDb();
    const expectedSessionMemoryDB = new SessionMemoryDb();
    const currentUsersInDB: UserEntity[] = [];

    initOnlineUsers(currentUsersInDB, sessionMemoryDB);

    expect(expectedSessionMemoryDB).toEqual(sessionMemoryDB);
  });

  test("when have 1 user in DB, then SessionMemoryDB have 1 session", async () => {
    const sessionMemoryDB = new SessionMemoryDb();
    const expectedSessionMemoryDB = new SessionMemoryDb();

    const currentUsersInDB: UserEntity[] = [DB_USER_1];
    expectedSessionMemoryDB.set(1, SESSION_MEMORY_DB_1);

    initOnlineUsers(currentUsersInDB, sessionMemoryDB);

    expect(expectedSessionMemoryDB).toEqual(sessionMemoryDB);
  });

  test("when have 2 user in DB, then SessionMemoryDB have 2 session", async () => {
    const sessionMemoryDB = new SessionMemoryDb();
    const expectedSessionMemoryDB = new SessionMemoryDb();

    const currentUsersInDB: UserEntity[] = [DB_USER_1, DB_USER_2];
    expectedSessionMemoryDB.set(USER_1_ID, SESSION_MEMORY_DB_1);
    expectedSessionMemoryDB.set(USER_2_ID, SESSION_MEMORY_DB_2);

    initOnlineUsers(currentUsersInDB, sessionMemoryDB);

    expect(expectedSessionMemoryDB).toEqual(sessionMemoryDB);
  });
});

describe("Test disconnectUser", () => {
  test("when user is not in onlineUsers, then return null", async () => {
    const sessionMemoryDB = new SessionMemoryDb();
    const onlineUser = new UserEntity();

    const temp = disconnectUser(onlineUser, sessionMemoryDB);

    expect(null).toEqual(temp);
  });

  test("when user is in onlineUsers, then return user with online is false", async () => {
    const sessionMemoryDB = new SessionMemoryDb();
    const onlineUser = new UserEntity();

    sessionMemoryDB.set(USER_1_ID, SESSION_MEMORY_DB_1);
    onlineUser.id = USER_1_ID;

    const disconectedUser = disconnectUser(onlineUser, sessionMemoryDB);

    expect(false).toEqual(disconectedUser?.online);
  });
});
