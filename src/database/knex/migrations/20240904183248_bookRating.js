exports.up = (knex) => knex.schema.dropTableIfExists("rating"); // Remove a tabela rating

exports.down = (knex) =>
  knex.schema.createTable("rating", (table) => {
    table.increments("id");
    table.integer("rate").notNullable();

    table
      .integer("note_id")
      .references("id")
      .inTable("notes")
      .onDelete("CASCADE");

    table.timestamp("created_at").default(knex.fn.now());
  });
