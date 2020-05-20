import { Linker, Metaizer, Paginator, Relator, Serializer } from "../lib";
import { User, Comment, Article } from "./models";
import { getJSON } from "./utils/get-json";

// console.log(
//  require("util").inspect(
//   getJSON(await UserSerializer.serialize(user)),
//   false,
//   null,
//   true /* enable colors */
//  )
// );
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
const CommentSerializer = new Serializer<Comment>("comments");

const ArticleCommentRelator = new Relator(
 async (article: Article) => article.getComments(),
 CommentSerializer
);
const CommentArticleRelator = new Relator(
 async (article: Comment) => article.getArticle(),
 ArticleSerializer
);

ArticleSerializer.setRelators(ArticleCommentRelator);
CommentSerializer.setRelators(CommentArticleRelator);

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
 it.each(sliceRandom(User.storage, NUMBER_OF_TESTS))(
  "tests a minimal serializer on User %#",
  async (user: User, done) => {
   const UserSerializer = new Serializer("users");
   expect(getJSON(await UserSerializer.serialize(user))).toEqual({
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
   });
   expect(getJSON(await UserSerializer.serialize([user]))).toEqual({
    jsonapi: { version: "1.0" },
    data: [
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
   });
   expect(getJSON(await UserSerializer.serialize(undefined))).toEqual({
    jsonapi: { version: "1.0" },
   });
   expect(getJSON(await UserSerializer.serialize(null))).toEqual({
    jsonapi: { version: "1.0" },
    data: null,
   });
   done();
  }
 );
 it.each(sliceRandom(User.storage, NUMBER_OF_TESTS))(
  "tests the `version` option on User %#",
  async (user: User, done) => {
   const UserSerializer = new Serializer("users", { version: null });
   expect(getJSON(await UserSerializer.serialize(user))).toEqual({
    data: {
     type: "users",
     id: user.id,
     attributes: {
      createdAt: user.createdAt.toISOString(),
      articles: user.articles,
      comments: user.comments,
     },
    },
   });
   expect(getJSON(await UserSerializer.serialize([user]))).toEqual({
    data: [
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
   });
   done();
  }
 );
 it.each(sliceRandom(User.storage, NUMBER_OF_TESTS))(
  "tests the `nullData` option on User %#",
  async (user: User, done) => {
   const UserSerializer = new Serializer("users", { nullData: true });
   expect(getJSON(await UserSerializer.serialize(user))).toEqual({
    jsonapi: { version: "1.0" },
    data: null,
   });
   expect(getJSON(await UserSerializer.serialize([user]))).toEqual({
    jsonapi: { version: "1.0" },
    data: null,
   });
   done();
  }
 );
 it.each(sliceRandom(User.storage, NUMBER_OF_TESTS))(
  "tests the `onlyIdentifier` option on User %#",
  async (user: User, done) => {
   const UserSerializer = new Serializer("users", { onlyIdentifier: true });
   expect(getJSON(await UserSerializer.serialize(user))).toEqual({
    jsonapi: { version: "1.0" },
    data: { type: "users", id: user.id },
   });
   expect(getJSON(await UserSerializer.serialize([user]))).toEqual({
    jsonapi: { version: "1.0" },
    data: [{ type: "users", id: user.id }],
   });
   done();
  }
 );
 it.each(sliceRandom(User.storage, NUMBER_OF_TESTS))(
  "tests the `asIncluded` option on User %#",
  async (user: User, done) => {
   const UserSerializer = new Serializer("users", { asIncluded: true });
   expect(getJSON(await UserSerializer.serialize(user))).toEqual({
    jsonapi: { version: "1.0" },
    data: { type: "users", id: user.id },
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
   });
   expect(getJSON(await UserSerializer.serialize([user]))).toEqual({
    jsonapi: { version: "1.0" },
    data: [{ type: "users", id: user.id }],
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
   });
   done();
  }
 );
 it.each(sliceRandom(User.storage, NUMBER_OF_TESTS))(
  "tests the `depth` option on User %#",
  async (user: User, done) => {
   const UserSerializer = new Serializer("users", { depth: 1, relators: [UserArticlesRelator] });
   expect(getJSON(await UserSerializer.serialize(user))).toEqual({
    jsonapi: { version: "1.0" },
    data: {
     type: "users",
     id: user.id,
     attributes: {
      createdAt: user.createdAt.toISOString(),
      articles: user.articles,
      comments: user.comments,
     },
     relationships: {
      articles: {
       links: {
        self: "https://www.example.com/users/" + user.id + "/relationships/articles/",
        related: "https://www.example.com/users/" + user.id + "/articles/",
       },
       data: user.articles.map((id) => ({ type: "articles", id })),
       meta: { userCreatedAt: user.createdAt.toISOString() },
      },
     },
    },
    included: user.articles.map((id) => expect.objectContaining({ type: "articles", id })),
   });
   expect(getJSON(await UserSerializer.serialize([user]))).toEqual({
    jsonapi: { version: "1.0" },
    data: [
     {
      type: "users",
      id: user.id,
      attributes: {
       createdAt: user.createdAt.toISOString(),
       articles: user.articles,
       comments: user.comments,
      },
      relationships: {
       articles: {
        links: {
         self: "https://www.example.com/users/" + user.id + "/relationships/articles/",
         related: "https://www.example.com/users/" + user.id + "/articles/",
        },
        data: user.articles.map((id) => ({ type: "articles", id })),
        meta: { userCreatedAt: user.createdAt.toISOString() },
       },
      },
     },
    ],
    included: user.articles.map((id) => expect.objectContaining({ type: "articles", id })),
   });
   done();
  }
 );
 describe.each(sliceRandom(User.storage, NUMBER_OF_TESTS))(
  "tests the `projection` option on User %#",
  (user: User) => {
   const expected = (attributes: (user: User) => any) => (user: User) => {
    return {
     jsonapi: { version: "1.0" },
     data: { type: "users", id: user.id, attributes: attributes(user) },
    };
   };
   it.each<any>([
    [
     { createdAt: 1 },
     expected((user: User) => ({
      createdAt: user.createdAt.toISOString(),
     })),
    ],
    [
     { createdAt: 0 },
     expected((user: User) => ({
      articles: user.articles,
      comments: user.comments,
     })),
    ],
    [{}, expected((user: User) => ({}))],
    [undefined, expected((user: User) => undefined)],
    [
     null,
     expected((user: User) => ({
      createdAt: user.createdAt.toISOString(),
      articles: user.articles,
      comments: user.comments,
     })),
    ],
   ])("with projection = %o", async (projection, expected, done) => {
    const UserSerializer = new Serializer("users", { projection });
    expect(getJSON(await UserSerializer.serialize(user))).toEqual(expected(user));
    done();
   });
  }
 );
 it.each(sliceRandom(User.storage, NUMBER_OF_TESTS))(
  "tests the `linkers` option on User %#",
  async (user: User, done) => {
   const UserSerializer = new Serializer("users", {
    linkers: {
     document: new Linker(() => "https://www.example.com"),
     resource: UserLinker,
     paginator: UserPaginator,
    },
   });
   expect(getJSON(await UserSerializer.serialize(user))).toEqual({
    jsonapi: { version: "1.0" },
    links: { self: "https://www.example.com/" },
    data: {
     type: "users",
     id: user.id,
     attributes: {
      createdAt: user.createdAt.toISOString(),
      articles: user.articles,
      comments: user.comments,
     },
     links: { self: "https://www.example.com/users/" + user.id },
    },
   });
   expect(getJSON(await UserSerializer.serialize([user]))).toEqual({
    jsonapi: { version: "1.0" },
    links: expect.objectContaining({
     self: "https://www.example.com/",
    }),
    data: [
     {
      type: "users",
      id: user.id,
      attributes: {
       createdAt: user.createdAt.toISOString(),
       articles: user.articles,
       comments: user.comments,
      },
      links: { self: "https://www.example.com/users/" + user.id },
     },
    ],
   });
   done();
  }
 );
 it.each(sliceRandom(User.storage, NUMBER_OF_TESTS))(
  "tests the `metaizers` option on User %#",
  async (user: User, done) => {
   const UserSerializer = new Serializer("users", {
    metaizers: {
     jsonapi: JSONAPIMetaizer,
     document: UserDocumentMetaizer,
     resource: UserMetaizer,
    },
   });
   expect(getJSON(await UserSerializer.serialize(user))).toEqual({
    jsonapi: {
     version: "1.0",
     meta: { somefiller: "nothing really fascinating" },
    },
    meta: { requestedAt: expect.any(String) },
    data: {
     type: "users",
     id: user.id,
     meta: { createdAt: user.createdAt.toISOString() },
     attributes: {
      createdAt: user.createdAt.toISOString(),
      articles: user.articles,
      comments: user.comments,
     },
    },
   });
   done();
  }
 );
 it.each(sliceRandom(User.storage, NUMBER_OF_TESTS))(
  "tests the `onlyRelationship` option on User %#",
  async (user: User, done) => {
   const UserSerializer = new Serializer("users", {
    onlyRelationship: "articles",
    relators: UserArticlesRelator,
   });
   expect(getJSON(await UserSerializer.serialize(user))).toEqual({
    jsonapi: { version: "1.0" },
    links: {
     self: "https://www.example.com/users/" + user.id + "/relationships/articles/",
     related: "https://www.example.com/users/" + user.id + "/articles/",
    },
    meta: { userCreatedAt: user.createdAt.toISOString() },
    data: user.articles.map((id) => expect.objectContaining({ type: "articles", id })),
   });
   done();
  }
 );
 describe("Combination Tests", () => {
  it("should throw without `relators`", () => {
   const UserSerializer: Serializer<User> = new Serializer("user", {
    onlyRelationship: "articles",
   });
   expect(UserSerializer.serialize(new User(""))).rejects.toThrowError(TypeError);
  });
  it("should throw with no corresponding relator in `relators`.", () => {
   const UserSerializer: Serializer<User> = new Serializer("user", {
    onlyRelationship: "articles",
    relators: { repliedArticles: UserArticlesRelator },
   });
   expect(UserSerializer.serialize(new User(""))).rejects.toThrowError(TypeError);
  });
  it("should throw with nullish or array data", () => {
   const UserSerializer: Serializer<User> = new Serializer("user", {
    onlyRelationship: "articles",
    relators: { articles: UserArticlesRelator },
   });
   expect(UserSerializer.serialize(undefined)).rejects.toThrowError(TypeError);
   expect(UserSerializer.serialize([])).rejects.toThrowError(TypeError);
  });
  it.each(sliceRandom(User.storage, NUMBER_OF_TESTS))(
   "tests `onlyIdentifier` with `metaizers` on User %#",
   async (user: User, done) => {
    const UserSerializer = new Serializer("users", {
     onlyIdentifier: true,
     metaizers: {
      jsonapi: JSONAPIMetaizer,
      document: UserDocumentMetaizer,
      resource: UserMetaizer,
     },
    });
    expect(getJSON(await UserSerializer.serialize(user))).toEqual({
     jsonapi: {
      version: "1.0",
      meta: { somefiller: "nothing really fascinating" },
     },
     meta: { requestedAt: expect.any(String) },
     data: {
      type: "users",
      id: user.id,
      meta: { createdAt: user.createdAt.toISOString() },
     },
    });
    done();
   }
  );
  it.each(sliceRandom(User.storage, NUMBER_OF_TESTS))(
   "tests `onlyRelationship` with `onlyIdentifier` on User %#",
   async (user: User, done) => {
    const UserSerializer = new Serializer("users", {
     onlyRelationship: "articles",
     relators: UserArticlesRelator,
     onlyIdentifier: true,
    });
    expect(getJSON(await UserSerializer.serialize(user))).toEqual({
     jsonapi: { version: "1.0" },
     links: {
      self: "https://www.example.com/users/" + user.id + "/relationships/articles/",
      related: "https://www.example.com/users/" + user.id + "/articles/",
     },
     meta: { userCreatedAt: user.createdAt.toISOString() },
     data: user.articles.map((id) => ({ type: "articles", id })),
    });
    done();
   }
  );
  it.each(sliceRandom(User.storage, NUMBER_OF_TESTS))(
   "tests `onlyRelationship` with `asIncluded` on User %#",
   async (user: User, done) => {
    const UserSerializer = new Serializer("users", {
     onlyRelationship: "articles",
     relators: UserArticlesRelator,
     asIncluded: true,
    });
    expect(getJSON(await UserSerializer.serialize(user))).toEqual({
     jsonapi: { version: "1.0" },
     links: {
      self: "https://www.example.com/users/" + user.id + "/relationships/articles/",
      related: "https://www.example.com/users/" + user.id + "/articles/",
     },
     meta: { userCreatedAt: user.createdAt.toISOString() },
     data: user.articles.map((id) => ({ type: "articles", id })),
     included: user.articles.map((id) => expect.objectContaining({ type: "articles", id })),
    });
    done();
   }
  );
  it.each(sliceRandom(User.storage, NUMBER_OF_TESTS))(
   "tests `onlyRelationship` with `depth` on User %#",
   async (user: User, done) => {
    const UserSerializer = new Serializer("users", {
     onlyRelationship: "articles",
     relators: UserArticlesRelator,
     depth: 1,
    });
    expect(getJSON(await UserSerializer.serialize(user))).toEqual({
     jsonapi: { version: "1.0" },
     links: {
      self: "https://www.example.com/users/" + user.id + "/relationships/articles/",
      related: "https://www.example.com/users/" + user.id + "/articles/",
     },
     meta: { userCreatedAt: user.createdAt.toISOString() },
     data: user.articles.map((id) => expect.objectContaining({ type: "articles", id })),
     included: expect.any(Array),
    });
    done();
   }
  );
  it.each(sliceRandom(Comment.storage, NUMBER_OF_TESTS))(
   "tests `onlyRelationship` with `asIncluded` on Comment %#",
   async (comment: Comment, done) => {
    expect(
     getJSON(await CommentSerializer.serialize(comment, { onlyRelationship: "articles", depth: 1 }))
    ).toEqual({
     jsonapi: { version: "1.0" },
     data: expect.objectContaining({ type: "articles", id: comment.article }),
     included: expect.any(Array),
    });
    done();
   }
  );
  it.each(sliceRandom(Comment.storage, NUMBER_OF_TESTS))(
   "tests `onlyRelationship` with `depth` on Comment %#",
   async (comment: Comment, done) => {
    expect(
     getJSON(await CommentSerializer.serialize(comment, { onlyRelationship: "articles", depth: 1 }))
    ).toEqual({
     jsonapi: { version: "1.0" },
     data: expect.objectContaining({ type: "articles", id: comment.article }),
     included: expect.any(Array),
    });
    done();
   }
  );
 });
});
