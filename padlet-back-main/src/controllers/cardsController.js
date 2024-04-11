const connect = require("../db");
const { getUserFromToken } = require("./usersController");
const fs = require("fs").promises;
const path = require("path");

const index = async (req, res) => {
    const user = getUserFromToken(req.headers["token"]);
    const spaceId = req.params.id
    const conn = await connect();

    const [result] = await conn.query(
        "SELECT * FROM cards WHERE spaceId = ?",
        [spaceId]
    );

    return res.json({
        data: result,
    });
}


const store = async (req, res) => {
    // const user = getUserFromToken(req.headers["token"]);
    const spaceId = req.params.id
    const conn = await connect();
    const { title,  description } = req.body
    const file = req.files.file
    const timestamp = Date.now();

    const filePath = `${__dirname}/../uploads/${timestamp}_${file.name}`;
    await file.mv(filePath)

    const [result] = await conn.query('INSERT INTO cards (title, description, file, spaceId) VALUES (?, ?, ?, ?)', [title, description, filePath, spaceId]);
    const [newSpace] = await conn.query('SELECT * FROM cards WHERE id = ?', [result.insertId]);

    res.json({
        data: newSpace[0]
    })
}

const card = async (req, res) => {
    const cardId = req.params.id
    const conn = await connect();
console.log(`Card ${cardId}`)
    const [result] = await conn.query(
        "SELECT * FROM cards WHERE id = ?",
        [cardId]
    );

    return res.json({
        data: result,
    });

}

const cardFile = async (req, res) => {
    const cardId = req.params.id;
    const conn = await connect();

    const [result] = await conn.query(
        "SELECT file FROM cards WHERE id = ?",
        [cardId]
    );

    if (result.length > 0) {
        const relativeFilePath = result[0].file;
        const absoluteFilePath = path.resolve(__dirname, '../uploads/', relativeFilePath);
        res.sendFile(absoluteFilePath);
    } else {
        res.status(404).json({ message: 'File not found' });
    }
};

const destroy = async (req, res) => {
    const spaceId = req.params.spaceId;
    const cardId = req.params.cardId;
    const conn = await connect();

    const [card] = await conn.query("SELECT * FROM cards WHERE id = ? AND spaceId = ?", [cardId, spaceId]);

    if (card.length === 0) {
        return res.status(404).json({ message: 'Card not found or does not belong to the specified space' });
    }

    await conn.query("DELETE FROM cards WHERE id = ?", [cardId]);

    res.status(200).json({ message: 'Card deleted successfully' });
};



module.exports = {
    index,
    store,
    card,
    cardFile,
    destroy
}
