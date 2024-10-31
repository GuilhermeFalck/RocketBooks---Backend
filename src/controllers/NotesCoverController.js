const AppError = require("../utils/AppError");
const knex = require("../database/knex");
const DiskStorage = require("../providers/DiskStorage");

class NotesCoverController {
  async create(request, response) {
    try {
      const note_id = request.params.id;

      // Verifica se o arquivo de imagem foi enviado
      if (!request.file) {
        throw new AppError("Arquivo de imagem não enviado", 400);
      }

      const coverFilename = request.file.filename;
      const diskStorage = new DiskStorage();

      // Verifica se a nota existe
      const note = await knex("notes").where({ id: note_id }).first();

      if (!note) {
        throw new AppError("Nota não encontrada", 404);
      }

      // Se já houver uma imagem, deleta a anterior
      if (note.image) {
        await diskStorage.deleteFile(note.image);
      }

      // Salva a nova imagem
      const filename = await diskStorage.saveFile(coverFilename);
      note.image = filename; // Atualiza o campo `image`

      // Atualiza a coluna `image` da nota no banco de dados
      await knex("notes").update({ image: filename }).where({ id: note_id });

      // Retorna a nota atualizada
      const updatedNote = await knex("notes").where({ id: note_id }).first();

      return response.json({
        message: "Imagem da capa adicionada com sucesso",
        note: updatedNote, // Retorna a nota atualizada
      });
    } catch (error) {
      console.error(error);
      throw new AppError("Erro ao processar a requisição", 500);
    }
  }
}

module.exports = NotesCoverController;
