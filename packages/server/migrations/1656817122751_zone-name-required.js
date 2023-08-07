exports.up = (pgm) => {
  pgm.alterColumn('zone', 'name', {
    notNull: true,
    default: 'DEFAULT ZONE NAME',
  });
};

exports.down = (pgm) => {
  pgm.alterColumn('zone', 'name', {
    notNull: false,
  });
};
