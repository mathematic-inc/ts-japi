import { Relator, Serializer } from "../src";
import { Article, User } from "../test/models";
import { getJSON } from "../test/utils/get-json";

const ArticleSerializer = new Serializer<Article>("articles");
const UserArticleRelator = new Relator<User, Article>(
  (user) => Promise.resolve(user.getArticles()),
  ArticleSerializer,
);

// ! The rest of this example is just to illustrate some internal behavior.
void (async () => {
  const user = new User("sample_user_id");
  const article = new Article("same_article_id", user);
  User.save(user);
  Article.save(article);

  console.log("Output:", getJSON(await UserArticleRelator.getRelationship(user)));

  // Output: { data: [ { type: 'articles', id: 'same_article_id' } ] }
})();
