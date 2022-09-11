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

## Direction
I took this oppotunity to use nodejs 18 as well as try out the experimental runner, and challenged myself to use as little to no packages, focused on the bare minum to give an idea on how I would implement the solution to the problem presented to me 

## Debuging And Monitoring 
As i chose to use little to no packages I realised how much control I would have over the service, and would greatly help in being able to monitor and log the service 

First Observation was that I added logging from the first request all the way to the response allowing me to understand what went in and what went out, using a functional approach and this service has one job it was fitting

Making debugging easy a specific request shoudld give a specific response

As well as services like, Datadog can help with monitoring of the service on the server




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


### Endpoints
Import Insomnisa Requests (endpoints.json)

endpoints (Basic Auth) 
- GET /?id={videoid}  
    - canwatch
    - stat
    - stream endpoint

- POST /?id={videoid} 

- PATCH /?id={videoid} 
    - time

- DELETE /?id={videoid}