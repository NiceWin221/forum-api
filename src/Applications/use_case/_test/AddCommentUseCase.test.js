const AddedComment = require("../../../Domains/comments/entities/AddedComment");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const AddCommentUseCase = require("../AddCommentUseCase");
const AddComment = require("../../../Domains/comments/entities/AddComment");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");

describe("AddCommentUseCase", () => {
  it("should orchestrating the add comment action correctly", async () => {
    const useCasePayload = {
      payload: {
        content: "pagi juga",
      },
      threadId: "thread-123",
      id: "user-123",
    };

    const data = {
      ...useCasePayload.payload,
      threadId: useCasePayload.threadId,
      owner: useCasePayload.id,
    };

    const expectedAddedComment = new AddedComment({
      id: "comment-123",
      ...data,
    });

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyAvailableThread = jest.fn().mockResolvedValue();
    mockCommentRepository.addComment = jest.fn().mockResolvedValue({
      id: "comment-123",
      owner: "user-123",
      content: "pagi juga",
    });

    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    const addedComment = await addCommentUseCase.execute(useCasePayload);

    expect(mockThreadRepository.verifyAvailableThread).toHaveBeenCalledTimes(1);
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.addComment).toBeCalledWith(new AddComment(data));
    expect(addedComment).toStrictEqual(expectedAddedComment);
  });
});
