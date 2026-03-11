import type Article from "./article.model";
import Base from "./base.model";
import type Comment from "./comment.model";

class User extends Base {
  public static find: (id: string) => User | undefined;
  public static remove: (model: User) => User | undefined;
  public static save: (model: User) => User | undefined;
  public articles: string[] = [];
  public comments: string[] = [];
}

interface User {
  getArticles(): Article[];
  getComments(): Comment[];
}

export default User;
