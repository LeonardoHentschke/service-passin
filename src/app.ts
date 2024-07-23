import { buildFastify } from './buildFastify';

const app = buildFastify();

app.listen({ port: 3333, host: '0.0.0.0' }).then(() => {
  console.log('HTTP server running!');
});
