const pool = require("../src/Infrastructures/database/postgres/pool");

const ThreadsTableTestHelper = {
  async addThread({ id = "thread-123", title = "pagi", body = "selamat pagi", owner = "user-123" }) {
    const query = {
      text: "INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING *",
      values: [id, title, body, owner],
    };

    await pool.query(query);
  },

  async findThreadById(id) {
    const query = {
      text: "SELECT * FROM threads WHERE id = $1",
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows[0]
  },

  async cleanTable() {
    await pool.query("DELETE FROM threads");
  },
};

module.exports = ThreadsTableTestHelper;
