/* eslint-disable @typescript-eslint/naming-convention */
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.renameColumn('controller', 'friendly_name', 'name');
  pgm.alterColumn('controller', 'name', {
    notNull: true,
    default: 'DEFAULT CONTROLLER NAME',
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.renameColumn('controller', 'name', 'friendly_name');
  pgm.alterColumn('controller', 'name', {
    notNull: false,
  });
}
