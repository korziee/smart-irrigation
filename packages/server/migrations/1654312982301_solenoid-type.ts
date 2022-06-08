/* eslint-disable @typescript-eslint/naming-convention */
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.renameTypeValue('solenoid_control_mode', 'manual', 'physical');
  pgm.addTypeValue('solenoid_control_mode', 'client');
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  // hard to modify enums
}
