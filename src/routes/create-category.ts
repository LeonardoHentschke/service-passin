import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../lib/prisma"
import { FastifyInstance } from "fastify"

export async function createCategory(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post('/category', {
      schema: {
        summary: 'Create an category',
        tags: ['category'],
        body: z.object({
          name: z.string(),
        }),
        response: {
          201: z.object({
            name: z.string(),
          })
        },
      },
    }, async (request, reply) => {
      const {
        name,
      } = request.body

      const category = await prisma.category.create({
        data: {
          name,
        },
      })

      return reply.status(201).send(category)
    })
}
