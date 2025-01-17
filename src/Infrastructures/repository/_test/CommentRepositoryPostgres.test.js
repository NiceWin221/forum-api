const CommentTableTestHelper = require("../../../../tests/CommentTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const AddComment = require("../../../Domains/comments/entities/AddComment");
const AddedComment = require("../../../Domains/comments/entities/AddedComment");
const pool = require("../../database/postgres/pool");
const CommentRepositoryPostgres = require("../CommentRepositoryPostgres");

describe("CommentRepositoryPostgres", () => {
  beforeEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("verifyUser function", () => {
    it("should throw error when the user is not the owner of the comment", async () => {
      const user = { id: "user-123", username: "dicoding", password: "secret", fullname: "Dicoding Indonesia" };
      await UsersTableTestHelper.addUser(user);

      const thread = { id: "thread-123", title: "pagi", body: "selamat pagi", owner: "user-123" };
      await ThreadsTableTestHelper.addThread(thread);

      const comment = { id: "comment-123", content: "pagi juga", owner: "user-123", threadId: "thread-123" };
      await CommentTableTestHelper.addComment(comment);

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.verifyUser("comment-123", "user-456")).rejects.toThrowError(AuthorizationError);
    });

    it("should not throw error when the user is the owner of the comment", async () => {
      const user = { id: "user-123", username: "dicoding", password: "secret", fullname: "Dicoding Indonesia" };
      await UsersTableTestHelper.addUser(user);

      const thread = { id: "thread-123", title: "pagi", body: "selamat pagi", owner: "user-123" };
      await ThreadsTableTestHelper.addThread(thread);

      const comment = { id: "comment-123", content: "pagi juga", owner: "user-123", threadId: "thread-123" };
      await CommentTableTestHelper.addComment(comment);

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.verifyUser("comment-123", "user-123")).resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe("verifyAvailableComment function", () => {
    it("should throw error when comment not available", async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await expect(commentRepositoryPostgres.verifyAvailableComment("comment-123")).rejects.toThrowError(NotFoundError);
    });
    it("should not throw error when comment available", async () => {
      const user = { id: "user-123", username: "dicoding", password: "secret", fullname: "Dicoding Indonesia" };
      await UsersTableTestHelper.addUser(user);

      const thread = { id: "thread-123", title: "pagi", body: "selamat pagi", owner: "user-123" };
      await ThreadsTableTestHelper.addThread(thread);

      const comment = { content: "pagi juga", owner: "user-123", threadId: "thread-123" };
      await CommentTableTestHelper.addComment(comment);

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.verifyAvailableComment("comment-123")).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe("getCommentById function", () => {
    it("should throw NotFoundError when comment id not found", async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.getCommentById("comment-123")).rejects.toThrowError(NotFoundError);
    });

    it("should return comment when comment is found", async () => {
      const user = { id: "user-123", username: "dicoding", password: "secret", fullname: "Dicoding Indonesia" };
      await UsersTableTestHelper.addUser(user);

      const thread = { id: "thread-123", title: "pagi", body: "selamat pagi", owner: "user-123" };
      await ThreadsTableTestHelper.addThread(thread);

      const comment = { content: "pagi juga", owner: "user-123", threadId: "thread-123" };
      await CommentTableTestHelper.addComment(comment);

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      const result = await commentRepositoryPostgres.getCommentById("comment-123");

      expect(result).toEqual({
        id: "comment-123",
        content: "pagi juga",
        owner: "user-123",
        threadId: "thread-123",
        isDelete: expect.any(Boolean),
        date: expect.any(String),
      });
    });
  });

  describe("addComment function", () => {
    it("should persist comment and return added comment correctly", async () => {
      const user = { id: "user-123", username: "dicoding", password: "secret", fullname: "Dicoding Indonesia" };
      await UsersTableTestHelper.addUser(user);
      const thread = { id: "thread-123", title: "pagi", body: "selamat pagi", owner: "user-123" };
      await ThreadsTableTestHelper.addThread(thread);

      const comment = { content: "pagi juga", owner: "user-123", threadId: "thread-123" };
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, () => "123");
      const newComment = new AddComment(comment);

      const addedCommentData = await commentRepositoryPostgres.addComment(newComment);
      const commentInDatabase = await CommentTableTestHelper.findCommentById(addedCommentData.id);

      expect(addedCommentData).toBeDefined();
      expect(addedCommentData.id).toBe("comment-123");
      expect(addedCommentData.content).toBe("pagi juga");
      expect(addedCommentData.owner).toBe("user-123");

      expect(commentInDatabase).toBeDefined();
      expect(commentInDatabase.id).toBe("comment-123");
      expect(commentInDatabase.content).toBe("pagi juga");
      expect(commentInDatabase.owner).toBe("user-123");
      expect(commentInDatabase.threadId).toBe("thread-123");
    });
  });

  describe("deleteComment function", () => {
    it("should soft delete comment and return success", async () => {
      const user = { id: "user-123", username: "dicoding", password: "secret", fullname: "Dicoding Indonesia" };
      await UsersTableTestHelper.addUser(user);

      const thread = { id: "thread-123", title: "pagi", body: "selamat pagi", owner: "user-123" };
      await ThreadsTableTestHelper.addThread(thread);

      const comment = { content: "pagi juga", owner: "user-123", threadId: "thread-123", id: "comment-123" };
      await CommentTableTestHelper.addComment(comment);

      const id = "comment-123";

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await commentRepositoryPostgres.deleteComment(id);

      const deletedComment = await commentRepositoryPostgres.getCommentById(id);

      expect(deletedComment.isDelete).toBe(true);
    });
  });
});
