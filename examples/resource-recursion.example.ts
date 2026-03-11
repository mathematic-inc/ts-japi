import { Relator, Serializer } from "../src";
import { Article, Comment, User } from "../test/models";
import { getJSON } from "../test/utils/get-json";

/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/*                                    SETUP                                   */
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
for (let i = 0; i < 5; i++) {
  User.save(new User(String(i)));
}
for (let i = 0; i < 5; i++) {
  Article.save(new Article(String(i), User.storage[0]));
}
for (let i = 0; i < 10; i++) {
  Comment.save(new Comment(String(i), Article.storage[0], User.storage[0]));
}
const UserSerializer = new Serializer<User>("users", {
  depth: 0, // Change to 2 to see the difference
});
const CommentSerializer = new Serializer<Comment>("comments");
const ArticleSerializer = new Serializer<Article>("articles");
const UserArticleRelator = new Relator(
  async (user: User) => user.getArticles(),
  ArticleSerializer
);
const ArticleCommentRelator = new Relator(
  async (article: Article) => article.getComments(),
  CommentSerializer
);
const CommentUserRelator = new Relator(
  async (comment: Comment) => comment.getAuthor(),
  UserSerializer
);
CommentSerializer.setRelators(CommentUserRelator);
UserSerializer.setRelators(UserArticleRelator);
ArticleSerializer.setRelators(ArticleCommentRelator);

/* -------------------------------------------------------------------------- */

(async () => {
  const user = User.storage[0];

  const document = await UserSerializer.serialize(user);

  console.dir(getJSON(document));

  // Output: {
  //  jsonapi: { version: "1.0" },
  //  included: [
  //   {
  //    type: "articles",
  //    id: "0",
  //    attributes: [Object],
  //    relationships: [Object],
  //   },
  //   {
  //    type: "articles",
  //    id: "1",
  //    attributes: [Object],
  //    relationships: [Object],
  //   },
  //   {
  //    type: "articles",
  //    id: "2",
  //    attributes: [Object],
  //    relationships: [Object],
  //   },
  //   {
  //    type: "articles",
  //    id: "3",
  //    attributes: [Object],
  //    relationships: [Object],
  //   },
  //   {
  //    type: "articles",
  //    id: "4",
  //    attributes: [Object],
  //    relationships: [Object],
  //   },
  //  ],
  //  data: {
  //   type: "users",
  //   id: "0",
  //   attributes: {
  //    createdAt: "2020-05-22T17:27:53.838Z",
  //    articles: [Array],
  //    comments: [Array],
  //   },
  //   relationships: { articles: [Object] },
  //  },
  // }
})();
