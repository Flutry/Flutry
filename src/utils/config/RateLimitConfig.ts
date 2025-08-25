import { RateLimit } from '../service/ratelimit.service';

export const RateLimitConfig = {
  index: new RateLimit({
    windowMs: 60000, // 1 minutes
    maxRequests: 60, // 60 request/minutes
  }),
};
