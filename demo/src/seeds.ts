import { FastAPI } from '@cogup/fastapi';
import { faker } from '@faker-js/faker';

function randomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function seeds(fastapi: FastAPI) {
  const { models } = fastapi;

  for (let i = 0; i < 10; i++) {
    models.User.create({
      name: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password()
    });
  }

  for (let i = 0; i < 2; i++) {
    models.Author.create({
      name: faker.internet.userName(),
      user_id: i + 1
    });
  }

  for (let i = 0; i < 25; i++) {
    models.Post.create({
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraph(),
      author_id: randomNumber(1, 2)
    });
  }

  for (let i = 0; i < 25; i++) {
    models.Comment.create({
      content: faker.lorem.paragraph(),
      post_id: randomNumber(1, 25),
      user_id: randomNumber(3, 10)
    });
  }
}
