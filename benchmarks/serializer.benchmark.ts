import Benchmark from 'benchmark';
import { Relator, Serializer } from '../src';
import { Article, Comment, User } from '../test/models';

const suite = new Benchmark.Suite();

for (let i = 0; i < 5; i++) {
  User.save(new User(String(i)));
}
for (let i = 0; i < 5; i++) {
  Article.save(new Article(String(i), User.storage[0]));
}
for (let i = 0; i < 10; i++) {
  Comment.save(new Comment(String(i), User.storage[0], Article.storage[0]));
}
let UserSerializer = new Serializer<User>('users', {
  depth: 0, // Change to 2 to see the difference
  cache: true,
});
let CommentSerializer = new Serializer<Comment>('comments');
let ArticleSerializer = new Serializer<Article>('articles');
const UserArticleRelator = new Relator<User, Article>(
  async (user: User) => user.getArticles(),
  ArticleSerializer
);
const ArticleCommentRelator = new Relator<Article, Comment>(
  async (article: Article) => article.getComments(),
  CommentSerializer
);
const CommentUserRelator = new Relator<Comment, User>(
  async (comment: Comment) => comment.getAuthor(),
  UserSerializer
);
CommentSerializer.setRelators(CommentUserRelator);
UserSerializer.setRelators(UserArticleRelator);
ArticleSerializer.setRelators(ArticleCommentRelator);

const user = User.storage[0];

// add tests
suite
  .add('Serializer#Test', async function () {
    await UserSerializer.serialize(user);
  })
  // add listeners
  .on('cycle', function (event: any) {
    console.log(String(event.target));
  })
  .on('complete', function (this: any) {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  // run async
  .run({ async: true });
