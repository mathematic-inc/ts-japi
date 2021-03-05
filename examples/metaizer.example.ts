import { User, Article } from '../test/models';
import { Metaizer } from '../src';
import { getJSON } from '../test/utils/get-json';

// The last argument should almost always be an array or a single object type.
// The reason for this is the potential for metaizing several articles.
const UserArticleMetaizer = new Metaizer((user: User, articles: Article | Article[]) => {
  return Array.isArray(articles)
    ? { user_created: user.createdAt, article_created: articles.map((a) => a.createdAt) }
    : { user_created: user.createdAt, article_created: articles.createdAt };
});

// ! The rest of this example is just to illustrate internal behavior.
(async () => {
  const user = new User('sample_user_id');
  const article = new Article('same_article_id', user);

  console.log('Output:', getJSON(UserArticleMetaizer.metaize(user, article)));

  // Output: {
  //  user_created: '2020-05-20T15:39:43.277Z',
  //  article_created: '2020-05-20T15:39:43.277Z'
  // }
})();
