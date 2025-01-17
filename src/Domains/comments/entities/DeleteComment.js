class DeleteComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const { threadId, id, owner } = payload;
    this.threadId = threadId;
    this.id = id;
    this.owner = owner;
  }

  _verifyPayload({ threadId, id, owner }) {
    if (!threadId || !id || !owner) {
      throw new Error("DELETE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (typeof threadId !== "string" || typeof id !== "string" || typeof owner !== "string") {
      throw new Error("DELETE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = DeleteComment;
