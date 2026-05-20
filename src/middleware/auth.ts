import { Context, Next } from 'koa';
import { verifyToken, TokenPayload } from '../utils/jwt';

export const authMiddleware = async (ctx: Context, next: Next) => {
  const authHeader = ctx.headers.authorization;
  
  if (!authHeader) {
    ctx.status = 401;
    ctx.body = { message: 'Authorization header is missing' };
    return;
  }
  
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    ctx.status = 401;
    ctx.body = { message: 'incorrect Authorization header. Use: Bearer <token>' };
    return;
  }
  
  const token = parts[1];

  const payload = verifyToken(token);
  if (!payload) {
    ctx.status = 401;
    ctx.body = { message: 'incorrect or expired token' };
    return;
  }

 if (payload.status === 'blocked') {
    ctx.status = 403;
    ctx.body = { message: 'Your account is blocked' };
    return;
  }
    ctx.state.user = payload;
  
  await next();
};