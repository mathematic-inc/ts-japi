import { Paginator } from "../src";
import { User, Article } from "../test/models";
import { getJSON } from "../test/utils/get-json";

const ArticlePaginator = new Paginator((articles: Article | Article[]) => {
 if (Array.isArray(articles)) {
  const nextPage = Number(articles[0].id) + 1;
  const prevPage = Number(articles[articles.length - 1].id) - 1;
  return {
   first: `https://www.example.com/articles/0`,
   last: `https://www.example.com/articles/10`,
   next: nextPage <= 10 ? `https://www.example.com/articles/${nextPage}` : null,
   prev: prevPage >= 0 ? `https://www.example.com/articles/${prevPage}` : null,
  };
 }
 return;
});

// ! The rest of this example is just to illustrate internal behavior.
(async () => {
 const user = new User("sample_user_id");
 const article = new Article("same_article_id", user);

 console.log("Output:", getJSON(ArticlePaginator.paginate([article])));

 // Output: {
 //  first: 'https://www.example.com/articles/0',
 //  last: 'https://www.example.com/articles/10',
 //  prev: null,
 //  next: null
 // }
})();
