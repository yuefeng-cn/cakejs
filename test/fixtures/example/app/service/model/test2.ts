import { Service } from 'egg';
export default class Test2Service extends Service {
  async get(id: number) {
    return { id, name: this.ctx.app.config.test.key };
  }
}
