import { Linker, Metaizer, Relator, Serializer } from "../lib";
import Relationship from "../lib/models/relationship.model";
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
     (ArticleAuthorRelator = new Relator(
      async (article: Article) => article.getAuthor(),
      UserSerializer
     ))
   ).not.toThrow();
  });
  it.each(sliceRandom(Article.storage, NUMBER_OF_TESTS).map((article) => article.id))(
   "tests a One-to-One Relator on Article ID %s",
   async (articleId, done) => {
    // Get dummy data.
    const article = Article.find(articleId);

    // Testing methods
    let relationships: Relationship;
    await expect(ArticleAuthorRelator.getRelatedData(article)).resolves.toBeInstanceOf(User);
    await expect(
     ArticleAuthorRelator.getRelationship(article).then((rships) => (relationships = rships))
    ).resolves.toBeInstanceOf(Relationship);

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
      (ArticleCommentsRelator = new Relator(
       async (article: Article) => article.getComments(),
       CommentSerializer
      ))
    ).not.toThrow();
   });
   it.each(sliceRandom(Article.storage, NUMBER_OF_TESTS).map((article) => article.id))(
    "tests a One-to-Many Relator on Article ID %s",
    async (articleId, done) => {
     // Get dummy data.
     const article = Article.find(articleId);

     // Testing methods
     let relationships: Relationship;
     await expect(ArticleCommentsRelator.getRelatedData(article)).resolves.toBeInstanceOf(Array);
     await expect(
      ArticleCommentsRelator.getRelationship(article).then((rships) => (relationships = rships))
     ).resolves.toBeInstanceOf(Relationship);

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
      (UserArticlesRelator = new Relator(
       async (user: User) => user.getArticles(),
       ArticleSerializer,
       {
        linkers: {
         relationship: UserArticleRelationshipLinker,
         related: UserArticleLinker,
        },
        metaizer: UserArticleMetaizer,
       }
      ))
    ).not.toThrow();
   });
   it.each(sliceRandom(User.storage, NUMBER_OF_TESTS).map((user) => user.id))(
    "tests a One-to-Many Relator on User ID %s",
    async (userId, done) => {
     // Get dummy data.
     const user = User.find(userId);

     // Testing methods
     let relationships: Relationship;
     await expect(UserArticlesRelator.getRelatedData(user)).resolves.toBeInstanceOf(Array);
     await expect(
      UserArticlesRelator.getRelationship(user).then((rships) => (relationships = rships))
     ).resolves.toBeInstanceOf(Relationship);

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
 describe("Cache Tests", () => {
  it.each(sliceRandom(Article.storage, NUMBER_OF_TESTS).map((article) => article.id))(
   "Should cache fetched data for Article ID %s",
   async (articleId) => {
    const article = Article.find(articleId);

    // test when fetch returns multiple elements
    const commentsCache = [];
    const ArticleCommentsRelator = new Relator(
     async (article: Article) => article.getComments(),
     CommentSerializer
    );

    await ArticleCommentsRelator.getRelationship(article, commentsCache);
    expect(commentsCache).toHaveLength(article.getComments().length);

    // test when fetch returns a single element
    const authorCache = [];
    const ArticleAuthorRelator = new Relator(
     async (article: Article) => article.getAuthor(),
     UserSerializer
    );

    await ArticleAuthorRelator.getRelationship(article, authorCache);
    expect(authorCache).toHaveLength(1);
   }
  );
 });
});
