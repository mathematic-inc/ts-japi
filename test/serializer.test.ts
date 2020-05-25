import { Linker, Metaizer, Paginator, Relator, Serializer } from "../lib";
import { DataDocument } from "../lib/interfaces/json:api.interface";
import { User } from "./models";
import { getJSON } from "./utils/get-json";

const domain = "https://www.example.com";
const pathTo = (path: string) => domain + path;
const sliceRandom = <T>(array: T[], size: number) => {
 const slice: T[] = [];
 for (let i = 0; i < size; i++) {
  slice.push(array[Math.floor(Math.random() * array.length)]);
 }
 return slice;
};

const NUMBER_OF_TESTS = 2;

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
const UserArticlesRelator = new Relator(
 async (user: User) => user.getArticles(),
 ArticleSerializer,
 {
  linkers: {
   relationship: UserArticleRelationshipLinker,
   related: UserArticleLinker,
  },
  metaizer: UserArticleMetaizer,
 }
);
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

describe("Serializer Tests", () => {
 describe("Invalid Serializer Tests", () => {
  it("should throw with negative depth", () => {
   expect(new Serializer("sample").serialize({}, { depth: -5 })).rejects.toThrowError(RangeError);
  });
 });
 describe.each([
  [
   undefined,
   (user: User) => ({
    jsonapi: { version: "1.0" },
    data: {
     type: "users",
     id: user.id,
     attributes: {
      createdAt: user.createdAt.toISOString(),
      articles: user.articles,
      comments: user.comments,
     },
    },
   }),
  ],
  [
   { onlyIdentifier: true },
   (user: User) => ({
    jsonapi: { version: "1.0" },
    data: { type: "users", id: user.id },
   }),
  ],
  [
   { onlyIdentifier: true, metaizers: { resource: UserMetaizer } },
   (user: User) => ({
    jsonapi: { version: "1.0" },
    data: { type: "users", id: user.id, meta: { createdAt: user.createdAt.toISOString() } },
   }),
  ],
  [
   { nullData: true },
   (user: User) => ({
    jsonapi: { version: "1.0" },
    data: null,
   }),
  ],
  [
   { asIncluded: true },
   (user: User) => ({
    jsonapi: { version: "1.0" },
    included: [
     {
      type: "users",
      id: user.id,
      attributes: {
       createdAt: user.createdAt.toISOString(),
       articles: user.articles,
       comments: user.comments,
      },
     },
    ],
    data: { type: "users", id: user.id },
   }),
  ],
  [
   { projection: { createdAt: 1 } } as const,
   (user: User) => ({
    jsonapi: { version: "1.0" },
    data: {
     type: "users",
     id: user.id,
     attributes: { createdAt: user.createdAt.toISOString() },
    },
   }),
  ],
  [
   { projection: {} },
   (user: User) => ({
    jsonapi: { version: "1.0" },
    data: {
     type: "users",
     id: user.id,
     attributes: {},
    },
   }),
  ],
  [
   {
    depth: 1,
    onlyRelationship: "articles",
    relators: UserArticlesRelator,
   },
   (user: User) => {
    const articles = user.getArticles();
    return {
     data: articles.map((article) => ({
      id: article.id,
      type: "articles",
      attributes: {
       author: article.author,
       comments: article.comments,
       createdAt: article.createdAt.toISOString(),
      },
     })),
     jsonapi: { version: "1.0" },
     links: {
      related: pathTo(`/users/${user.id}/articles/`),
      self: pathTo(`/users/${user.id}/relationships/articles/`),
     },
     meta: { userCreatedAt: user.createdAt.toISOString() },
    };
   },
  ],
  [
   {
    depth: 1,
    projection: {},
    relators: UserArticlesRelator,
    linkers: {
     document: new Linker(() => "https://www.example.com"),
     resource: UserLinker,
     paginator: UserPaginator,
    },
    metaizers: {
     jsonapi: JSONAPIMetaizer,
     document: UserDocumentMetaizer,
     resource: UserMetaizer,
    },
   },
   (user: User) => ({
    included: (() => (user.getArticles().length > 0 ? expect.any(Array) : undefined))(),
    data: {
     attributes: {},
     id: user.id,
     meta: { createdAt: user.createdAt.toISOString() },
     relationships: {
      articles: {
       data: user.getArticles().map((article) => ({ id: article.id, type: "articles" })),
       links: {
        related: pathTo(`/users/${user.id}/articles/`),
        self: pathTo(`/users/${user.id}/relationships/articles/`),
       },
       meta: { userCreatedAt: user.createdAt.toISOString() },
      },
     },
     links: expect.any(Object),
     type: "users",
    },
    jsonapi: { meta: { somefiller: "nothing really fascinating" }, version: "1.0" },
    links: expect.any(Object),
    meta: { requestedAt: expect.any(String) },
   }),
  ],
 ])("With Options %p", (options, expectedFrom) => {
  let UserSerializer: Serializer<User>;
  it("should construct a Serializer", () => {
   expect(() => (UserSerializer = new Serializer("users", options))).not.toThrow();
  });
  it.each(sliceRandom(User.storage, NUMBER_OF_TESTS).map((user) => user.id))(
   "tests a Serializer on User ID %s",
   async (userId, done) => {
    // Get dummy data.
    const user = User.find(userId);

    // Testing methods
    let document: DataDocument<User>;
    await expect(
     UserSerializer.serialize(user).then((doc) => (document = doc))
    ).resolves.toBeInstanceOf(Object);

    // Test JSON
    expect(getJSON(document)).toEqual(expectedFrom(user));

    done();
   }
  );
 });
});
