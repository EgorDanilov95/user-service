# User Service API

REST API для управления пользователями (регистрация, аутентификация, просмотр, блокировка).  
Тестовое задание для компании Effective Mobile.

## Стэк
- Node.js, Koa, TypeScript
- Prisma ORM (SQLite)
- JWT, bcrypt, Zod

## Запуск

1. Клонировать репозиторий и установить зависимости:
   npm install
   
2. Создать файл `.env` в корне проекта со следующим содержанием:
DATABASE_URL="file:./dev.db"
JWT_SECRET=ваш_секретный_ключ
JWT_EXPIRES_IN=7d

3. Выполнить миграции Prisma:
npx prisma migrate dev --name init

4. Запустить сервер:
npm run dev

Сервер запустится на `http://localhost:3000`.

## Эндпоинты

| Метод | URL | Описание | Права |
|-------|-----|----------|-------|
| POST | /api/register | Регистрация | публичный |
| POST | /api/login | Вход, получение JWT | публичный |
| GET | /api/users/:id | Получить пользователя по ID | админ или владелец |
| GET | /api/users | Список всех пользователей | только админ |
| PATCH | /api/users/:id/block | Заблокировать пользователя | админ или владелец |

## Примеры запросов

**Регистрация**  
`POST /api/register`  
```json
{
"fullName": "Иван Иванов",
"birthDate": "1990-05-15",
"email": "ivan@example.com",
"password": "12345678"
}
```

**Логин**
`POST /api/login`
```json
{
  "email": "ivan@example.com",
  "password": "12345678"
}
```
Ответ содержит token. Далее этот токен нужно передавать в заголовке:
Authorization: Bearer <token>

**Получение списка пользователей**
`GET /api/users`
Header: Authorization: Bearer <admin_token>

**Блокировка**
`PATCH /api/users/2/block`
Header: Authorization: Bearer <token>

**Тестирование**
Используйте Postman или curl.

Для проверки роли администратора измените поле role через Prisma Studio (npx prisma studio).

   
   
