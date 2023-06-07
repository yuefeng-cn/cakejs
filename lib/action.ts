import {registerRoute, RouterOption} from './routers';
import {Context} from 'egg';
import { DependenceMap } from './register';

export function Action(options: RouterOption) {
	return function (
		target: any,
		propertyKey: string,
		descriptor: PropertyDescriptor,
	) {
		const controllerConstructor = target.constructor;
		const originFunction = descriptor.value;
		descriptor.value = async function (koaCtx: Context) {
			const controller = new controllerConstructor(koaCtx); // 重新生成controller
			const ctx = controller['ctx'];
			if (!ctx) {
				throw new Error('error Context')
			}

			// 判断一下是否需要鉴权
			if (options.loginRequired && !ctx.currentUser) {
				ctx.status = 401;
				return;
			}

			// service依赖注入
			const deps = DependenceMap.get(target.constructor.name);
			if (deps) {
				deps.forEach((serviceName, prop) => {
					const serviceContainer = ctx.app.ServiceContainer as Map<string, Object>;
					const obj = serviceContainer && serviceContainer.get(serviceName);
					if (!obj) {
						throw new Error(`Can not find Service! ${serviceName}`)
					}
					controller[prop] = obj;
				});
			}

			const response = await originFunction.call(controller);
			if (response) {
				ctx.body = response;
			}
		};

		const controllerAction = buildControllerMiddleware(descriptor.value);
		registerRoute(
			`${target.constructor.name}_${propertyKey}`,
			options.method,
			options.path,
			controllerAction,
		);
	};
}

/**
 * 将编写的controller包装成一个koa的中间件，以此来将controller函数注册到koa-router，并具备访问到ctx的能力
 * @param action 编写的controller
 * @returns
 */
function buildControllerMiddleware(action: (ctx: Context) => Promise<void>) {
	/*
  koa-router 模块注册路由时，回调函数的第一个参数是 ctx,它是一个包含请求上下文信息的对象。
  具体来说，ctx 对象包含以下属性：

  ctx.request:一个包含请求对象的属性，可以访问请求头、请求方法、请求体等信息。
  ctx.response:一个包含响应对象的属性，可以访问响应状态码、响应头、响应体等信息。
  ctx.next():一个方法，用于继续处理请求或将请求传递给下一个中间件处理。
  在路由处理函数中，可以通过 ctx 对象来获取请求和响应的信息，并进行相应的处理。例如，可以使用 ctx.response.send() 方法发送响应，使用 ctx.request.params.id 获取请求参数中的 ID 值等
  */
	return async (ctx: Context) => {
		return await action(ctx);
	};
}
