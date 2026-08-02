import { pgTable, bigint, primaryKey } from 'drizzle-orm/pg-core';
import { tasks } from './tasks';
import { labels } from './labels';

export const taskLabels = pgTable(
  'task_labels',
  {
    task_id: bigint('task_id', { mode: 'number' })
      .notNull()
      .references(() => tasks.id, { onDelete: 'restrict' }),
    label_id: bigint('label_id', { mode: 'number' })
      .notNull()
      .references(() => labels.id, { onDelete: 'restrict' }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.task_id, t.label_id] }),
  })
);
