import type Article from "./article.model";
import Base from "./base.model";
import type Comment from "./comment.model";

class User extends Base {
  public static override find: (id: string) => User | undefined;
  public static override remove: (model: User) => User | undefined;
  public static override save: (model: User) => User | undefined;
  public articles: string[] = [];
  public comments: string[] = [];
}

interface User {
  getArticles(): Article[];
  getComments(): Comment[];
}

export default User;
