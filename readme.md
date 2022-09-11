This service checks how many video streams a given user is watching and prevent a user from
watching more than 3 video streams concurrently 

This service only checks whether
there are too many streams active. In a real implementation

<!-- but make sure you have automated tests,
logging, and include information in the README about how you'll scale the solution to millions of
users, how you'd approach logging & monitoring at scale so that you can actually debug the
system as it increases in complexity. -->

<!-- This API will be involved every time a new user wants to watch new content, so it should be able
to know exactly how many videos a user is watching. -->

endpoints (Basic Auth) 
- GET /?id={videoid}  
    - canwatch
    - stat
    - stream endpoint

- POST /?id={videoid} 

- PATCH /?id={videoid} 
    - time

- DELETE /?id={videoid}


### Requirments
 nodejs 18 

### Setup 

install dependicies
```
npm install
```

start production
```
npm start
```
run development 
```
npm run dev
```
run tests
```
npm test
```

### Docker Setup

build docker file 

```
docker build . -t streamer
```
 
```
docker run -p 8000:8000 -d streamer
```