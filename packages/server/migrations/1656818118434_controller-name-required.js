exports.up = (pgm) => {
  pgm.renameColumn('controller', 'friendly_name', 'name');
  pgm.alterColumn('controller', 'name', {
    notNull: true,
    default: 'DEFAULT CONTROLLER NAME',
  });
};

exports.down = (pgm) => {
  pgm.renameColumn('controller', 'name', 'friendly_name');
  pgm.alterColumn('controller', 'name', {
    notNull: false,
  });
};
