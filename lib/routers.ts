import { Application/*, Router*/ } from 'egg';
let registeredRouters: {
  [key: string]: {
    name: string,
    method: string;
    path: string;
    action: () => any;
  }
} = {}

export function registerRoute(name: string, method: string, path: string, action: () => any) {
  registeredRouters[`${method}:${path}`] = {
    name, method, path, action,
  }
  // console.log('注册了', registeredRouters);
}

export function buildRouters(app: Application) {
  Object.entries(registeredRouters).forEach(([_, item]) => {
    // TODO 这里虽然为函数注册了路由，但是函数里面没有ctx
    app.router[item.method.trim()](item.path.trim(), item.action);
  });
}