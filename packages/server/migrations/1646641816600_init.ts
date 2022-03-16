/* eslint-disable @typescript-eslint/naming-convention */
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createType('sensor_type', ['moisture']);
  pgm.createType('solenoid_control_mode', ['auto', 'manual']);

  pgm.createTable('config', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    soil_sensor_update_interval_ms: {
      type: 'integer',
      notNull: true,
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('now()'),
    },
  });

  pgm.createTable('controller', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    friendly_name: {
      type: 'varchar(255)',
    },
    ip_address: {
      type: 'varchar(15)',
    },
    online: {
      type: 'boolean',
      notNull: true,
      default: false,
    },
    last_boot: {
      type: 'timestamp',
    },
    config_id: {
      type: 'uuid',
      notNull: true,
      references: 'config',
      onDelete: 'RESTRICT',
    },
  });

  pgm.createTable('zone', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    name: {
      type: 'varchar(50)',
    },
    controller_id: {
      type: 'uuid',
      references: 'controller',
      onDelete: 'SET NULL',
    },
  });

  pgm.createTable('sensor', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    type: {
      type: 'sensor_type',
      notNull: true,
    },
    zone_id: {
      type: 'uuid',
      notNull: true,
      references: 'zone',
      onDelete: 'CASCADE',
    },
  });

  pgm.createTable('sensor_reading', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    sensor_id: {
      type: 'uuid',
      notNull: true,
      references: 'sensor',
      onDelete: 'CASCADE',
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('now()'),
    },
    reading: {
      type: 'double precision',
      notNull: true,
    },
  });

  pgm.createTable('solenoid', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    zone_id: {
      type: 'uuid',
      notNull: true,
      references: 'zone',
      onDelete: 'CASCADE',
    },
    open: {
      type: 'boolean',
      notNull: true,
      default: false,
    },
    control_mode: {
      type: 'solenoid_control_mode',
      notNull: true,
      default: 'auto',
    },
  });

  pgm.createTable('irrigation_job', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    zone_id: {
      type: 'uuid',
      notNull: true,
      references: 'zone',
      onDelete: 'CASCADE',
    },
    active: {
      type: 'boolean',
      notNull: true,
    },
    start: {
      type: 'timestamp',
      notNull: true,
    },
    end: {
      type: 'timestamp',
      notNull: true,
    },
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  //
}
