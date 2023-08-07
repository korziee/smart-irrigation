exports.up = (pgm) => {
  pgm.addColumns('solenoid', {
    name: {
      type: 'varchar(50)',
      default: 'DEFAULT',
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn('solenoid', 'name');
};
