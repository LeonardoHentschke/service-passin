import { prisma } from "../lib/prisma";

describe('Teste do Banco de Dados', () => {
  it('Deve existir uma tabela de eventos', async () => {
    const result = await prisma.$queryRaw<{ exists: boolean }[]>`
      SELECT EXISTS (
        SELECT 1
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'events'
      ) AS exists;
    `;
    expect(result[0].exists).toBe(true);
  });

  it('Deve existir uma tabela de participantes', async () => {
    const result = await prisma.$queryRaw<{ exists: boolean }[]>`
      SELECT EXISTS (
        SELECT 1
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'attendees'
      ) AS exists;
    `;
    expect(result[0].exists).toBe(true);
  });

  it('Deve existir uma tabela de check-ins', async () => {
    const result = await prisma.$queryRaw<{ exists: boolean }[]>`
      SELECT EXISTS (
        SELECT 1
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'check_ins'
      ) AS exists;
    `;
    expect(result[0].exists).toBe(true);
  });
});
