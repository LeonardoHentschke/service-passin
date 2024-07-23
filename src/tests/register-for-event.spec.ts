import { buildFastify } from "../buildFastify";

describe('attendees', () => {
  const app: any = buildFastify();

  afterAll(async () => {
    await app.close();
  });

  test('deve registrar um participante com sucesso', async () => {
    // Primeiro, cria um evento para registrar um participante
    const eventResponse = await app.inject({
      method: 'POST',
      url: '/events',
      payload: {
        title: "registrar um participante com sucesso",
        details: "Event Details",
        maximumAttendees: 10
      },
    });

    expect(eventResponse.statusCode).toBe(201);
    const { eventId } = eventResponse.json();
    
    // Registra um participante
    const registerResponse = await app.inject({
      method: 'POST',
      url: `/events/${eventId}/attendees`,
      payload: {
        name: "John Doe",
        email: "john.doe@example.com"
      },
    });

    expect(registerResponse.statusCode).toBe(201);
    const { attendeeId } = registerResponse.json();
    expect(attendeeId).toBeDefined();

  });

  test('não deve registrar um participante com e-mail já registrado para o evento', async () => {
    // Cria um evento e registra um participante
    const eventResponse = await app.inject({
      method: 'POST',
      url: '/events',
      payload: {
        title: "registrar um participante com sucesso 2",
        details: "Event Details",
        maximumAttendees: 10
      },
    });

    expect(eventResponse.statusCode).toBe(201);
    const { eventId } = eventResponse.json();

    await app.inject({
      method: 'POST',
      url: `/events/${eventId}/attendees`,
      payload: {
        name: "John Doe",
        email: "john.doe@example.com"
      },
    });

    // Tenta registrar o mesmo e-mail novamente
    const duplicateResponse = await app.inject({
      method: 'POST',
      url: `/events/${eventId}/attendees`,
      payload: {
        name: "Jane Doe",
        email: "john.doe@example.com"
      },
    });

    expect(duplicateResponse.statusCode).toBe(400);
    expect(duplicateResponse.json().message).toContain('This e-mail is already registered for this event.');
  });

  test('não deve registrar um participante quando o número máximo de participantes é alcançado', async () => {
    // Cria um evento com capacidade limitada
    const eventResponse = await app.inject({
      method: 'POST',
      url: '/events',
      payload: {
        title: "Event 1 people",
        details: "Event Details",
        maximumAttendees: 1
      },
    });

    expect(eventResponse.statusCode).toBe(201);
    const { eventId } = eventResponse.json();

    // Registra o primeiro participante
    await app.inject({
      method: 'POST',
      url: `/events/${eventId}/attendees`,
      payload: {
        name: "John Doe",
        email: "john.doe@example.com"
      },
    });

    // Tenta registrar outro participante
    const fullCapacityResponse = await app.inject({
      method: 'POST',
      url: `/events/${eventId}/attendees`,
      payload: {
        name: "Jane Doe",
        email: "jane.doe@example.com"
      },
    });

    expect(fullCapacityResponse.statusCode).toBe(400);
    expect(fullCapacityResponse.json().message).toContain('The maximum number of attendees for this event has been reached.');
  });

  test('não deve registrar um participante com dados inválidos', async () => {
    // Cria um evento
    const eventResponse = await app.inject({
      method: 'POST',
      url: '/events',
      payload: {
        title: "registrar um participante com sucesso 3",
        details: "Event Details",
        maximumAttendees: 10
      },
    });

    expect(eventResponse.statusCode).toBe(201);
    const { eventId } = eventResponse.json();

    // Tenta registrar um participante com e-mail inválido
    const invalidEmailResponse = await app.inject({
      method: 'POST',
      url: `/events/${eventId}/attendees`,
      payload: {
        name: "John Doe",
        email: "invalid-email"
      },
    });

    expect(invalidEmailResponse.statusCode).toBe(400);
    expect(invalidEmailResponse.json()).toEqual({
      message: "Error during validation",
      errors: {
          "email": [
              "Invalid email"
          ]
      }
    });

    // Tenta registrar um participante com nome muito curto
    const shortNameResponse = await app.inject({
      method: 'POST',
      url: `/events/${eventId}/attendees`,
      payload: {
        name: "Jon",
        email: "jon.doe@example.com"
      },
    });

    expect(shortNameResponse.statusCode).toBe(400);
  });

  test('não deve registrar um participante para um evento que não existe', async () => {
    // Tenta registrar um participante em um evento inexistente
    const nonExistentEventId = 'asdasdasd'; // Exemplo de UUID

    const nonExistentEventResponse = await app.inject({
      method: 'POST',
      url: `/events/${nonExistentEventId}/attendees`,
      payload: {
        name: "John Doe",
        email: "john.doe@example.com"
      },
    });

    expect(nonExistentEventResponse.statusCode).toBe(400);
    expect(nonExistentEventResponse.json().message).toContain('Error during validation');
  });
});
