import { Context, Next } from 'koa';
import { verifyToken, TokenPayload } from '../utils/jwt';

export const authMiddleware = async (ctx: Context, next: Next) => {
  const authHeader = ctx.headers.authorization;
  
  if (!authHeader) {
    ctx.status = 401;
    ctx.body = { message: 'Отсутствует заголовок Authorization' };
    return;
  }
  
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    ctx.status = 401;
    ctx.body = { message: 'Неверный формат заголовка Authorization. Используйте: Bearer <token>' };
    return;
  }
  
  const token = parts[1];

  const payload = verifyToken(token);
  if (!payload) {
    ctx.status = 401;
    ctx.body = { message: 'Недействительный или просроченный токен' };
    return;
  }
    ctx.state.user = payload;
  
  await next();
};