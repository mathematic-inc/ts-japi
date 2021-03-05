import { Metaizer } from '../lib';
import Meta from '../lib/models/meta.model';
import { Article, User } from './models';
import { getJSON } from './utils/get-json';

const sliceRandom = <T>(array: T[], size: number) => {
  const slice: T[] = [];
  for (let i = 0; i < size; i++) {
    slice.push(array[Math.floor(Math.random() * array.length)]);
  }
  return slice;
};

describe('Metaizer Tests', () => {
  let UserMetaizer;
  let UserArticleMetaizer;
  it('should construct several Metaizers', () => {
    expect(() => new Metaizer(() => null)).not.toThrow();
    expect(
      () => (UserMetaizer = new Metaizer((user: User) => ({ createdAt: user.createdAt })))
    ).not.toThrow();
    expect(
      () =>
        (UserArticleMetaizer = new Metaizer((user: User, articles: Article | Article[]) =>
          Array.isArray(articles)
            ? { userCreatedAt: user.createdAt }
            : { userCreatedAt: user.createdAt, articleCreatedAt: articles.createdAt }
        ))
    ).not.toThrow();
  });
  it.each(sliceRandom(User.storage, 5).map((user) => user.id))(
    'tests Metaizers on User ID %s',
    (userId) => {
      const user = User.find(userId);
      const articles = user.getArticles();
      const article = articles[0];

      let metas = new Map<Metaizer<any>, Meta>();
      expect(() => metas.set(UserMetaizer, UserMetaizer.metaize(user))).not.toThrow();
      expect(metas.get(UserMetaizer)).toBeInstanceOf(Meta);
      expect(getJSON(metas.get(UserMetaizer))).toEqual({
        createdAt: user.createdAt.toISOString(),
      });

      expect(() =>
        metas.set(UserArticleMetaizer, UserArticleMetaizer.metaize(user, articles))
      ).not.toThrow();
      expect(metas.get(UserArticleMetaizer)).toBeInstanceOf(Meta);
      expect(getJSON(metas.get(UserArticleMetaizer))).toEqual({
        userCreatedAt: user.createdAt.toISOString(),
      });

      if (article) {
        expect(() =>
          metas.set(UserArticleMetaizer, UserArticleMetaizer.metaize(user, article))
        ).not.toThrow();
        expect(metas.get(UserArticleMetaizer)).toBeInstanceOf(Meta);
        expect(getJSON(metas.get(UserArticleMetaizer))).toEqual({
          userCreatedAt: user.createdAt.toISOString(),
          articleCreatedAt: article.createdAt.toISOString(),
        });
      }
    }
  );
});
