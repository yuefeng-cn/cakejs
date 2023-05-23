import { Application } from 'egg';

import { Strategy } from 'passport';

module.exports = (app: Application) => {
  return new class extends Strategy {
    async authenticate(req: any, options?: any) {
      // 测试为登录态时改为 this.success(null as any);
      this.success({ id: 123456, name: '虚拟用户' });
    }
  }();
};
