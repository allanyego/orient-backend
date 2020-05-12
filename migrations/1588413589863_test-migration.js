/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  const common = {
    address_number: {
      type: 'varchar(100)',
      notNull: true
    },
    address_code: {
      type: 'varchar(100)',
      notNull: true
    },
    address_town: {
      type: 'varchar(150)',
      notNull: true
    },
    phone_number: {
      type: 'varchar(10)',
      notNull: true
    },
  };

  pgm.createTable('admins', {
    id: 'id',
    first_name: {
      type: 'varchar(50)',
      notNull: true
    },
    last_name: {
      type: 'varchar(50)',
      notNull: true
    },
    middle_name: {
      type: 'varchar(50)'
    },
    id_number: {
      type: 'varchar(200)',
      notNull: true
    },
    email: {
      type: 'varchar(150)',
      notNull: true,
    },
    password: {
      type: 'varchar(40)',
      notNull: true,
      default: 'password'
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    ...common
  });

  pgm.createTable('clients', {
    id: 'id',
    first_name: {
      type: 'varchar(50)',
      notNull: true
    },
    last_name: {
      type: 'varchar(50)',
      notNull: true
    },
    middle_name: {
      type: 'varchar(50)'
    },
    id_number: {
      type: 'varchar(200)',
      notNull: true
    },
    kra_pin: {
      type: 'varchar(20)',
      notNull: true
    },
    email: {
      type: 'varchar(150)',
      notNull: true,
    },
    occupation: {
      type: 'varchar(30)',
      notNull: true,
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    ...common
  });

  pgm.createTable('insurers', {
    id: 'id',
    name: {
      type: 'varchar(150)',
      notNull: true
    },
    ...common,
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    }
  });

  pgm.createTable('policies', {
    id: 'id',
    insurer: {
      type: 'integer',
      notNull: true,
      references: '"insurers"',
      onDelete: 'cascade'
    },
    client: {
      type: 'integer',
      notNull: true,
      references: '"clients"',
      onDelete: 'cascade'
    },
    policy_number: {
      type: 'varchar(100)',
      notNull: true
    },
    policy_period_start: {
      type: 'timestamp',
      notNull: true
    },
    policy_period_end: {
      type: 'timestamp',
      notNull: true
    },
    sum_insured: {
      type: 'float',
      notNull: true
    },
    premium_rate: {
      type: 'float',
      notNull: true
    },
    pvt: {
      type: 'float',
      notNull: true
    },
    excess_protection: {
      type: 'boolean',
      notNull: true,
      default: false
    },
    anti_theft_coverage: {
      type: 'boolean',
      notNull: true,
      default: false
    },
    rookie: {
      type: 'boolean',
      notNull: true,
      default: false
    },
    passengers_pll_coverage: {
      type: 'boolean',
      notNull: true,
      default: false
    },
    approved: {
      type: 'boolean',
      notNull: true,
      default: false
    },
    policy_class: {
      type: 'varchar(20)',
      notNull: true,
    },
    type: {
      type: 'varchar(20)',
      notNull: true,
      default: 'new'
    },
    date_applied: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    date_approved: {
      type: 'timestamp',
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    }
  });

  pgm.createTable('vehicles', {
    id: 'id',
    policy: {
      type: 'integer',
      notNull: true,
      references: '"policies"',
      onDelete: 'cascade'
    },
    registration_number: {
      type: 'varchar(15)',
      notNull: true
    },
    make: {
      type: 'varchar(50)',
      notNull: true
    },
    body_type: {
      type: 'varchar(50)',
      notNull: true
    },
    body_color: {
      type: 'varchar(120)',
      notNull: true,
    },
    manufacture_year: {
      type: 'timestamp',
      notNull: true
    },
    chasis_number: {
      type: 'varchar(50)',
      notNull: true
    },
    engine_number: {
      type: 'varchar(50)',
      notNull: true
    },
    rating_cc: {
      type: 'varchar(50)',
      notNull: true
    },
    tonnage: {
      type: 'varchar(50)',
      notNull: true
    },
  });
};

exports.down = pgm => {
  pgm.dropTable('admins', {
    cascade: true
  });

  pgm.dropTable('clients', {
    cascade: true
  });

  pgm.dropTable('insurers', {
    cascade: true
  });

  pgm.dropTable('policies', {
    cascade: true
  });

  pgm.dropTable('vehicles', {
    cascade: true
  });
};
