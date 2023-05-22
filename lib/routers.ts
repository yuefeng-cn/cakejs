import { Application, Context} from 'egg';
import * as composer from 'koa-compose';
import utils = require("egg-core/lib/utils");

let registeredRouters: {
  [key: string]: {
    name: string,
    method: string;
    path: string;
    action: () => any;
  }
} = {}

export function registerRoute(name: string, method: string, path: string, action:any) {
  registeredRouters[`${method}:${path}`] = {
    name, method, path, action,
  }
}

export function buildRouters(app: Application) {
  Object.entries(registeredRouters).forEach(([_, item]) => {
    if (item.method === 'get') {
      const newAction = buildControllerMiddleware(app, item.action);
      app.router.get(item.path.trim(), newAction);
    }
  });
}

/**
 * 一个Controller注册路由之前，在此获取到应用上的中间件，利用koa-compose将其包裹为一个函数，请求该Controller时就会将其调用
 * @param app 
 * @param action 
 * @returns 
 */
function buildControllerMiddleware(app: Application, action: (ctx: Context) => Promise<void>) {
  const middlewareArr = (app['mMiddleware'] ?? []);

  const newMiddlewareArr = [...middlewareArr, action].map(x => utils.middleware(x));
  const executor = composer<Context>(newMiddlewareArr);
  return async function(ctx: Context) {
    await executor(ctx, async () => { });
  };
}