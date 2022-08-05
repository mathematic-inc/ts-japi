import 'regenerator-runtime';
import { v4 as uuid } from 'uuid';
import { User, Article, Comment } from '../models';

function randInt(max: number) {
  return Math.floor(Math.random() * max);
}

const numberOfArticles = randInt(30) + 5;
const numberOfComments = randInt(100) + 5;
const numberOfUsers = randInt(20) + 5;

for (let i = 0; i < numberOfUsers; i++) {
  User.save(new User(String(i)));
}

for (let i = 0; i < numberOfArticles; i++) {
  Article.save(new Article(String(i), User.storage[randInt(numberOfUsers)]));
}

for (let i = 0; i < numberOfComments; i++) {
  Comment.save(
    new Comment(
      uuid(),
      Article.storage[randInt(numberOfArticles)],
      User.storage[randInt(numberOfUsers)]
    )
  );
}
