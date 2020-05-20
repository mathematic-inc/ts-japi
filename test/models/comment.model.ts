import Article from "./article.model";
import Base from "./base.model";
import User from "./user.model";

class Comment extends Base {
 public static find: (id: string) => Comment | undefined;
 public static remove: (model: Comment) => Comment | undefined;
 public static save: (model: Comment) => Comment | undefined;
 public author: string;
 public article: string;
 public constructor(id: string, article: Article, author: User) {
  super(id);
  this.article = article.id;
  this.author = author.id;
 }
}

interface Comment {
 getAuthor(): User;
 getArticle(): Article;
}

export default Comment;
