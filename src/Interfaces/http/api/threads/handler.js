const AuthenticationTokenManager = require("../../../../Applications/security/AuthenticationTokenManager");
const AddThreadUseCase = require("../../../../Applications/use_case/AddThreadUseCase");
const GetThreadUseCase = require("../../../../Applications/use_case/GetThreadUseCase");
const { extractTokenFromHeader } = require("../../utilities/authUtils");

class ThreadHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadHandler = this.getThreadHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const token = extractTokenFromHeader(request.headers.authorization);
    const jwtTokenManager = this._container.getInstance(AuthenticationTokenManager.name);
    const decoded = await jwtTokenManager.decodePayload(token);

    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);

    const useCasePayload = {
      payload: request.payload,
      owner: decoded.id,
      username: decoded.username,
    };

    const addedThread = await addThreadUseCase.execute(useCasePayload);

    const response = h.response({
      status: "success",
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async getThreadHandler(request, h) {
    const getThreadUseCase = this._container.getInstance(GetThreadUseCase.name);

    const { threadId } = request.params;
    const thread = await getThreadUseCase.execute(threadId);

    const response = h.response({
      status: "success",
      data: {
        thread,
      },
    });
    response.code(200);
    return response;
  }
}

module.exports = ThreadHandler;
