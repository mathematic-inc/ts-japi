import type Article from "./article.model";
import Base from "./base.model";
import type User from "./user.model";

class Comment extends Base {
  public static override find: (id: string) => Comment | undefined;
  public static override remove: (model: Comment) => Comment | undefined;
  public static override save: (model: Comment) => Comment | undefined;
  public author: string;
  public article: string;
  public constructor(id: string, article: Article, author: User) {
    super(id);
    this.article = article.id;
    this.author = author.id;
  }
}

interface Comment {
  getArticle(): Article;
  getAuthor(): User;
}

export default Comment;
