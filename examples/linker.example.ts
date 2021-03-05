import { Linker } from '../src';
import { User, Article } from '../test/models';
import { getJSON } from '../test/utils/get-json';

// The last argument should almost always be an array or a single object type.
// The reason for this is the potential for linking several articles.
const UserArticleLinker = new Linker((user: User, articles: Article | Article[]) => {
  return Array.isArray(articles)
    ? `https://www.example.com/users/${user.id}/articles/`
    : `https://www.example.com/users/${user.id}/articles/${articles.id}`;
});

// ! The rest of this example is just to illustrate internal behavior.
(async () => {
  const user = new User('sample_user_id');
  const article = new Article('same_article_id', user);

  console.log('Output:', getJSON(UserArticleLinker.link(user, article)));

  // Output: https://www.example.com/users/sample_user_id/articles/same_article_id
})();
