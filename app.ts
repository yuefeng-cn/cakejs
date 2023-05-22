import { Application } from 'egg';

export default (app: Application) => {
  // 1.为了自动加载auth
  // 2.不可以在框架代码配置文件里设置中间件 Can not define coreMiddleware in app or plugin
  for (const name of ['auth']) {
    if (app.config.coreMiddleware.indexOf(name) === -1) {
      app.config.coreMiddleware.push(name);
    }
  }
}
