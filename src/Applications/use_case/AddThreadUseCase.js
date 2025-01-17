const AddThread = require("../../Domains/threads/entities/AddThread");
const AddedThread = require("../../Domains/threads/entities/AddedThread");

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const { payload, owner } = useCasePayload;
    const data = { ...payload, owner };

    const addThread = new AddThread(data);
    const addedThread = await this._threadRepository.addThread(addThread);
    return new AddedThread(addedThread);
  }
}

module.exports = AddThreadUseCase;
