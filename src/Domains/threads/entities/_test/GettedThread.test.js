const GettedThread = require("../GettedThread");

describe("GettedThread entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    const payload = {
      id: "thread-123",
      title: "pagi",
      body: "selamat pagi",
      date: "12 january 2025",
    };

    expect(() => new GettedThread(payload)).toThrowError("GETTED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY");
  });

  it("should throw error when payload did not meet data type specification", () => {
    const payload = {
      id: 123,
      title: true,
      body: "selamat pagi",
      date: "12 january 2025",
      username: "windy",
    };

    expect(() => new GettedThread(payload)).toThrowError("GETTED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION");
  });

  it("should create gettedThread object correctly", () => {
    const payload = {
      id: "thread-123",
      title: "pagi",
      body: "selamat pagi",
      date: "12 january 2025",
      username: "dicoding",
      comments: {
        id: "comment-123",
        username: "john",
        date: "13 january 2025",
        content: "pagi juga",
      },
    };

    const { id, title, body, date, username, comments } = new GettedThread(payload);

    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(date).toEqual(payload.date);
    expect(username).toEqual(payload.username);
    expect(comments).toEqual(payload.comments);
  });

  it("should set comments to an empty array when comments property is not provided", () => {
    const payload = {
      id: "thread-123",
      title: "pagi",
      body: "selamat pagi",
      date: "12 january 2025",
      username: "dicoding",
    };

    const { comments } = new GettedThread(payload);

    expect(comments).toEqual([]);
  });
});
