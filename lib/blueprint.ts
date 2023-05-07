import { registerRoute } from "./routers";

export default function blueprint(bpOptions: { method: string, path: string }) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log('装饰器', target, propertyKey);
    registerRoute('TSHomeController.testBP', bpOptions.method, bpOptions.path, target[propertyKey]);
  };
}
