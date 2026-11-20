import type Article from "./article.model";
import Base from "./base.model";
import type Comment from "./comment.model";

class User extends Base {
  public static override storage: User[];
  public static override find: (id: string) => User | undefined;
  public static override save: (model: User) => User | undefined;
  public readonly articles: readonly string[] = [];
  public readonly comments: readonly string[] = [];
}

interface User {
  getArticles(): Article[];
  getComments(): Comment[];
}

export default User;
