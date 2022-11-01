Apollo Server Lambda

Based off of:
https://www.apollographql.com/docs/apollo-server/deployment/lambda/

run using invoke local:

> sls invoke local -f graphql -p query.json

run offline and post queries via Insomnia or curl:

> sls offline start

> curl --request POST \
  --url http://localhost:3000/dev/foo \
  --header 'Content-Type: application/json' \
  --cookie '__profilin=p%253Dt; JSESSIONID=EA0B2ED954EC39BE2C489125CC24043B' \
  --data '{
  "query": "query GreetingQuery ($arg1: String) { hello (name: $arg1) { value } }",
  "operationName": "GreetingQuery",
  "variables": { "arg1": "Timothy" }
}
'
