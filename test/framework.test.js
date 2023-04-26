'use strict';

const assert = require('assert');

const mm = require('egg-mock');

describe('test/lib/framework.test.js', () => {
  let app;
  before(() => {
    app = mm.app({
      baseDir: 'example',
      customEgg: true,
    });
    return app.ready();
  });
  after(() => app.close());
  afterEach(mm.restore);

  it('should GET /', () => {
    return app.httpRequest()
      .get('/')
      .expect('hi, framework-example_123456')
      .expect(200);
  });

  it('should load config', () => {
    assert(app.config.test.key === 'framework-example_123456');
  });

  it('should load service', function* () {
    const ctx = app.mockContext();
    const data = yield ctx.service.test.get(123);
    assert.deepEqual(data, {
      id: 123,
      name: 'framework-example_123456',
    });
  });
});
