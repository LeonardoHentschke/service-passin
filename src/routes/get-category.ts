import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../lib/prisma";

export async function getCategory(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get('/category', {
      schema: {
        summary: 'Get an category',
        tags: ['category'],
      }
    }, async (request, reply) => {

      const categories = await prisma.category.findMany();

      return reply.send(categories)
    })
}