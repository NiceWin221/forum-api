const AuthenticationTokenManager = require("../../../../Applications/security/AuthenticationTokenManager");
const AddCommentUseCase = require("../../../../Applications/use_case/AddCommentUseCase");
const DeleteCommentUseCase = require("../../../../Applications/use_case/DeleteCommentUseCase");
const { extractTokenFromHeader } = require("../../utilities/authUtils");

class CommentHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const token = extractTokenFromHeader(request.headers.authorization);
    const jwtTokenManager = this._container.getInstance(AuthenticationTokenManager.name);
    const decoded = await jwtTokenManager.decodePayload(token);

    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);

    const { threadId } = request.params;

    const useCasePayload = {
      payload: request.payload,
      threadId,
      id: decoded.id,
    };

    const addedComment = await addCommentUseCase.execute(useCasePayload);

    const response = h.response({
      status: "success",
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentHandler(request, h) {
    const token = extractTokenFromHeader(request.headers.authorization);
    const jwtTokenManager = this._container.getInstance(AuthenticationTokenManager.name);
    const decoded = await jwtTokenManager.decodePayload(token);

    const { threadId, commentId } = request.params;

    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);

    const data = { id: commentId, threadId, owner: decoded.id };

    await deleteCommentUseCase.execute(data);

    const response = h.response({
      status: "success",
    });
    response.code(200);
    return response;
  }
}

module.exports = CommentHandler;
