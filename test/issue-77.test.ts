import { Relator, Serializer } from "../lib";

describe("Issue #77 - Related fields should not appear in attributes", () => {
  interface Article {
    id: string;
    title: string;
  }

  interface User {
    articles: Article[];
    id: string;
    name: string;
  }

  const ArticleSerializer = new Serializer<Article>("Article");
  const UserArticleRelator = new Relator<User, Article>(
    async (user) => user.articles,
    ArticleSerializer
  );
  const UserSerializer = new Serializer<User>("User", {
    relators: [UserArticleRelator],
  });

  it("should exclude relator fields from attributes by default", async () => {
    const user: User = {
      id: "1",
      name: "Foo",
      articles: [
        { id: "1", title: "Article 1" },
        { id: "2", title: "Article 2" },
      ],
    };

    const document = await UserSerializer.serialize(user);
    const data = document.data as any;

    expect(data.attributes).not.toHaveProperty("Article");
    expect(data.attributes).toHaveProperty("name", "Foo");
    expect(data.relationships).toHaveProperty("Article");
  });
});
