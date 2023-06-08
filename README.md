# Cake.js :cake:

Cake.js 是基于[Egg.js](https://eggjs.org/)的扩展框架，主要使用typescript开发。现阶段提供了：

+ 更简单的路由注册方式
+ 更简单的passport用户鉴权方式
+ 依赖注入

## **QuickStart**

```shell
$ mkdir demo && cd demo
$ npm init cake
$ npm i
$ npm run dev
```



## Features

### 路由

在这里可以使用`Action`注解来实现路由注册，直接在方法的上方一行就可以标记路由信息，而不再需要去router.ts中编写路由信息。

以下是一个示例：

```typescript
import {Controller} from 'egg';
import Action from '../../node_modules/egg-cakejs/lib/blueprint';

export default class TSHomeController extends Controller {
	@Action({method: 'get', path: '/'})
	public async index() {
		this.ctx.body = '你好';
	}
}
```

这个代码仍然像`egg.js`原来的约定一样放在`app/controller`目录下。

在这里，`@Action({method: 'get', path: '/'})`这一行代表当通过`GET`方式请求`http://127.0.0.1:7001/`时，就会请求到index这个方法上，浏览器上会显示：你好。

### 鉴权

Cake.js 使用中间件结合 egg-passport 来实现鉴权。以下编写了一个需要用户登录态的Controller：

```typescript
import {Controller} from 'egg';
import Action from '../../node_modules/egg-cakejs/lib/blueprint';

export default class TSHomeController extends Controller {
	@Action({method: 'get', path: '/', loginRequired: true})
	public async index() {
		const user = this.ctx.currentUser;
		this.ctx.body =`你好，${user.name}`;
	}
}
```

这里只在`Action`注解中添加了一个信息：`loginRequired: true`，这个信息代表请求时是需要携带用户认证信息的，也就是登录态，此时可以直接通过`ctx.currentUser`获取到用户信息，没有登录态则会返回 401 状态码，而不是调用`index`方法。

如何实现这样的效果呢？

首先需要在`app/passport`目录下实现一个鉴权策略，文件名就叫`user.ts`，这里只需要query中包含id参数就算携带了用户认证信息，否则认为不是登录态，以下是代码示例：

```typescript
import {Application} from 'egg';

import {Strategy} from 'passport';

/**
 * 一个假的鉴权策略，可以编写其他的策略，来实现用户鉴权
 */
module.exports = (app: Application) => {
	return new (class extends Strategy {
		async authenticate(req: any, options?: any) {
			if (req.query.id) {
				this.success({id: req.query.id, name: req.query.name});
			} else {
				this.fail();
			}
		}
	})();
};
```

其次需要修改配置文件（ config.default.ts 或是其他环境的配置文件），在里面加一条：`config.userPassport = ['user'];`。之所以需要这样配置，是因为项目在启动过程中挂载了一个中间件，这个中间件会加载配置的 passport 策略：

```typescript
import { Application } from 'egg';

/**
 * 通过这个中间件将passport挂在每个请求上去
 * @param mwOptions
 * @param app 
 * @returns 
 */
export default function auth(mwOptions: any, app: Application) {
  const defaultPassport =  app.config.defaultPassport ?? [ 'fake' ];
  const userPassport = app.config.userPassport ?? []; // 普通用户的鉴权策略
  const adminPassport = app.config.adminPassport ?? [];  // admin用户的鉴权策略

  const passports = [... new Set([ ...userPassport, ...adminPassport, ...defaultPassport ])];
  const passportOptions = { session: false, failWithError: false, successReturnToOrRedirect: false, successRedirect: false };

  const authMethod = (app as any).passport.authenticate(passports, passportOptions);
  return authMethod;
}

```

passport 策略分三种：defaultPassport（兜底的用户认证方案），userPassport（一般用户的认证方案），adminPassport（超级用户认证方案）。

### 依赖注入
> 1.0.21 版本开始支持

在 Cake.js 中使用依赖注入只需要一个注解：`Inject`。使用此注解时，给它传的值其实就是egg.js中调用service时惯用的`ctx.service.xxx.yyy.method()`中的`xxx.yyy`这一段。

以下是一个注入 service 的 Controller：

```typescript
import {Controller} from 'egg';
import { Action } from '../../node_modules/egg-cakejs/lib/action';
import { Inject } from '../../node_modules/egg-cakejs/lib/register';
import TestService from '../service/test';

export default class TSHomeController extends Controller {
    @Inject('test')
    private testService: TestService;

    @Action({method: 'get', path: '/index'})
    public async index() {
	const data = await this.testService.get(123);
	this.ctx.body = `hi, ${data.name}`;
    }
}

```

其中 TestService 只是一个普通的 Service：

```typescript
import {Service} from 'egg';

export default class TestService extends Service {
	async get(id: number) {
		return {id, name: this.ctx.app.config.test.key};
	}
}
```
