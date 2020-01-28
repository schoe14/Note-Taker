const fs = require("fs");
const util = require("util");

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

module.exports = function (app) {
    app.get("/api/notes", async function (req, res) {
        try {
            let noteData = await readFileAsync("./db/db.json", "utf8");
            console.log(`line 12: ${noteData}`)
            noteData = JSON.parse(noteData);
            res.json(noteData);
        }
        catch (e) {
            console.log(e);
        }
    });

    app.post("/api/notes", async function (req, res) {
        try {
            const data = await readFileAsync("./db/db.json", "utf8");
            let noteJSON = JSON.parse(data);
            noteJSON.push(req.body);
            // console.log(noteJSON);
            // noteJSON = JSON.stringify(noteJSON, null, 2);

            await writeFileAsync("./db/db.json", JSON.stringify(noteJSON, null, 2), "utf8");
            console.log("Successfully wrote to db.json file");
            res.json(noteJSON);

            // const newData = await require("../db/db.json");
            // res.json(newData);
        } catch (e) {
            console.log(e);
        }
    });

    app.delete("/api/notes/:id", async function (req, res) {
        try {
            const data = await readFileAsync("./db/db.json", "utf8");
            let noteJSON = JSON.parse(data);
            const chosen = req.params.id;
            console.log(`line 46: ${chosen}`);
            const deleted = noteJSON.findIndex(ele => ele.id == chosen);
            console.log(`line 48: ${deleted}`);

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