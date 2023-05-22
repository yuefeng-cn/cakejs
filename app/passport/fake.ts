import { Application } from 'egg';

import { Strategy } from 'passport';

/**
 * 一个假的鉴权策略，可以编写其他的策略，来实现用户鉴权
 */
module.exports = (app: Application) => {
  return new class extends Strategy {
    async authenticate(req: any, options?: any) {
      this.success({ id: 123456, name: '虚拟用户' });
    }
  }();
};
