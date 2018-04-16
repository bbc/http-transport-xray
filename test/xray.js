'use strict';

const assert = require('chai').assert;
const nock = require('nock');
const sinon = require('sinon');

const HttpTransport = require('@bbc/http-transport');
const xray = require('../lib/xray');

const url = 'http://www.example.com/';
const host = 'http://www.example.com';
const path = '/';

const simpleResponseBody = 'Du mich auch';

describe('Request collapsing', () => {
  let segment;
  let addNewSubsegment;
  let closeSubsegment;

  beforeEach(() => {
    nock.disableNetConnect();
    closeSubsegment = sinon.spy();

    addNewSubsegment = sinon.stub().returns({
      id: 'req123',
      close: closeSubsegment
    });

    segment = {
      notTraced: true,
      addNewSubsegment,
      trace_id: 'tracing_id'
    };
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('creates a subsegment', async () => {
    nock(host)
      .get(path)
      .reply(200, simpleResponseBody);

    const client = HttpTransport.createClient();

    await client
      .use(xray(segment))
      .get(url)
      .asResponse();

    sinon.assert.calledWith(addNewSubsegment, 'www.example.com');
  });

  it('creates the "X-Amzn-Trace-Id" header', async () => {
    const scope = nock(host)
      .matchHeader('X-Amzn-Trace-Id', 'Root=tracing_id;Parent=req123;Sampled=0')
      .get(path)
      .reply(200, simpleResponseBody);

    const client = HttpTransport.createClient();

    await client
      .use(xray(segment))
      .get(url)
      .asResponse();

    assert.ok(scope.isDone());
  });

  it('closes the subsegment upon completion', async () => {
    nock(host)
      .get(path)
      .reply(200, simpleResponseBody);

    const client = HttpTransport.createClient();

    const res = client
      .use(xray(segment))
      .get(url)
      .asResponse();

    sinon.assert.notCalled(closeSubsegment);

    await res;

    sinon.assert.calledOnce(closeSubsegment);
  });

  it('is a noop when a segment is absent', async () => {
    nock(host)
      .get(path)
      .reply(200, simpleResponseBody);

    const client = HttpTransport.createClient();

    const res = client
      .use(xray())
      .get(url)
      .asResponse();

    await res;

    sinon.assert.notCalled(addNewSubsegment);
    sinon.assert.notCalled(closeSubsegment);
  });
});
