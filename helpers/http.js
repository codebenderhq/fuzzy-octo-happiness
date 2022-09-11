import { logger } from "./index.js";

export const response = (res, status, body, type = "application/json") => {
  res.setHeader("Content-Type", type);
  res.writeHead(status);

  if (body) {
    res.end(JSON.stringify(body));
  } else {
    res.end();
  }

  logger(JSON.stringify({
    status,
    body,
  }));
};

export const headers = (req) => {
  const res = {
    method: req.method,
    path: req.url.split("?")[0],
    searchParams: new URLSearchParams(req.url.split("?")[1]),
    auth: req.headers.authorization.split(" ")[1],
  };
  logger(JSON.stringify(res));
  return res;
};

export const sendBody = (req, func) => {
  let data = "";

  req.on("data", (chunk) => {
    data += chunk;
  });
  req.on("end", () => {
    logger(JSON.stringify(data));
    func(JSON.parse(data));
  });
};
