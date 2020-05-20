import { Linker, Metaizer, Relator, Serializer } from "../lib";
import Relationships from "../lib/models/relationships.model";
import { Article, User, Comment } from "./models";
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

const UserSerializer = new Serializer<User>("users");
const CommentSerializer = new Serializer<Comment>("comments");
const ArticleSerializer = new Serializer<Article>("articles");
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

describe("Relator Tests", () => {
 describe("Invalid Relator Tests", () => {});
 describe("One-to-One Relator Tests", () => {
  let ArticleAuthorRelator: Relator<Article, User>;
  it("should construct a One-to-One Relator", () => {
   expect(
    () =>
     (ArticleAuthorRelator = new Relator(async (article: Article) => article.getAuthor(), {
      serializer: UserSerializer,
     }))
   ).not.toThrow();
  });
  it.each(sliceRandom(Article.storage, NUMBER_OF_TESTS).map((article) => article.id))(
   "tests a One-to-One Relator on Article ID %s",
   async (articleId, done) => {
    // Get dummy data.
    const article = Article.find(articleId);

    // Testing methods
    let relationships: Relationships;
    expect(ArticleAuthorRelator.getRelatedSerializer()).toBe(UserSerializer);
    await expect(ArticleAuthorRelator.getRelatedData(article)).resolves.toBeInstanceOf(User);
    await expect(
     ArticleAuthorRelator.getRelationship(article).then((rships) => (relationships = rships))
    ).resolves.toBeInstanceOf(Relationships);

    // Test JSON
    expect(getJSON(relationships)).toEqual({
     data: { type: "users", id: article.author },
    });

    done();
   }
  );
 });
 describe("One-to-Many Relator Tests", () => {
  describe("With Minimal Options", () => {
   let ArticleCommentsRelator;
   it("should construct a One-to-Many Relator", () => {
    expect(
     () =>
      (ArticleCommentsRelator = new Relator(async (article: Article) => article.getComments(), {
       serializer: CommentSerializer,
      }))
    ).not.toThrow();
   });
   it.each(sliceRandom(Article.storage, NUMBER_OF_TESTS).map((article) => article.id))(
    "tests a One-to-Many Relator on Article ID %s",
    async (articleId, done) => {
     // Get dummy data.
     const article = Article.find(articleId);

     // Testing methods
     let relationships: Relationships;
     expect(ArticleCommentsRelator.getRelatedSerializer()).toBe(CommentSerializer);
     await expect(ArticleCommentsRelator.getRelatedData(article)).resolves.toBeInstanceOf(Array);
     await expect(
      ArticleCommentsRelator.getRelationship(article).then((rships) => (relationships = rships))
     ).resolves.toBeInstanceOf(Relationships);

     // Test JSON
     expect(getJSON(relationships)).toEqual({
      data: article.comments.map((commentId) => ({ type: "comments", id: commentId })),
     });

     done();
    }
   );
  });
  describe("With All Options", () => {
   let UserArticlesRelator: Relator<User, Article>;
   it("should construct a One-to-Many Relator", () => {
    expect(
     () =>
      (UserArticlesRelator = new Relator(async (user: User) => user.getArticles(), {
       serializer: ArticleSerializer,
       linkers: {
        relationship: UserArticleRelationshipLinker,
        related: UserArticleLinker,
       },
       metaizer: UserArticleMetaizer,
      }))
    ).not.toThrow();
   });
   it.each(sliceRandom(User.storage, NUMBER_OF_TESTS).map((user) => user.id))(
    "tests a One-to-Many Relator on User ID %s",
    async (userId, done) => {
     // Get dummy data.
     const user = User.find(userId);

     // Testing methods
     let relationships: Relationships;
     expect(UserArticlesRelator.getRelatedSerializer()).toBe(ArticleSerializer);
     await expect(UserArticlesRelator.getRelatedData(user)).resolves.toBeInstanceOf(Array);
     await expect(
      UserArticlesRelator.getRelationship(user).then((rships) => (relationships = rships))
     ).resolves.toBeInstanceOf(Relationships);

     // Test JSON
     expect(getJSON(relationships)).toEqual({
      links: {
       self: pathTo(`/users/${user.id}/relationships/articles/`),
       related: pathTo(`/users/${user.id}/articles/`),
      },
      data: user.articles.map((id) => ({ type: "articles", id })),
      meta: { userCreatedAt: user.createdAt.toISOString() },
     });

     done();
    }
   );
  });
 });
});
