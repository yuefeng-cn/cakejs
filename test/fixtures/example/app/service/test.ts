import { Service } from 'egg';

class TestService extends Service {
  async get(id: number) {
    return { id, name: this.ctx.app.config.test.key };
  }
}

module.exports = TestService;
