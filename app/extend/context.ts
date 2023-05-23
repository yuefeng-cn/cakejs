import { Context } from "egg";

export default {
  get tx_guid() {
    return 'CAKE_tx_guid';
  },

  /**
   * 获取当前登录用户
   */
  get currentUser() {
    const ctx = this as Context;
    return ctx.req && ctx.req['user'];
  }
};
