
const path = require('path');
const egg = require('egg');
const EGG_PATH = Symbol.for('egg#eggPath');
const EGG_LOADER = Symbol.for('egg#loader');
import { Application as EggApplication, AppWorkerLoader as EggAppWorkerLoader } from 'egg';

class YadanAppWorkerLoader extends EggAppWorkerLoader {
  load() {
    super.load();
    // 接下来自己扩展，继续加载其他的
    // this.fixMongoose();

    // this.loadModel();

    // this.loadObject();

    // this.loadCustomLoaders();
  }
}

class Application extends EggApplication {
  get [EGG_PATH]() {
    // 返回 framework 路径
    return path.dirname(__dirname);
  }
  // 覆盖 Egg 的 Loader，启动时使用这个 Loader
  get [EGG_LOADER]() {
    return YadanAppWorkerLoader;
  }
}

// 覆盖了 Egg 的 Application
module.exports = Object.assign(egg, {
  Application,
  // 自定义的 Loader 也需要 export，上层框架需要基于这个扩展
  AppWorkerLoader: YadanAppWorkerLoader,
});
