import { Controller } from 'egg';
import { Action } from '../../../../../lib/action';
import { Inject } from '../../../../../lib/register';
import TestService from '../service/test';

export default class InjectController extends Controller {

  @Inject('model.test2')
  private test2Service: TestService;

  @Inject('test')
  private testService: TestService;

  @Action({ method: 'get', path: '/testInject', loginRequired: false })
  public async testInject() {
    const data = await this.testService.get(123);
    this.ctx.body = `hi, ${data.name}`;
  }
  @Action({ method: 'get', path: '/testInject2', loginRequired: false })
  public async testInject2() {
    const data = await this.test2Service.get(123);
    this.ctx.body = `hi, ${data.name}`;
  }
}