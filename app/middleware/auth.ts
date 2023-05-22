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
  // 后边这俩参数不写的话导致重定向到 "/"
  // TODO 消灭any
  const authMethod = (app as any).passport.authenticate(passports, { successReturnToOrRedirect: false, successRedirect: false });
  return authMethod;
}


