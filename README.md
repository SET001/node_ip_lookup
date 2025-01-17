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

## Min points
- controller rely on interfaces. It is possible to implement redis based caching or different whois provider. Controller logic will not change.
- error handling
- request-specific logger with formatting and requestID
- configuration throught env variables

## Todo
- [ ] better file structure
- [ ] validate incoming params
- [ ] tests
- [ ] redis caching
