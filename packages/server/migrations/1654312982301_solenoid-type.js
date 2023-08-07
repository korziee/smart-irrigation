exports.up = (pgm) => {
  pgm.renameTypeValue('solenoid_control_mode', 'manual', 'physical');
  pgm.addTypeValue('solenoid_control_mode', 'client');
};

exports.down = (pgm) => {
  // hard to modify enums
};
