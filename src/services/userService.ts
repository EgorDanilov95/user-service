import { prisma } from '../lib/prisma';
import { hashPassword, comparePassword } from '../utils/hash';
import { generateToken, TokenPayload } from '../utils/jwt';


export type RegisterInput = {
  fullName: string;
  birthDate: Date;   
  email: string;
  password: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export const registerUser = async (data: RegisterInput) => {
  
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (existingUser) {
    throw new Error('User with this email has already been');
  }

  const hashedPassword = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      fullName: data.fullName,
      birthDate: data.birthDate,
      email: data.email,
      password: hashedPassword,
      role: 'user',     
      status: 'active',
    },
    select: {
      id: true,
      fullName: true,
      birthDate: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });

  return user;
};

export const loginUser = async (data: LoginInput) => {

  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (!user) {
    throw new Error('Incorrect email or password');
  }

  const isPasswordValid = await comparePassword(data.password, user.password);
  if (!isPasswordValid) {
    throw new Error('Incorrect email or password');
  }

  if (user.status === 'blocked') {
    throw new Error('User is blocked');
  }

  const payload: TokenPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
    status: user.status,
  };

  const token = generateToken(payload);

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
    },
  };
};

export const getUserById = async (id: number, currentUser: TokenPayload) => {

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      fullName: true,
      birthDate: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  if (currentUser.role !== 'admin' && currentUser.id !== user.id) {
    throw new Error('Access denied');
  }

  return user;
};

export const getUsersList = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      fullName: true,
      birthDate: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });
  return users;
};

export const blockUser = async (targetId: number, currentUser: TokenPayload) => {

  if (currentUser.role !== 'admin' && currentUser.id !== targetId) {
    throw new Error('Access denied');
  }

  const user = await prisma.user.findUnique({
    where: { id: targetId },
  });
  if (!user) {
    throw new Error('User not found');
  }

  const updated = await prisma.user.update({
    where: { id: targetId },
    data: { status: 'blocked' },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
    },
  });

  return updated;
};