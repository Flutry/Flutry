import { Router } from '@flutry/fastify';
import { RateLimit } from '../utils/service/ratelimit.service';
export default class IndexRoute extends Router {
  private rateLimit: RateLimit = new RateLimit({
      windowMs: 60000, // 1 perc
      maxRequests: 60, // 60 kérés/perc (átlagosan 1 kérés/másodperc)
    });;
  constructor() {
    super();

    this.get('/', async (ctx) => {
      const allowed = await this.rateLimit.handle(ctx);
      if (!allowed) return;
      return ctx.send({ message: 'Ok' });
    });
  }
}
