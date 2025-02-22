const AddComment = require("../AddComment");

describe("AddComment entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    const payload = {
      content: "pagi juga",
      threadId: "thread-123",
    };

    expect(() => new AddComment(payload)).toThrowError("ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY");
  });

  it("should throw error when payload did not meet data type specification", () => {
    const payload = {
      content: 123,
      threadId: true,
      owner: "user-123",
    };

    expect(() => new AddComment(payload)).toThrowError("ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION");
  });

  it("should create addComment object correctly", () => {
    const payload = {
      content: "pagi juga",
      threadId: "thread-123",
      owner: "user-123",
    };

    const { content, threadId, owner } = new AddComment(payload);

    expect(content).toEqual(payload.content);
    expect(threadId).toEqual(payload.threadId);
    expect(owner).toEqual(payload.owner);
  });
});
