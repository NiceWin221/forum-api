const AddedComment = require("../AddedComment");

describe("AddedComment entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    const payload = {
      content: "pagi juga",
      owner: "user-123",
    };

    expect(() => new AddedComment(payload)).toThrowError("ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY");
  });

  it("should throw error when payload did not meet data type specification", () => {
    const payload = {
      content: 123,
      owner: true,
      id: "comment-123",
    };

    expect(() => new AddedComment(payload)).toThrowError("ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION");
  });

  it("should create addedComment object correctly", () => {
    const payload = {
      content: "pagi juga",
      owner: "user-123",
      id: "comment-123",
    };

    const { content, owner, id } = new AddedComment(payload);

    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
    expect(id).toEqual(payload.id);
  });
});
