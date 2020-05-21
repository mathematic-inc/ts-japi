import { Linker, Serializer, Relator, Metaizer, Paginator } from "../src";
import { User, Article } from "../test/models";
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
const domain = "https://www.example.com";
const pathTo = (path: string) => domain + path;
const ArticleSerializer = new Serializer("articles");
const UserArticleRelationshipLinker = new Linker((user, articles) =>
 Array.isArray(articles)
  ? pathTo(`/users/${user.id}/relationships/articles/`)
  : pathTo(`/users/${user.id}/relationships/articles/${articles.id}`)
);
const UserArticleLinker = new Linker((user, articles) =>
 Array.isArray(articles)
  ? pathTo(`/users/${user.id}/articles/`)
  : pathTo(`/users/${user.id}/articles/${articles.id}`)
);
const UserArticleMetaizer = new Metaizer((user, articles) =>
 Array.isArray(articles)
  ? { userCreatedAt: user.createdAt }
  : { userCreatedAt: user.createdAt, articleCreatedAt: articles.createdAt }
);
const UserArticlesRelator = new Relator(async (user: User) => user.getArticles(), {
 serializer: ArticleSerializer,
 linkers: {
  relationship: UserArticleRelationshipLinker,
  related: UserArticleLinker,
 },
 metaizer: UserArticleMetaizer,
});
const UserLinker = new Linker<[User]>((users) =>
 Array.isArray(users) ? pathTo(`/users/`) : pathTo(`/users/${users.id}`)
);
const UserPaginator = new Paginator<User>((users) => {
 if (Array.isArray(users)) {
  const nextPage = Number(users[0].id) + 1;
  const prevPage = Number(users[users.length - 1].id) - 1;
  return {
   first: pathTo("/users/0"),
   last: pathTo(`/users/${User.storage.length - 1}`),
   next: nextPage <= User.storage.length - 1 ? pathTo(`/users/${nextPage}`) : null,
   prev: prevPage >= 0 ? pathTo(`/users/${prevPage}`) : null,
  };
 }
 return;
});
const JSONAPIMetaizer = new Metaizer(() => ({
 somefiller: "nothing really fascinating",
}));
const UserDocumentMetaizer = new Metaizer(() => ({
 requestedAt: new Date(),
}));
const UserMetaizer = new Metaizer((user) => ({
 createdAt: user.createdAt,
}));
/* -------------------------------------------------------------------------- */

/**
 * Serializes Users
 */
const UserSerializer = new Serializer("users", {
 depth: 1,
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

(async () => {
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
