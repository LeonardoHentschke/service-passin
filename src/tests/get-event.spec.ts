import { buildFastify } from "../buildFastify";

describe('events', () => {
  const app: any = buildFastify();

  afterAll(async () => {
    await app.close();
  });

  test('deve criar e buscar evento', async () => {
    const createResponse = await app.inject({
      method: 'POST',
      url: '/events',
      payload: {
        title: "Event Title",
        details: "Event Details",
        maximumAttendees: 10
      },
    });

    expect(createResponse.statusCode).toBe(201);
    const { eventId } = createResponse.json();
    expect(eventId).toBeDefined();

    const fetchResponse = await app.inject({
      method: 'GET',
      url: `/events/${eventId}`
    });

    expect(fetchResponse.statusCode).toBe(200);
    expect(fetchResponse.json()).toEqual({
      event: {
        id: eventId,
        title: "Event Title",
        slug: expect.any(String),
        details: "Event Details",
        maximumAttendees: 10,
        attendeesAmount: 0
      }
    });
  });

  test('deve retornar erro ao buscar um evento que não existe', async () => {
    const fetchResponse = await app.inject({
      method: 'GET',
      url: '/events/99999'
    });
  
    expect(fetchResponse.statusCode).toBe(400);
  });
  
});
