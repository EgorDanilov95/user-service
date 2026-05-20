import { Context, Next } from 'koa';

export const requireAdmin = async (ctx: Context, next: Next) => {
  const user = ctx.state.user;
  if (!user || user.role !== 'admin') {
    ctx.status = 403;
    ctx.body = { message: 'Access denied. Administrator rights are required' };
    return;
  }
  await next();
};