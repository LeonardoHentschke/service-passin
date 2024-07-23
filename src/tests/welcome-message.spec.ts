import { buildFastify } from "../buildFastify";

describe('Bem-vindo à API!', () => {
  const app: any = buildFastify();

  afterAll(async () => {
    await app.close();
  });

  test('deve retornar uma mensagem de boas-vindas', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/'
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ message: 'Bem-vindo à API!' });
  });

});
