const AddComment = require("../../Domains/comments/entities/AddComment");
const AddedComment = require("../../Domains/comments/entities/AddedComment");

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const { payload, id, threadId } = useCasePayload;
    const data = { ...payload, owner: id, threadId };

    await this._threadRepository.verifyAvailableThread(threadId);

    const addComment = new AddComment(data);

    const addedComment = await this._commentRepository.addComment(addComment);
    return new AddedComment(addedComment);
  }
}

module.exports = AddCommentUseCase;
