const { request } = require("node:http");
const http = require("node:http");
const fs = require("fs");

const getDB = () => {
  let res;
  try {
    res = fs.readFileSync("db.json");
    return JSON.parse(res);
  } catch (err) {
    // log data
    return false;
  }
};

const writeToDB = (userID, data) => {
  try {
    let db = getDB();
    if (db[userID]) {
      if (db[userID].length === 3) {
        return false;
      }
      db[userID].push(data);
    } else {
      db[userID] = [data];
    }

    fs.writeFileSync("db.json", JSON.stringify(db));
    return true;
  } catch {
    // log data
    return false;
  }
};

const deleteFromDB = async (userID, id) => {
  try {
    const db = await getDB();

    return true;
  } catch {
    // log data
    return false;
  }
};

const middleware = (res, req) => {
  const {
    method,
    path,
    searchParams,
    auth,
  } = headers(req);

  try {
    if (!auth) {
      throw new Error("No authorization header");
    }

    const id = searchParams.get("id");

    if (path === "/") {
      if (method === "GET") {
        return reponse(res, 200, {
          canWatch: true,
          endpoint: "/someendpoint.mp4",
          count: 2,
        });
      }

      if (method === "POST") {
        if (!id) {
          throw new Error("No id sent through params");
        }

        sendBody(req, ({ time }) => {
          const dbRes = writeToDB(auth, {
            id,
            time,
          });

          if (dbRes) {
            return reponse(res, 201);
          } else {
            return reponse(res, 400, "limit reached", "text/plain");
          }
        });
      }
      
    } else {
      return reponse(res, 400, "Not Supported Endpoint", "text/plain");
    }
  } catch (err) {
    console.log(err.message);
    return reponse(res, 400, err.message, "text/plain");
  }
};

const reponse = (res, status, body, type = "application/json") => {
  res.setHeader("Content-Type", type);
  res.writeHead(status);

  if (body) {
    res.end(JSON.stringify(body));
  } else {
    res.end();
  }
};

const headers = (req) => {
  return {
    method: req.method,
    path: req.url.split("?")[0],
    searchParams: new URLSearchParams(req.url.split("?")[1]),
    auth: req.headers.authorization.split(" ")[1],
  };
};

const sendBody = (req, func) => {
  let data = "";

  req.on("data", (chunk) => {
    data += chunk;
  });
  req.on("end", () => {
    func(JSON.parse(data));
  });
};

const server = http.createServer((req, res) => {
  return middleware(res, req);
});

server.on("clientError", (err, socket) => {
  socket.end("HTTP/1.1 400 Bad Request\r\n\r\n");
});

server.listen(8000);
console.log("server started on http://localhost:8000");
