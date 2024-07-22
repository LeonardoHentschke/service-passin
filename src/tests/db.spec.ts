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

  it('Tabela de eventos deve ter as colunas corretas', async () => {
    const result = await prisma.$queryRaw<{ column_name: string }[]>`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = 'public'
      AND table_name = 'events';
    `;
    
    const columnNames = result.map(row => row.column_name);
    
    expect(columnNames).toContain('id');
    expect(columnNames).toContain('title');
    expect(columnNames).toContain('details');
    expect(columnNames).toContain('slug');
    expect(columnNames).toContain('maximum_attendees');
  });

  it('Tabela de participantes deve ter as colunas corretas', async () => {
    const result = await prisma.$queryRaw<{ column_name: string }[]>`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = 'public'
      AND table_name = 'attendees';
    `;
    
    const columnNames = result.map(row => row.column_name);
    
    expect(columnNames).toContain('id');
    expect(columnNames).toContain('name');
    expect(columnNames).toContain('email');
    expect(columnNames).toContain('created_at');
    expect(columnNames).toContain('event_id');
  });

  it('Tabela de check-ins deve ter as colunas corretas', async () => {
    const result = await prisma.$queryRaw<{ column_name: string }[]>`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = 'public'
      AND table_name = 'check_ins';
    `;
    
    const columnNames = result.map(row => row.column_name);
    
    expect(columnNames).toContain('id');
    expect(columnNames).toContain('created_at');
    expect(columnNames).toContain('attendee_id');
  });

});
