import { Paginator } from "../lib";
import { Article } from "./models";
import { getJSON } from "./utils/get-json";

const domain = "https://www.example.com";
const pathTo = (path: string) => domain + path;

describe("Paginator Tests", () => {
 describe("Invalid Paginator Tests", () => {});
 let ArticlePaginator: Paginator<Article>;
 it("should construct a Paginator", () => {
  expect(
   () =>
    (ArticlePaginator = new Paginator((articles) => {
     if (Array.isArray(articles)) {
      const nextPage = Number(articles[0].id) + 1;
      const prevPage = Number(articles[articles.length - 1].id) - 1;
      return {
       first: pathTo("/articles/0"),
       last: pathTo(`/articles/${Article.storage.length - 1}`),
       next: nextPage <= Article.storage.length - 1 ? pathTo(`/articles/${nextPage}`) : null,
       prev: prevPage >= 0 ? pathTo(`/articles/${prevPage}`) : null,
      };
     }
     return;
    }))
  ).not.toThrow();
 });
 it.each([
  [0, 2],
  [2, 4],
  [4, 6],
  [4, Article.storage.length],
 ])("should paginate the set of all Articles from index %i to %i", (beginning, end) => {
  // Get dummy data.
  const articles = Article.storage.slice(beginning, end) as Article[];

  const nextPage = Number(articles[0].id) + 1;
  const prevPage = Number(articles[articles.length - 1].id) - 1;
  expect(getJSON(ArticlePaginator.paginate(articles))).toEqual({
   first: pathTo("/articles/0"),
   last: pathTo(`/articles/${Article.storage.length - 1}`),
   next: nextPage <= Article.storage.length - 1 ? pathTo(`/articles/${nextPage}`) : null,
   prev: prevPage >= 0 ? pathTo(`/articles/${prevPage}`) : null,
  });
  expect(ArticlePaginator.paginate(articles[0])).toEqual(void 0);
 });
});
