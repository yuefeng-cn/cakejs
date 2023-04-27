import { Service } from 'egg';

export default class TestService extends Service {
  async get(id: number) {
    return { id, name: this.ctx.app.config.test.key };
  }
}
