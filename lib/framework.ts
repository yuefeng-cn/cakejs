
const path = require('path');
const egg = require('egg');
const EGG_PATH = Symbol.for('egg#eggPath');
const EGG_LOADER = Symbol.for('egg#loader');
import { Application as EggApplication, AppWorkerLoader as EggAppWorkerLoader } from 'egg';
import { buildRouters } from './routers';

class  CakeAppWorkerLoader extends EggAppWorkerLoader {
  load() {
    super.load();
    // 接下来自己扩展，继续加载其他的
    this.loadPassport();

    // this.loadModel();

    // this.loadObject();

    // this.loadCustomLoaders();
  }

  loadRouter() {
    super.loadRouter();
    buildRouters(this.app as any);
  }

  loadPlugin() {
    super.loadPlugin();
  }

  loadMiddleware(opt: any) {
    const mMiddleware: any[] = [];

    super.loadMiddleware({
      initializer: (factory: any, options: any) => {
        if (typeof factory !== 'function') {
          return factory;
        }

        return (mwOptions: any, app: Application) => {
          const mw = factory(mwOptions, app);
          
          // https://www.eggjs.org/zh-CN/basics/middleware
          // options: 中间件的配置项，框架会将 app.config[${middlewareName}] 传递进来。
          if (mwOptions.framework) {
            mMiddleware.push(mw);
          }

          return mw;
        };
      }, ...(opt || {})});

    this.app['mMiddleware'] = mMiddleware;
  }

  loadPassport() {
    const app = this.app;


    const opt = {
      inject: this.app,
      caseStyle: 'camel',
      override: true,
      directory: this.getLoadUnits().map(unit => path.join(unit.path, 'app/passport')),
    };

    const passport = app['passport'];
    app.loader.loadToApp(opt.directory, 'passport', Object.assign(opt, {
      initializer: (factory, options) => {
        passport.use(options.pathName.split('.', 2)[1], factory(app));
      },
    }));
    app['passport'] = passport;

  }

}

class Application extends EggApplication {
  get [EGG_PATH]() {
    // 返回 framework 路径
    return path.dirname(__dirname);
  }
  // 覆盖 Egg 的 Loader，启动时使用这个 Loader
  get [EGG_LOADER]() {
    return CakeAppWorkerLoader;
  }
}

// 覆盖了 Egg 的 Application
module.exports = Object.assign(egg, {
  Application,
  // 自定义的 Loader 也需要 export，上层框架需要基于这个扩展
  AppWorkerLoader: CakeAppWorkerLoader,
});
