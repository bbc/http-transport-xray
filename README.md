[![NPM downloads](https://img.shields.io/npm/dm/@bbc/http-transport-xray.svg?style=flat)](https://npmjs.org/package/@bbc/http-transport-xray)
[![Build Status](https://api.travis-ci.org/bbc/http-transport-xray.svg)](https://travis-ci.org/bbc/http-transport-xray) 
![npm](https://img.shields.io/npm/v/@bbc/http-transport-xray.svg)
 ![license](https://img.shields.io/badge/license-MIT-blue.svg) 
![github-issues](https://img.shields.io/github/issues/bbc/http-transport-xray.svg)
![stars](https://img.shields.io/github/stars/bbc/http-transport-xray.svg)
![forks](https://img.shields.io/github/forks/bbc/http-transport-xray.svg)

# HTTP Transport Cache

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
