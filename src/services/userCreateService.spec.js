const UserCreateService = require("./UserCreateService");
const UserRepositoryInMemorie = require("../repositories/UserRepositoryInMemorie");

it("user should be created", async () => {
  const user = {
    name: "User test",
    email: "user@test.com",
    password: "123",
  };

  // Instancia o repositório em memória
  const userRepository = new UserRepositoryInMemorie();

  // Passa o repositório para o serviço
  const userCreateService = new UserCreateService(userRepository);

  // Executa o método do serviço
  const userCreated = await userCreateService.execute(user);

  // Verifica se o usuário foi criado com ID
  expect(userCreated).toHaveProperty("id");
});
