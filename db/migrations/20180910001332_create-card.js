exports.up = (knex, Promise) => knex.schema.createTable('card', (table) => {
  table.increments();
  table.text('title');
  table.text('description');
  table.decimal('latitude', [8], [6]);
  table.decimal('longitude', [9], [6]);
});

exports.down = (knex, Promise) => knex.schema.dropTable('card');
