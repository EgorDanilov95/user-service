import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { errorHandler } from './middleware/errorHandler';
import router from './routes';

const app = new Koa();

app.use(errorHandler);

app.use(bodyParser());

app.use(router.routes());
app.use(router.allowedMethods());

export default app;