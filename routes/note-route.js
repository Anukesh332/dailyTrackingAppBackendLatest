const { Router } = require("express");
let router = Router();
const { NoteService } = require("../services/note-service");
const { errorLog } = require("../services/error-log-service");
const constants = require("../constants");
const fetchUserData = require("../middleware/fetchUserData");
// const multer = require('multer');
// const path = require('path');

let noteSvc = new NoteService();

// const storage = multer.diskStorage({
//   destination: './uploads/',
//   filename: function (req, file, cb) {
//     cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//   }
// });

// const upload = multer({ storage: storage }).single('image');
// const uploadsDirectory = path.join(__dirname, 'uploads');

// router.post('/upload', (req, res) => {
//   upload(req, res, (err) => {
//     if (err) {
//       console.error(err);
//       return res.status(constants.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
//     }
//     if (!req.file) {
//       return res.status(constants.NOT_FOUND).json({ error: 'No file uploaded' });
//     }
//     return res.status(constants.SUCCESS).json({ filename: req.file.filename });
//   });
// });

// router.get('/user/image/:filename', (req, res) => {
//   const { filename } = req.params;
//   const imagePath = path.join(uploadsDirectory, filename);

//   res.sendFile(imagePath);
// });


router.post("/addNote", fetchUserData, async (req, res) => {
  try {
    let PK = req.SK;
    let inputData = req.body;
    let notedata = await noteSvc.addNote(PK, inputData);
    if (notedata) {
      res.status(constants.SUCCESS).json({ "Message": !inputData.ModifiedOn ? "Note added successfully." : "Note updated successfully." });
    };
  } catch (err) {
    errorLog(req, err, res);
  }
});

router.get("/getUserNotes", fetchUserData, async (req, res) => {
  try {
    let PK = req.SK;
    let notedata = await noteSvc.getUserNotes(PK);
    if (notedata) {
      res.status(constants.SUCCESS).json(notedata);
    };
  } catch (err) {
    errorLog(req, err, res);
  }
});

router.post("/deleteNote", fetchUserData, async (req, res) => {
  try {
    let PK = req.SK;
    let inputNoteData = req.body;
    let noteObj = await noteSvc.deleteNote(PK, inputNoteData);
    if (noteObj) {
      res.status(constants.SUCCESS).json({ "Message": "You have deleted Note Successfully" });
    }
  } catch (err) {
    errorLog(req, err, res);
  }
});

module.exports = router;