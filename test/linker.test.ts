import { Linker, Metaizer } from "../lib";
import { Article, User } from "./models";
import Link from "../lib/models/link.model";
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

describe("Linker Tests", () => {
 describe("Invalid Linker Tests", () => {});
 describe("Zero Argument Linker Tests", () => {
  let VoidLinker: Linker<[]>;
  it("should construct a Zero Argument Linker", () => {
   expect(() => (VoidLinker = new Linker(() => pathTo(`/`)))).not.toThrow();
  });
  it("test a Zero Argument Linker", () => {
   let link: Link;
   expect(() => (link = VoidLinker.link())).not.toThrow();
   expect(link).toBeInstanceOf(Link);
   expect(getJSON(link)).toBe(pathTo(`/`));
  });
 });
 describe("One Argument Linker Tests", () => {
  let UserLinker: Linker<[User]>;
  it("should construct a One Argument Linker", () => {
   expect(() => (UserLinker = new Linker((user) => pathTo(`/users/${user.id}`)))).not.toThrow();
  });
  it.each(sliceRandom(User.storage, NUMBER_OF_TESTS).map((user) => user.id))(
   "tests a One Argument Linker on User ID %s",
   (userId) => {
    // Get dummy data
    const user = User.find(userId);

    let link: Link;
    expect(() => (link = UserLinker.link(user))).not.toThrow();
    expect(link).toBeInstanceOf(Link);
    expect(getJSON(link)).toBe(pathTo(`/users/${user.id}`));
   }
  );
 });
 describe("Two Argument Linker Tests", () => {
  describe("With Minimum Options", () => {
   let UserArticlesLinker: Linker<[User, Article | Article[]]>;
   it("should construct a Two Argument Linker", () => {
    expect(
     () =>
      (UserArticlesLinker = new Linker((user, articles) =>
       Array.isArray(articles)
        ? pathTo(`/users/${user.id}/articles/`)
        : pathTo(`/users/${user.id}/articles/${articles.id}`)
      ))
    ).not.toThrow();
   });
   it.each(sliceRandom(User.storage, NUMBER_OF_TESTS).map((user) => user.id))(
    "tests a Two Argument Linker on User ID %s",
    (userId) => {
     const user = User.find(userId);
     const articles = user.getArticles();

     let link: Link;
     expect(() => (link = UserArticlesLinker.link(user, articles))).not.toThrow();
     expect(link).toBeInstanceOf(Link);
     expect(getJSON(link)).toBe(pathTo(`/users/${user.id}/articles/`));
    }
   );
  });
  describe("With All Options", () => {
   let UserArticlesLinker: Linker<[User, Article | Article[]]>;
   it("should construct a Two Argument Linker", () => {
    const UserArticleMetaizer = new Metaizer((user, articles) =>
     Array.isArray(articles)
      ? { userCreatedAt: user.createdAt }
      : { userCreatedAt: user.createdAt, articleCreatedAt: articles.createdAt }
    );

    expect(
     () =>
      (UserArticlesLinker = new Linker(
       (user: User, articles: Article | Article[]) =>
        Array.isArray(articles)
         ? pathTo(`/users/${user.id}/articles/`)
         : pathTo(`/users/${user.id}/articles/${articles.id}`),
       {
        metaizer: UserArticleMetaizer,
       }
      ))
    ).not.toThrow();
   });
   it.each(sliceRandom(Article.storage, NUMBER_OF_TESTS).map((article) => article.id))(
    "tests a Two Argument Linker on User ID %s",
    (articleId) => {
     const article = Article.find(articleId);
     const user = article.getAuthor();

     let link: Link;
     expect(() => (link = UserArticlesLinker.link(user, article))).not.toThrow();
     expect(link).toBeInstanceOf(Link);
     expect(getJSON(link)).toEqual({
      href: pathTo(`/users/${user.id}/articles/${article.id}`),
      meta: {
       userCreatedAt: user.createdAt.toISOString(),
       articleCreatedAt: article.createdAt.toISOString(),
      },
     });
    }
   );
  });
 });
});
