const CommentTableTestHelper = require("../../../../tests/CommentTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const AddedThread = require("../../../Domains/threads/entities/AddedThread");
const AddThread = require("../../../Domains/threads/entities/AddThread");
const pool = require("../../database/postgres/pool");
const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");

describe("ThreadRepositoryPostgres", () => {
  beforeEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentTableTestHelper.cleanTable();
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await CommentTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("verifyAvailableThread function", () => {
    it("should throw error when thread not found", async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await expect(threadRepositoryPostgres.verifyAvailableThread("thread-123")).rejects.toThrowError(NotFoundError);
    });

    it("should not throw error when thread found", async () => {
      const user = { id: "user-123", username: "dicoding", password: "secret", fullname: "Dicoding Indonesia" };
      await UsersTableTestHelper.addUser(user);

      const thread = { id: "thread-123", title: "pagi", body: "selamat pagi", owner: "user-123" };
      await ThreadsTableTestHelper.addThread(thread);

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await expect(threadRepositoryPostgres.verifyAvailableThread(thread.id)).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe("addThread function", () => {
    it("should persist thread and return added thread correctly", async () => {
      const user = { id: "user-123", username: "dicoding", password: "secret", fullname: "Dicoding Indonesia" };
      await UsersTableTestHelper.addUser(user);

      // Arrange
      const thread = { title: "pagi", body: "selamat pagi", owner: "user-123" };
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, () => `123`);
      const newThread = new AddThread(thread);

      // Action
      const addedThreadData = await threadRepositoryPostgres.addThread(newThread);
      const threadInDatabase = await ThreadsTableTestHelper.findThreadById(addedThreadData.id);

      // Assert
      expect(addedThreadData).toBeDefined();
      expect(addedThreadData.id).toBe("thread-123");
      expect(addedThreadData.title).toBe("pagi");
      expect(addedThreadData.owner).toBe("user-123");

      expect(threadInDatabase).toBeDefined();
      expect(threadInDatabase.id).toBe("thread-123");
      expect(threadInDatabase.title).toBe("pagi");
      expect(threadInDatabase.body).toBe("selamat pagi");
      expect(threadInDatabase.owner).toBe("user-123");
    });
  });

  describe("getThread function", () => {
    it("should return all data thats needed", async () => {
      const user = { id: "user-123", username: "dicoding", password: "secret", fullname: "Dicoding Indonesia" };
      await UsersTableTestHelper.addUser(user);

      const thread = { id: "thread-123", title: "pagi", body: "selamat pagi", owner: "user-123" };
      await ThreadsTableTestHelper.addThread(thread);

      const comment = { content: "pagi juga", owner: "user-123", threadId: "thread-123", id: "comment-123" };
      await CommentTableTestHelper.addComment(comment);

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      const getThread = await threadRepositoryPostgres.getThread("thread-123");

      expect(getThread).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "thread-123",
            title: "pagi",
            body: "selamat pagi",
            date: expect.any(String),
            username: "dicoding",
            comment_id: "comment-123",
            comment_content: "pagi juga",
            comment_date: expect.any(String),
            comment_username: "dicoding",
            isDelete: expect.any(Boolean),
          }),
        ])
      );
    });
  });
});
