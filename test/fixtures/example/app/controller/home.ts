import { Controller } from 'egg';
import blueprint from '../../../../../lib/blueprint';

export default class TSHomeController extends Controller {
  public async index() {
    const data = await this.ctx.service.test.get(123);
    this.ctx.body = `hi, ${data.name}`;
  }
  

  @blueprint({ method: 'get', path: '/testBP' })
  public async testBP() {
    const data = await this.ctx.service.test.get(123);
    this.ctx.body = `hi, ${data.name}`;
  }

  public async rend() {
    const dataList = {
      list: [
        { id: 1, title: 'this is news 1', url: '/news/1' },
        { id: 2, title: 'this is news 2', url: '/news/2' },
      ],
    };
    return await this.ctx.render('/test.tpl', dataList);
  }
}