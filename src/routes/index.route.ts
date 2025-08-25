import { Router } from '@flutry/fastify';
import { RateLimitConfig } from '../utils/config/RateLimitConfig';
export default class IndexRoute extends Router {
  constructor() {
    super();

    this.get('/', async (ctx) => {
      const { allowed } = await RateLimitConfig.index.handle(ctx);
      if (!allowed) return;
      return ctx.send({ message: 'Ok' });
    });
  }
}
