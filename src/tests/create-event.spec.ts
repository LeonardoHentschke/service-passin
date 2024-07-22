import fastify from 'fastify';
import request from 'supertest';
import { prisma } from '../lib/prisma';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { createEvent } from '../routes/create-event';

const app = fastify().withTypeProvider<ZodTypeProvider>();
app.register(createEvent);

describe('POST /events', () => {
  let server: any;

  beforeAll(async () => {
    // Prepare the database
    await prisma.$executeRaw`TRUNCATE TABLE events CASCADE;`;

    // Start the server
    server = await app.listen({ port: 0 }); // Listen on an ephemeral port
  });

  afterAll(async () => {
    // Clean up database and stop server
    await prisma.$disconnect();
    await app.close(); // Ensure the server is properly closed
  });

  it('Deve criar um evento com sucesso', async () => {
    const response = await request(server)
      .post('/events')
      .send({
        title: "New Event",
        details: "Details of the new event",
        maximumAttendees: 100,
      })
      .expect(201);

    expect(response.body).toEqual({
      eventId: expect.any(String),
    });

    const event: any = await prisma.event.findUnique({
      where: { id: response.body.eventId },
    });

    expect(event).not.toBeNull();
    expect(event.title).toBe('New Event');
    expect(event.details).toBe('Details of the new event');
    expect(event.maximumAttendees).toBe(100);
  });
/*
  it('Não deve permitir criar um evento com título duplicado', async () => {
    const response = await request(server)
      .post('/events')
      .send({
        title: 'Duplicate Event',
        details: 'Different details',
        maximumAttendees: "30",
      })
      .expect(400);

    expect(response.body).toEqual({
      message: 'Another event with same title already exists.',
    });
  });
*/
});
