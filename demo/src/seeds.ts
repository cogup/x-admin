import { FastAPI } from '@cogup/fastapi';
import { faker } from '@faker-js/faker';

function randomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// json by metada blog post faker
function metadata(): string {
  const data = {
    state: faker.location.state(),
    colors: [
      faker.internet.color(),
      faker.internet.color(),
      faker.internet.color()
    ]
  };

  return JSON.stringify(data, null, 2);
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

  for (let i = 0; i < 25; i++) {
    models.Post.create({
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraph(),
      userId: randomNumber(1, 5),
      metadata: metadata()
    });
  }

  for (let i = 0; i < 25; i++) {
    models.Comment.create({
      content: faker.lorem.paragraph(),
      postId: randomNumber(1, 25),
      userId: randomNumber(3, 10)
    });
  }
}
