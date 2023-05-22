import { Controller } from 'egg';
import Action from '../../../../../lib/blueprint';

export default class MethodController extends Controller {
  @Action({ method: 'post', path: '/testPost' })
  public async testPost() {
    const p1 = this.ctx.request.body.p1;
    this.ctx.body = p1;
  }
}