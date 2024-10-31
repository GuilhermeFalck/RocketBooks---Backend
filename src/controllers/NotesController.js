const knex = require("../database/knex");

class NotesController {
  async create(request, response) {
    const { title, description, tags, rating } = request.body;
    const user_id = request.user.id;

    // Verifica se o rating é um valor válido e converte para número, ou usa 0 como valor padrão
    const validatedRating =
      rating !== undefined && rating !== null ? parseFloat(rating) : 0;

    // Cria a nota com o rating diretamente na tabela notes
    const [note_id] = await knex("notes").insert({
      title,
      description,
      user_id,
      image: null, // A imagem será tratada em outra requisição
      rating: validatedRating, // Insere o rating diretamente na tabela notes
    });

    // Ajuste para as tags
    const tagsInsert =
      Array.isArray(tags) && tags.length > 0
        ? tags.map((name) => ({
            note_id,
            name,
            user_id,
          }))
        : [];

    if (tagsInsert.length > 0) {
      await knex("tags").insert(tagsInsert);
    }

    return response.json({ message: "Note created successfully", id: note_id });
  }

  async show(request, response) {
    const { id } = request.params;

    // Busca a nota com seu rating diretamente da tabela notes
    const note = await knex("notes").where({ id }).first();
    const tags = await knex("tags").where({ note_id: id }).orderBy("name");

    return response.json({
      ...note,
      tags,
    });
  }

  async delete(request, response) {
    const { id } = request.params;

    await knex("notes").where({ id }).delete();

    return response.json();
  }

  async index(request, response) {
    const { title, tags } = request.query;
    const user_id = request.user.id;

    let notes;

    if (tags) {
      const filterTags = tags.split(",").map((tag) => tag.trim());

      notes = await knex("tags")
        .select(["notes.id", "notes.title", "notes.user_id", "notes.rating"])
        .where("notes.user_id", user_id)
        .whereLike("notes.title", `%${title}%`)
        .whereIn("name", filterTags)
        .innerJoin("notes", "notes.id", "tags.note_id")
        .groupBy("notes.id")
        .orderBy("notes.title");
    } else {
      notes = await knex("notes")
        .where({ user_id })
        .whereLike("title", `%${title}%`)
        .orderBy("title");
    }

    const userTags = await knex("tags").where({ user_id });
    const notesWithTags = notes.map((note) => {
      const noteTags = userTags.filter((tag) => tag.note_id === note.id);

      return {
        ...note,
        tags: noteTags,
      };
    });

    return response.json(notesWithTags);
  }
}

module.exports = NotesController;
