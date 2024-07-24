import { buildFastify } from "../buildFastify";

describe('events', () => {
  const app: any = buildFastify();

  afterAll(async () => {
    await app.close();
  });

  test('deve criar evento', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/events',
      payload: {
        title: "Teste",
        details: "teste",
        maximumAttendees: 1
      },
    });

    expect(response.statusCode).toBe(201);
    expect(response.json()).toHaveProperty('eventId');
  });

  test('não deve criar evento com título muito curto', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/events',
      payload: {
        title: "Tes",
        details: "teste",
        maximumAttendees: 1
      },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({
      message: 'Error during validation',
      errors: {
        title: ['String must contain at least 4 character(s)']
      }
    });
  });

  test('deve lidar com campos opcionais nulos', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/events',
      payload: {
        title: "Valid Title",
        details: null,
        maximumAttendees: null
      },
    });

    expect(response.statusCode).toBe(201);
    expect(response.json()).toHaveProperty('eventId');
  });

  test('não deve criar evento com payload inválido', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/events',
      payload: {
        // Faltando campos obrigatórios
      },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({
      message: "Error during validation",
      errors: {
          "title": [
              "Required"
          ],
          "details": [
              "Required"
          ],
          "maximumAttendees": [
              "Required"
          ]
      }
    });
  });

  test('não deve criar evento com título duplicado', async () => {
    // Primeiro cria um evento para garantir que há um evento com o mesmo título
    await app.inject({
      method: 'POST',
      url: '/events',
      payload: {
        title: "Unique Title",
        details: "teste",
        maximumAttendees: 1
      },
    });

    // Tenta criar um novo evento com o mesmo título
    const response = await app.inject({
      method: 'POST',
      url: '/events',
      payload: {
        title: "Unique Title",
        details: "teste",
        maximumAttendees: 1
      },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({
      message: 'Another event with same title already exists.'
    });
  });

  test('não deve criar evento com maximumAttendees negativo', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/events',
      payload: {
        title: "Valid Title",
        details: "teste",
        maximumAttendees: -1
      },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({
      message: "Error during validation",
      errors: {
          "maximumAttendees": [
              "Number must be greater than 0"
          ]
      }
    });
  });

  test('deve criar evento com maximumAttendees igual a zero', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/events',
      payload: {
        title: "Valid Title",
        details: "teste",
        maximumAttendees: 0
      },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({
      message: "Error during validation",
      errors: {
          "maximumAttendees": [
              "Number must be greater than 0"
          ]
      }
    });
  });

});
