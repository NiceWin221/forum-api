const CommentRepository = require("../../../Domains/comments/CommentRepository");
const DeleteComment = require("../../../Domains/comments/entities/DeleteComment");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const DeleteCommentUseCase = require("../DeleteCommentUseCase");

describe("DeleteCommentUseCase", () => {
  it("should soft delete the comment", async () => {
    const useCasePayload = {
      threadId: "thread-123",
      id: "comment-123",
      owner: "user-123",
    };

    const mockDeleteComment = new DeleteComment(useCasePayload);

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyAvailableThread = jest.fn().mockResolvedValue();
    mockCommentRepository.verifyAvailableComment = jest.fn().mockResolvedValue();
    mockCommentRepository.verifyUser = jest.fn().mockResolvedValue();
    mockCommentRepository.deleteComment = jest.fn().mockResolvedValue();

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    await deleteCommentUseCase.execute(useCasePayload);

    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(mockDeleteComment.threadId);
    expect(mockCommentRepository.verifyAvailableComment).toBeCalledWith(mockDeleteComment.id);
    expect(mockCommentRepository.verifyUser).toBeCalledWith(mockDeleteComment.id, mockDeleteComment.owner);
    expect(mockCommentRepository.deleteComment).toBeCalledWith(mockDeleteComment.id);
  });
});
