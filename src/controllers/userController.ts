import { Context } from 'koa';
import { registerSchema, loginSchema, userIdSchema } from '../validators/userValidator';
import { registerUser, loginUser, getUserById, getUsersList, blockUser } from '../services/userService';

export const registerController = async (ctx: Context) => {
  try {
    const validatedData = registerSchema.parse(ctx.request.body);
    const user = await registerUser(validatedData);
    ctx.status = 201;
    ctx.body = { success: true, user };
  } catch (error: any) {
    ctx.status = 400;
    ctx.body = { success: false, message: error.errors?.[0]?.message || error.message };
  }
};

export const loginController = async (ctx: Context) => {
  try {
    const validatedData = loginSchema.parse(ctx.request.body);
    const result = await loginUser(validatedData);
    ctx.status = 200;
    ctx.body = { success: true, ...result };
  } catch (error: any) {
    ctx.status = 401;
    ctx.body = { success: false, message: error.errors?.[0]?.message || error.message };
  }
};

export const getUserByIdController = async (ctx: Context) => {
  try {
    const { id } = userIdSchema.parse({ id: ctx.params.id });
    const currentUser = ctx.state.user; 
    const user = await getUserById(id, currentUser);
    ctx.body = { success: true, user };
  } catch (error: any) {
    ctx.status = error.message === 'User not found' ? 404 : 403;
    ctx.body = { success: false, message: error.message };
  }
};

export const getUsersListController = async (ctx: Context) => {
  try {
    const users = await getUsersList();
    ctx.body = { success: true, users };
  } catch (error: any) {
    ctx.status = 500;
    ctx.body = { success: false, message: error.message };
  }
};

export const blockUserController = async (ctx: Context) => {
  try {
    const { id } = userIdSchema.parse({ id: ctx.params.id });
    const currentUser = ctx.state.user;
    const updated = await blockUser(id, currentUser);
    ctx.body = { success: true, user: updated };
  } catch (error: any) {
    ctx.status = error.message === 'User not found' ? 404 : 403;
    ctx.body = { success: false, message: error.message };
  }
};