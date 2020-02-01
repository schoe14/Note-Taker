const fs = require("fs");
const util = require("util");

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

module.exports = function (app) {
    // Reads db.json and display to /api/notes
    app.get("/api/notes", async function (req, res) {
        try {
            let noteData = await readFileAsync("./db/db.json", "utf8");
            noteData = JSON.parse(noteData);
            res.json(noteData);
        }
        catch (e) {
            console.log(e);
        }
    });

    // If new note is added, update db.json to reflect the new data
    app.post("/api/notes", async function (req, res) {
        try {
            const data = await readFileAsync("./db/db.json", "utf8");
            let noteJSON = JSON.parse(data);
            noteJSON.push(req.body);

            await writeFileAsync("./db/db.json", JSON.stringify(noteJSON, null, 2), "utf8");
            console.log("Successfully wrote to db.json file");
            res.json(noteJSON);
        } catch (e) {
            console.log(e);
        }
    });

    // Finds unique id given to decide which data should be removed
    // Assigns new unique id after deletion and writes to db.json
    app.delete("/api/notes/:id", async function (req, res) {
        try {
            const data = await readFileAsync("./db/db.json", "utf8");
            let noteJSON = JSON.parse(data);
            const chosen = req.params.id;
            const deleted = noteJSON.findIndex(ele => ele.id == chosen);

            noteJSON.splice(deleted, 1);
            noteJSON.map((note, i) => {
                note.id = i + 1;
            });

            await writeFileAsync("./db/db.json", JSON.stringify(noteJSON, null, 2), "utf8");
            console.log("Successfully wrote to db.json file");
            res.json(noteJSON);
        } catch (e) {
            console.log(e);
        }
    });
};