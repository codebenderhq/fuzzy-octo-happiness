## Introduction
This service checks how many video streams a given user is watching and prevent a user from watching more than 3 video streams concurrently 
 
## Direction
I took this opportunity to use nodejs 18 as well as try out the experimental test runner and challenged myself to use as little to no packages, focused on the bare minimum to give an idea on how I would implement the solution to the problem presented to me


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
[Insomnisa Endpoint Requests availible](endpoints.json)

endpoints (Basic Auth) 
- GET /?id={videoid}  
-H "Authorization: Basic <ACCESS_TOKEN>"
{
    canWatch,
    endpoint,
    count
}

- POST /?id={videoid}
-H "Authorization: Basic <ACCESS_TOKEN>"
-H "Content-Type: application/json"
-d '{"time": "1:00"}'  

- PATCH /?id={videoid} 
-H "Authorization: Basic <ACCESS_TOKEN>"
-H "Content-Type: application/json"
-d '{"time": "1:00"}'  

- DELETE /?id={videoid}
-H "Authorization: Basic <ACCESS_TOKEN>"



## Debuging And Monitoring 
As I chose to use little to no packages I realized how much control I would have over the service, and would greatly help in being able to monitor and log the service 

My First Observation was that I added logging from the first request to the response allowing me to understand what went in and what went out, using a functional approach, and since this service has one job it was fitting

Making debugging easy, a specific request should give a specific response

As well as services like, Datadog can help with monitoring the service on the server

## Scaling
Keeping this service minimal, and focused on HTTP methods is one of the decisions on how to make sure it scales to millions, being able to decrease the request counts, 

having the get endpoint (watch) return information that will allow other services to know if the user is still allowed to watch another video

as well as implementing that check internally on the service before continuation of the request as the complexity increases

NB: the above is just factors that will be taken into account to make sure the code scales, there are other hardware refactorings that can be done to 