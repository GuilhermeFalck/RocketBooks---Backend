const UserCreateService = require("./UserCreateService");
const UserRepositoryInMemorie = require("../repositories/UserRepositoryInMemorie");
const AppError = require("../utils/AppError");

describe("UserCreateService", () => {
  let userRepositoryInMemorie = null;
  let userCreateService = null;

  beforeEach(() => {
    userRepositoryInMemorie = new UserRepositoryInMemorie();
    userCreateService = new UserCreateService(userRepositoryInMemorie);
  });

  it("user should be created", async () => {
    const user = {
      name: "User test",
      email: "user@test.com",
      password: "123",
    };

    const userCreated = await userCreateService.execute(user);

    // Verifica se o usuário foi criado com ID
    expect(userCreated).toHaveProperty("id");
  });

  it("user not should be create with exists email", async () => {
    const user1 = {
      name: "User test 1",
      email: "user@test.com",
      password: "123",
    };

    const user2 = {
      name: "User test 2",
      email: "user@test.com",
      password: "456",
    };

    await userCreateService.execute(user1);
    await expect(userCreateService.execute(user2)).rejects.toEqual(
      new AppError("Este e-mail já está em uso.")
    );
  });
});
