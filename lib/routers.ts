import { Application/*, Router*/ } from 'egg';
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
      app.router.get(item.path.trim(), item.action);
    }
  });
}