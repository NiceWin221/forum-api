const DeleteComment = require("../DeleteComment");

describe("DeleteComment entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    const payload = {
      id: "comment-123",
      threadId: "thread-123",
    };

    expect(() => new DeleteComment(payload)).toThrowError("DELETE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY");
  });

  it("should throw error when payload did not meet data type specification", () => {
    const payload = {
      id: 123,
      threadId: true,
      owner: "user-123",
    };

    expect(() => new DeleteComment(payload)).toThrowError("DELETE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION");
  });

  it("should create deleteComment object correctly", () => {
    const payload = {
      id: "comment-123",
      threadId: "thread-123",
      owner: "user-123",
    };

    const { id, threadId, owner } = new DeleteComment(payload);

    expect(id).toEqual(payload.id);
    expect(threadId).toEqual(payload.threadId);
    expect(owner).toEqual(payload.owner);
  });
});
