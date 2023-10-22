exports.up = (pgm) => {
  pgm.createTable('controller_battery_reading', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    controller_id: {
      type: 'uuid',
      notNull: true,
      references: 'controller',
      onDelete: 'CASCADE',
    },
    volts: {
      type: 'double precision',
      notNull: true,
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('now()'),
    },
  });

  pgm.addColumns('config', {
    battery_voltage_update_interval_ms: {
      type: 'integer',
      notNull: true,
      default: 60000,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('controller_battery_reading');
};
