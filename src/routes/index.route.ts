import { Router } from '@flutry/express';
export default class IndexRoute extends Router {
  constructor() {
    super();
    this.get('/', async (ctx) => {
      return ctx.send('Ok');
    });
  }
}
