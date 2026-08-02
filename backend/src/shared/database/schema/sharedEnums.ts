import { pgEnum } from 'drizzle-orm/pg-core';

export const systemRoleEnum = pgEnum('system_role', [
  'Admin',
  'Manager',
  'Member',
]);

export const projectRoleEnum = pgEnum('project_role', [
  'Lead',
  'Developer',
  'Tester',
  'Viewer',
]);

export const projectStatusEnum = pgEnum('project_status', [
  'Draft',
  'To Be Initiated',
  'Active',
  'On Hold',
  'Archived',
]);

export const projectEnvironmentEnum = pgEnum('project_environment', [
  'Development',
  'UAT',
  'Live',
]);

export const taskStatusEnum = pgEnum('task_status', [
  'Todo',
  'In Progress',
  'Blocked',
  'Review',
  'Done',
]);

export const taskPriorityEnum = pgEnum('task_priority', [
  'Low',
  'Medium',
  'High',
  'Critical',
]);
