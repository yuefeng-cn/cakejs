import { Context } from 'egg';

export default {
  /**
   * 获取当前登录用户
   */
  get currentUser() {
    const ctx = this as Context;
    return ctx.req && ctx.req['user'];
  },
};
