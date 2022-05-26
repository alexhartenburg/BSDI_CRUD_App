/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = function(knex) {
    return knex.schema.createTable("posts", (table) => {
        table.increments("id");
        table.integer("user_id", 50);
        table.foreign("user_id").references("users.id");
        table.string("title", 50);
        table.string("content", 50);
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema
    .alterTable("posts", (table) => {
      table.dropForeign("user_id");
    })
    .then(function () {
      return knex.schema.dropTableIfExists("posts");
    });
};
