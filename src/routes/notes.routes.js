const { Router } = require("express");
const multer = require("multer");
const uploadConfig = require("../configs/upload");

const NotesController = require("../controllers/NotesController");
const NotesCoverController = require("../controllers/NotesCoverController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const notesRoutes = Router();
const upload = multer(uploadConfig.MULTER);

const notesController = new NotesController();
const notesCoverController = new NotesCoverController(); // Instancia o NotesCoverController

notesRoutes.use(ensureAuthenticated);

notesRoutes.get("/", notesController.index);
notesRoutes.post("/", notesController.create);
notesRoutes.get("/:id", notesController.show);
notesRoutes.delete("/:id", notesController.delete);

// Ajusta a rota para receber o ID da nota como parâmetro
notesRoutes.post(
  "/:id/cover",
  ensureAuthenticated,
  upload.single("cover"),
  notesCoverController.create
);

module.exports = notesRoutes;
