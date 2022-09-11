const { request } = require("node:http");
const http = require("node:http");
const fs = require("fs");


const logger = (msg) => {
    // logging service code would go here
    console.log(msg)
}

const getDB = () => {
  let res;
  try {
    res = fs.readFileSync("db.json");
    return JSON.parse(res);
  } catch (err) {
    logger('unable to get from db')
    return false;
  }
};

const canStillWatch = (userContent) => {
    let count = 0;
    if(userContent.length < 3){
        return {
            count : userContent.length,
            status: true
        }
    }else{
        userContent.map(content => {
            if(content.state === 'playing'){
                count ++
            }
        })

        if(count < 3){
            return {
                count,
                status: true
            }
        }

        return {
            count,
            status: false
        }
    }
}

const writeToDB = (userID, data) => {
  try {
    const db = getDB();
    let isUpdate = false;
    if (db[userID]) {
      if (!canStillWatch(db[userID]).status) {
        return false;
      }

      db[userID].map((content,key) => {
        if(content.id === data.id){
            db[userID][key].state = data.state
            db[userID][key].time = data.time
            isUpdate = true
        }
      })
      
      if(!isUpdate){
        db[userID].push(data);
      }

    } else {
      db[userID] = [data];
    }

    fs.writeFileSync("db.json", JSON.stringify(db));
    return true;
  } catch {
    logger('unable to write to  db')
    return false;
  }
};

const updateDB = (userID, data) => {
    try {
      const db = getDB();
      if (db[userID]) {
        db[userID].map((i,key) => {
            if(i.id === data.id){
                db[userID][key].time = data.time 
                db[userID][key].state = data.state 
            }
        });
      } else {
       return false
      }
  
      fs.writeFileSync("db.json", JSON.stringify(db));
      return true;
    } catch {
        logger('unable to update db')
      return false;
    }
};

const deleteFromDB = async (userID, id) => {
  try {
    const db = await getDB();
    if (db[userID]) {
        const newUserContent = []
        db[userID].map(content => {
            if(content.id !== id){
                newUserContent.push(content)
            }
        })
        db[userID] = newUserContent
        fs.writeFileSync("db.json", JSON.stringify(db));
        return true;
    }
   return false
  } catch {
    logger('unable to delete from db')
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
        return reponse(res, 200, {
          canWatch: db[auth] ? canStillWatch(db[auth]).status : true,
          endpoint: "/someendpoint.mp4",
          count: db[auth] ? canStillWatch(db[auth]).count : 0
        });
      }

      if (method === "POST") {
        
        return sendBody(req, ({ time }) => {
          const dbRes = writeToDB(auth, {
            id,
            time,
            state: 'playing'
          });

          if (dbRes) {
            return reponse(res, 201);
          } else {
            return reponse(res, 400, "limit reached", "text/plain");
          }
        });
      }

      if (method === "PATCH") {
        return sendBody(req, ({ time }) => {
            const dbRes = updateDB(auth, {
              id,
              time,
              state: 'paused'
            });
  
            if (dbRes) {
              return reponse(res, 204);
            } else {
              return reponse(res,  400, "no such video", "text/plain");
            }
          });
      }

      if (method === "DELETE") {

        const dbDeleteStatus = deleteFromDB(auth,id)
        if(dbDeleteStatus){
            return reponse(res, 202);
        }else{
            return reponse(res,  400, "no such video to delete", "text/plain");
        }
       
      }

      throw new Error('method not supported')
    } else {
      return reponse(res, 400, "endpoint not supported", "text/plain");
    }
  } catch (err) {
    logger(err.message)
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

  logger(JSON.stringify({
    status,
    body
  }))
};

const headers = (req) => {

    const res =  {
        method: req.method,
        path: req.url.split("?")[0],
        searchParams: new URLSearchParams(req.url.split("?")[1]),
        auth: req.headers.authorization.split(" ")[1],
    }
    logger(JSON.stringify(res))
    return res
};

const sendBody = (req, func) => {
  let data = "";

  req.on("data", (chunk) => {
    data += chunk;
  });
  req.on("end", () => {
    logger(JSON.stringify(data))
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
