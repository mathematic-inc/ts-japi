import { Linker, Metaizer, Paginator, Relator, Serializer } from "../src";
import { Article, User } from "../test/models";
import { getJSON } from "../test/utils/get-json";

/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/*                                    SETUP                                   */
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
for (let i = 0; i < 5; i++) {
  User.save(new User(String(i)));
}
for (let i = 0; i < 5; i++) {
  Article.save(new Article(String(i), User.storage[0]!));
}
const domain = "https://www.example.com";
const pathTo = (path: string) => domain + path;
const ArticleSerializer = new Serializer<Article>("articles");
const UserArticleRelationshipLinker = new Linker(
  (user: User, articles: Article | Article[] | null | undefined) =>
    articles instanceof Article
      ? pathTo(`/users/${user.id}/relationships/articles/${articles.id}`)
      : pathTo(`/users/${user.id}/relationships/articles/`),
);
const UserArticleLinker = new Linker(
  (user: User, articles: Article | Article[] | null | undefined) =>
    articles instanceof Article
      ? pathTo(`/users/${user.id}/articles/${articles.id}`)
      : pathTo(`/users/${user.id}/articles/`),
);
const UserArticleMetaizer = new Metaizer(
  (user: User, articles: Article | Article[] | null | undefined) =>
    articles instanceof Article
      ? { userCreatedAt: user.createdAt, articleCreatedAt: articles.createdAt }
      : { userCreatedAt: user.createdAt },
);
const UserArticlesRelator = new Relator(
  (user: User) => Promise.resolve(user.getArticles()),
  ArticleSerializer,
  {
    linkers: {
      relationship: UserArticleRelationshipLinker,
      related: UserArticleLinker,
    },
    metaizer: UserArticleMetaizer,
  },
);
const UserLinker = new Linker<[User]>((users) =>
  Array.isArray(users) ? pathTo("/users/") : pathTo(`/users/${users.id}`),
);
const UserPaginator = new Paginator<User>((users) => {
  if (Array.isArray(users)) {
    const nextPage = Number(users[0]!.id) + 1;
    const prevPage = Number(users.at(-1)!.id) - 1;
    return {
      first: pathTo("/users/0"),
      last: pathTo(`/users/${User.storage.length - 1}`),
      next: nextPage <= User.storage.length - 1 ? pathTo(`/users/${nextPage}`) : null,
      prev: prevPage >= 0 ? pathTo(`/users/${prevPage}`) : null,
    };
  }
  return undefined;
});
const JSONAPIMetaizer = new Metaizer(() => ({
  somefiller: "nothing really fascinating",
}));
const UserDocumentMetaizer = new Metaizer(() => ({
  requestedAt: new Date(),
}));
const UserMetaizer = new Metaizer((user: User) => ({
  createdAt: user.createdAt,
}));
/* -------------------------------------------------------------------------- */

/**
 * Serializes Users
 */
const UserSerializer = new Serializer("users", {
  include: 1,
  projection: {},
  relators: UserArticlesRelator,
  linkers: {
    resource: UserLinker,
    paginator: UserPaginator,
  },
  metaizers: {
    jsonapi: JSONAPIMetaizer,
    document: UserDocumentMetaizer,
    resource: UserMetaizer,
  },
});

void (async () => {
  const user = User.storage[0];

  const document = await UserSerializer.serialize(user);

  console.dir(getJSON(document), { depth: null });

  // Output: {
  //  jsonapi: {
  //   version: "1.0",
  //   meta: { somefiller: "nothing really fascinating" },
  //  },
  //  meta: { requestedAt: "2020-05-21T01:33:09.537Z" },
  //  links: {
  //   first: "https://www.example.com/users/0",
  //   last: "https://www.example.com/users/5",
  //   prev: null,
  //   next: null,
  //  },
  //  data: {
  //   type: "users",
  //   id: "sample_user_id",
  //   meta: { createdAt: "2020-05-21T01:33:09.505Z" },
  //   attributes: {},
  //   relationships: {
  //    articles: {
  //     links: {
  //      self: "https://www.example.com/users/sample_user_id/relationships/articles/",
  //      related: "https://www.example.com/users/sample_user_id/articles/",
  //     },
  //     data: [
  //      { type: "articles", id: "same_article_id" },
  //      { type: "articles", id: "0" },
  //      { type: "articles", id: "1" },
  //      { type: "articles", id: "2" },
  //      { type: "articles", id: "3" },
  //      { type: "articles", id: "4" },
  //     ],
  //     meta: { userCreatedAt: "2020-05-21T01:33:09.505Z" },
  //    },
  //   },
  //   links: { self: "https://www.example.com/users/sample_user_id" },
  //  },
  //  included: [
  //   {
  //    type: "articles",
  //    id: "same_article_id",
  //    attributes: {
  //     createdAt: "2020-05-21T01:33:09.505Z",
  //     comments: [],
  //     author: "sample_user_id",
  //    },
  //   },
  //   {
  //    type: "articles",
  //    id: "0",
  //    attributes: {
  //     createdAt: "2020-05-21T01:33:09.537Z",
  //     comments: [],
  //     author: "sample_user_id",
  //    },
  //   },
  //   {
  //    type: "articles",
  //    id: "1",
  //    attributes: {
  //     createdAt: "2020-05-21T01:33:09.537Z",
  //     comments: [],
  //     author: "sample_user_id",
  //    },
  //   },
  //   {
  //    type: "articles",
  //    id: "2",
  //    attributes: {
  //     createdAt: "2020-05-21T01:33:09.537Z",
  //     comments: [],
  //     author: "sample_user_id",
  //    },
  //   },
  //   {
  //    type: "articles",
  //    id: "3",
  //    attributes: {
  //     createdAt: "2020-05-21T01:33:09.537Z",
  //     comments: [],
  //     author: "sample_user_id",
  //    },
  //   },
  //   {
  //    type: "articles",
  //    id: "4",
  //    attributes: {
  //     createdAt: "2020-05-21T01:33:09.537Z",
  //     comments: [],
  //     author: "sample_user_id",
  //    },
  //   },
  //  ],
  // };
})();
