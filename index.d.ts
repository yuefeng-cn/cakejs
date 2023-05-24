import './typings/app/extend/application';
import './typings/app/extend/context';
import './typings/config/index';
import './typings/config/plugin';
import './typings/app/index';

import * as Egg from 'egg';
import ExtendApplication from './app/extend/application';
import ExtendContext from './app/extend/context';
import { Context as EggContext, Application as EggApplication } from 'egg';

declare namespace cake {
  interface Application extends ExtendApplication {
  }

  interface Context extends ExtendContext {
    app: Application;
  }
}

declare module 'egg' {

  interface Application extends cake.Application, EggApplication {
  }

  interface Context extends cake.Context, EggContext {

  }
}

export = Egg;