const connect = require("../db");
const { getUserFromToken } = require("./usersController");

const index = async (req, res) => {
    const user = getUserFromToken(req.headers["token"]);
    const conn = await connect();

    const [result] = await conn.query(
        "SELECT * FROM spaces WHERE userId = ?",
        [user.id]
    );

    return res.json({
        data: result,
    });
}

const store = async (req, res) => {
    const user = getUserFromToken(req.headers["token"]);
    const conn = await connect();
    const { name } = req.body

    const [result] = await conn.query('INSERT INTO spaces (userId, name) VALUES (?, ?)', [user.id, name]);
    const [newSpace] = await conn.query('SELECT * FROM spaces WHERE id = ?', [result.insertId]);

    res.json({
        data: newSpace[0]
    })
}


module.exports = {
    index,
    store
}
