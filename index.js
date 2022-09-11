import { canStillWatch, logger } from "./helpers/index.js";
import { deleteFromDB, getDB, updateDB, writeToDB } from "./helpers/db.js";
import { headers, response, sendBody } from "./helpers/http.js";
import http from "node:http";

const middleware = (res, req) => {
  const {
    method,
    path,
    searchParams,
    auth,
  } = headers(req);

  try {
    if (!auth) {
      // now to be able to send through status code 401
      throw new Error("No authorization header");
    }

    const id = searchParams.get("id");

    if (!id) {
      throw new Error("No id sent through params");
    }

    if (path === "/") {
      if (method === "GET") {
        const db = getDB();
        return response(res, 200, {
          canWatch: db[auth] ? canStillWatch(db[auth]).status : true,
          endpoint: "/someendpoint.mp4",
          count: db[auth] ? canStillWatch(db[auth]).count : 0,
        });
      }

      if (method === "POST") {
        return sendBody(req, ({ time }) => {
          const dbRes = writeToDB(auth, {
            id,
            time,
            state: "playing",
          });

          if (dbRes) {
            return response(res, 201);
          } else {
            return response(res, 400, "limit reached", "text/plain");
          }
        });
      }

      if (method === "PATCH") {
        return sendBody(req, ({ time }) => {
          const dbRes = updateDB(auth, {
            id,
            time,
            state: "paused",
          });

          if (dbRes) {
            return response(res, 204);
          } else {
            return response(res, 400, "no such video", "text/plain");
          }
        });
      }

      if (method === "DELETE") {
        const dbDeleteStatus = deleteFromDB(auth, id);
        if (dbDeleteStatus) {
          return response(res, 202);
        } else {
          return response(res, 400, "no such video to delete", "text/plain");
        }
      }

      throw new Error("method not supported");
    } else {
      return response(res, 400, "endpoint not supported", "text/plain");
    }
  } catch (err) {
    logger(err.message);
    return response(res, 400, err.message, "text/plain");
  }
};

const server = http.createServer((req, res) => {
  return middleware(res, req);
});

server.on("clientError", (err, socket) => {
  socket.end("HTTP/1.1 400 Bad Request\r\n\r\n");
});

server.listen(8000);
console.log("server started on http://localhost:8000");
