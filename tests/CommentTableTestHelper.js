const pool = require("../src/Infrastructures/database/postgres/pool");

const CommentTableTestHelper = {
  async addComment({ content = "pagi juga", owner = "user-123", threadId = "thread-123", id = "comment-123" }) {
    const query = {
      text: "INSERT INTO comments VALUES($1, $2, $3, $4) RETURNING *",
      values: [id, owner, threadId, content],
    };

    await pool.query(query);
  },

  async findCommentById(id) {
    const query = {
      text: "SELECT * FROM comments WHERE id = $1",
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows[0];
  },

  async deleteComment(id) {
    const query = {
      text: 'UPDATE comments SET "isDelete" = true WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rowCount;
  },

  async cleanTable() {
    await pool.query("DELETE FROM comments");
  },
};

module.exports = CommentTableTestHelper;
