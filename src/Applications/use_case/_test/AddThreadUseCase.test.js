const { payload } = require("@hapi/hapi/lib/validation");
const AddedThread = require("../../../Domains/threads/entities/AddedThread");
const AddThread = require("../../../Domains/threads/entities/AddThread");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const AddThreadUseCase = require("../AddThreadUseCase");
const UserRepository = require("../../../Domains/users/UserRepository");

describe("AddThreadUseCase", () => {
  it("should orchestrating the add thread action correctly", async () => {
    // Arrange
    const useCasePayload = {
      payload: {
        title: "pagi",
        body: "selamat pagi",
      },
      owner: "user-123",
      username: "dicoding",
    };

    const expectedAddedThread = new AddedThread({
      id: "thread-123",
      title: useCasePayload.payload.title,
      owner: useCasePayload.owner,
    });

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.addThread = jest.fn().mockResolvedValue({
      id: "thread-123",
      title: "pagi",
      owner: "user-123",
    });

    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    const addedThread = await addThreadUseCase.execute(useCasePayload);

    expect(mockThreadRepository.addThread).toHaveBeenCalledTimes(1);
    expect(mockThreadRepository.addThread).toBeCalledWith(
      new AddThread({
        title: useCasePayload.payload.title,
        body: useCasePayload.payload.body,
        owner: useCasePayload.owner,
      })
    );
    expect(addedThread).toStrictEqual(expectedAddedThread);
  });
});
