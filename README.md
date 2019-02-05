# HTTP Transport X-Ray
Create X-Ray subsegments and add Tracing Header for use with X-Ray in manual mode.

## Installation

```
npm install --save @bbc/http-transport-xray
```

## Usage

Use per call.
Pass in a segment to create a subsegment for that call, identified by the host name.

```js
const HttpTransport = require('@bbc/http-transport');
const AWSXRay = require('aws-xray-sdk');
const xray = require('@bbc/http-transport-xray').middleware;

const segment = new AWSXRay.Segment('mySegment');

const client = HttpTransport.createClient();

client
  .use(xray(segment))
  .get(url)
  .asResponse();
```

## Test

```
npm test
```
