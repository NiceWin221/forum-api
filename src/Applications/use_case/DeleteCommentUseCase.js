const DeleteComment = require("../../Domains/comments/entities/DeleteComment");

class DeleteCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const { threadId, id, owner } = useCasePayload;

    const deleteComment = new DeleteComment({ id, threadId, owner });

    await this._threadRepository.verifyAvailableThread(deleteComment.threadId);
    await this._commentRepository.verifyAvailableComment(deleteComment.id);
    await this._commentRepository.verifyUser(deleteComment.id, deleteComment.owner);

    await this._commentRepository.deleteComment(deleteComment.id);
  }
}

module.exports = DeleteCommentUseCase;
