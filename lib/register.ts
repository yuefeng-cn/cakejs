import { Service } from 'egg';

type ControllerName = string;
type ServiceName = string;
export type RequestMethod = 'get' | 'post';

export const ServiceMap = new Map<ServiceName, Service>();

export const DependenceMap = new Map<ControllerName, Map<string, ServiceName>>();


export function Inject(serviceName: ServiceName) {
	return function (target: any, propertyKey: string ) {
    const controllerName = target.constructor.name;
    let deps = DependenceMap.get(controllerName);
    if (!deps) {
      deps = new Map();
    }

    if (deps.get(propertyKey)) {
      throw new Error('Can not inject duplicate service!');
    }

    deps.set(propertyKey, serviceName)

    DependenceMap.set(controllerName, deps);
	};
}

export function deepFindObject<T = any, TParent = any>(obj: any, name: string): { parent: TParent; name: string; obj: T} {
  const parts = name.split('.');
  for (let i = 0; i < parts.length - 1; i++) {
    obj = obj && obj[ parts[ i ] ];
  }

  return { parent: obj, name: parts[parts.length - 1], obj: obj && obj[parts[parts.length - 1]] };
}