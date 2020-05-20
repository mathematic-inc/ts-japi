import Article from "./article.model";
import Base from "./base.model";
import Comment from "./comment.model";

class User extends Base {
 public static find: (id: string) => User | undefined;
 public static remove: (model: User) => User | undefined;
 public static save: (model: User) => User | undefined;
 public articles: string[] = [];
 public comments: string[] = [];
 public constructor(id: string) {
  super(id);
 }
}

interface User {
 getComments(): Comment[];
 getArticles(): Article[];
}

export default User;
