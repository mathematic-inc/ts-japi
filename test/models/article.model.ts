import Base from "./base.model";
import type Comment from "./comment.model";
import type User from "./user.model";

class Article extends Base {
  public static override find: (id: string) => Article | undefined;
  public static override remove: (model: Article) => Article | undefined;
  public static override save: (model: Article) => Article | undefined;
  public author: string;
  public comments: string[] = [];
  public constructor(id: string, author: User) {
    super(id);
    this.author = author.id;
  }
}

interface Article {
  getAuthor(): User;
  getComments(): Comment[];
}

export default Article;
