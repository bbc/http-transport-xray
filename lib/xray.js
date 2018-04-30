'use strict';

const url = require('url');

module.exports = (segment) => {
  return async (ctx, next) => {
    if (!segment) return next();

    const host = url.parse(ctx.req.getUrl()).host;
    const subsegment = segment.addNewSubsegment(host);
    subsegment.namespace = 'remote';

    ctx.req.addHeader('X-Amzn-Trace-Id', `Root=${segment.trace_id};Parent=${subsegment.id};Sampled=${!segment.notTraced ? 1 : 0}`);

    await next();

    if (ctx.res.httpResponse) {
      subsegment.addRemoteRequestData(ctx.res.httpResponse.req, ctx.res.httpResponse);
    }

    subsegment.close();
  };
};
