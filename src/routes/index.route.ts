import { Router } from '@flutry/fastify';
export default class IndexRoute extends Router {
  constructor() {
    super();
    this.get('/', async (ctx) => {
      return ctx.send({ message: 'Ok' });
    });
  }
}
