const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const ThreadRepository = require("../../Domains/threads/ThreadRepository");

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(payload) {
    const { title, body, owner } = payload;
    const id = `thread-${this._idGenerator()}`;

    const query = {
      text: "INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING id, title, owner",
      values: [id, title, body, owner],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }

  async verifyAvailableThread(id) {
    const query = {
      text: "SELECT * FROM threads WHERE id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError("Thread tidak ditemukan");
    }
  }

  async getThread(id) {
    const query = {
      text: `SELECT 
  threads.id AS id,
  threads.title AS title,
  threads.body AS body,
  threads.date AS date,
  users.username AS username, 
  comments.id AS comment_id,
  comments.content AS comment_content,
  comments.date AS comment_date,
  comments."isDelete",
  comment_users.username AS comment_username
FROM threads
JOIN users ON threads.owner = users.id
LEFT JOIN comments ON comments."threadId" = threads.id
LEFT JOIN users AS comment_users ON comments.owner = comment_users.id
WHERE threads.id = $1;
`,
      values: [id],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }
}

module.exports = ThreadRepositoryPostgres;
