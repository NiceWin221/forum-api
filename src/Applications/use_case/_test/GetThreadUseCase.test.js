const GettedThread = require("../../../Domains/threads/entities/GettedThread");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const GetThreadUseCase = require("../GetThreadUseCase");

describe("GetThreadUseCase", () => {
  it("should return get response", async () => {
    const id = "user-123";

    const rawThreadData = [
      {
        id: "thread-76zCQboCvgjKrysBgszXc",
        title: "sebuah thread",
        body: "sebuah body thread",
        date: "2025-01-15 21:12:32.031072+07",
        username: "dicoding",
        comment_id: "comment-13jYsj8sfOYIMrYV0U4Bq",
        comment_content: "sebuah comment",
        comment_date: "2025-01-15 21:20:55.339367+07",
        isDelete: false,
        comment_username: "johndoe",
      },
      {
        id: "thread-76zCQboCvgjKrysBgszXc",
        title: "sebuah thread",
        body: "sebuah body thread",
        date: "2025-01-15 21:12:32.031072+07",
        username: "dicoding",
        comment_id: "comment-U4ZydXVU43nhMO3MhAUI9",
        comment_content: "sebuah comment",
        comment_date: "2025-01-15 21:20:58.110158+07",
        isDelete: true,
        comment_username: "dicoding",
      },
    ];

    const expectedGetThread = new GettedThread({
      id: "thread-76zCQboCvgjKrysBgszXc",
      title: "sebuah thread",
      body: "sebuah body thread",
      date: "2025-01-15 21:12:32.031072+07",
      username: "dicoding",
      comments: [
        {
          id: "comment-13jYsj8sfOYIMrYV0U4Bq",
          username: "johndoe",
          date: "2025-01-15 21:20:55.339367+07",
          content: "sebuah comment",
        },
        {
          id: "comment-U4ZydXVU43nhMO3MhAUI9",
          username: "dicoding",
          date: "2025-01-15 21:20:58.110158+07",
          content: "**komentar telah dihapus**",
        },
      ],
    });

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyAvailableThread = jest.fn().mockResolvedValue();
    mockThreadRepository.getThread = jest.fn().mockResolvedValue(rawThreadData);

    const getThreadUseCase = new GetThreadUseCase({ threadRepository: mockThreadRepository });

    const gettedThread = await getThreadUseCase.execute(id);

    expect(mockThreadRepository.verifyAvailableThread).toHaveBeenCalledTimes(1);
    expect(mockThreadRepository.verifyAvailableThread).toHaveBeenCalledWith(id);
    expect(mockThreadRepository.getThread).toHaveBeenCalledWith(id);
    expect(gettedThread).toEqual(new GettedThread(expectedGetThread));

    expect(gettedThread.comments[0].content).toBe("sebuah comment");
    expect(gettedThread.comments[1].content).toBe("**komentar telah dihapus**");
  });
});
