const AddThread = require("../AddThread");

describe("AddThread entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    const payload = {
      title: "pagi",
      body: "selamat pagi",
    };

    expect(() => new AddThread(payload)).toThrowError("ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY");
  });

  it("should throw error when payload did not meet data type specification", () => {
    const payload = {
      title: 221,
      body: true,
      owner: "user-123",
    };

    expect(() => new AddThread(payload)).toThrowError("ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION");
  });

  it("should create addThread object correctly", () => {
    const payload = {
      title: "pagi",
      body: "selamat pagi",
      owner: "user-123",
    };

    const { title, body, owner } = new AddThread(payload);

    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(owner).toEqual(payload.owner);
  });
});
