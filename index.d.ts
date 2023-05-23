import './typings/app/extend/application';
import './typings/app/extend/context';
import './typings/config/index';
import './typings/config/plugin';
import './typings/app/index';
import 'egg';
import ExtendApplication from './app/extend/application';
import ExtendContext from './app/extend/context';
import { ICakeService } from './typings/app/index';
import { Context as EggContext, Application as EggApplication } from 'egg';

declare namespace cake {
  type CakeApplicationType = typeof ExtendApplication;

  type CakeContextType = typeof ExtendContext;

  interface Application extends CakeApplicationType {
  }

  interface Context extends CakeContextType {
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