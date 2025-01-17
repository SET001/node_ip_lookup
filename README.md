Repo with solution for [Backend Position Technical Task](https://gist.github.com/kami4ka/40ad1f66be45bb37cabdb94f9923d721)

## Install
```
npm install
```

## Run
```
npm run dev
```


## Env vars
- PORT - port for server to listen on
- DB - DB name
- TABLE - DB table name
- TTL - time to live for cached values in seconds

## Main points
- controller rely on interfaces. It is possible to, for instance, implement redis based caching. Or implement work with different whois provider. Controller logic will not change.
- error handling
- request-specific logger with formatting and requestID
- configuration throught env variables

## Notices
- to simplify things I only used limited set of data from what ipwhois.io is providing
- I implemented caching with sqlite in-memory DB to simplify deployment of this app. It is possible to implement cache based on any other DB - for instance redis based (wich support TTLs out of the box). But that would require additionall steps to prepare deployment infrastructure.
 
## Todo
- [ ] better file structure
- [ ] validate incoming params
- [ ] tests
- [ ] redis caching
