exports.up = (knex, Promise) => Promise.all([
  knex.schema.createTable('cards', (table) => {
    table.increments('id').primary();
    table.text('title');
    table.text('description');
    table.decimal('latitude', [8], [6]);
    table.decimal('longitude', [9], [6]);
  }),
  knex.schema.createTable('cards_hashtags', (table) => {
    table.increments('id').primary();
    table.integer('cards_id').references('cards.id');
    table.integer('hashtags_id').references('hashtags.id');
  }),
  knex.schema.createTable('hahstags', (table) => {
    table.increments('id').primary();
    table.text('hashtag');
  }),
]);

exports.down = (knex, Promise) => Promise.all([
  knex.schema.dropTable('card'),
  knex.schema.dropTable('cards_hashtags'),
  knex.schema.dropTable('hashtags'),
]);
