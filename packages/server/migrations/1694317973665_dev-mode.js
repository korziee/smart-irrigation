exports.up = (pgm) => {
  pgm.addColumns('config', {
    dev_mode: {
      type: 'boolean',
      default: 'false',
      notNull: true,
    },
    dev_mode_ip_address: {
      type: 'varchar(15)',
    },
  });

  pgm.addConstraint(
    'config',
    'require_ip_for_dev_mode',
    'check ((dev_mode = true and dev_mode_ip_address is not null) or (dev_mode = false))',
  );
};

exports.down = (pgm) => {
  pgm.dropColumn('config', 'dev_mode');
  pgm.dropColumn('config', 'dev_mode_ip_address');
  pgm.dropConstraint('config', 'require_ip_for_dev_mode');
};
