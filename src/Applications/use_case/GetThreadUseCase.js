const GettedThread = require("../../Domains/threads/entities/GettedThread");

class GetThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(id) {
    await this._threadRepository.verifyAvailableThread(id);
    const getThread = await this._threadRepository.getThread(id);
    const thread = {
      id: getThread[0].id,
      title: getThread[0].title,
      body: getThread[0].body,
      date: getThread[0].date,
      username: getThread[0].username,
      comments: getThread
        .filter((row) => row.comment_id)
        .map((row) => ({
          id: row.comment_id,
          username: row.comment_username,
          date: row.comment_date,
          content: row.isDelete ? "**komentar telah dihapus**" : row.comment_content,
        })),
    };

    return new GettedThread(thread);
  }
}

module.exports = GetThreadUseCase;
