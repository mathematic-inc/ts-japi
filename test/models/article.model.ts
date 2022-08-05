import Base from './base.model';
import Comment from './comment.model';
import User from './user.model';

class Article extends Base {
  public static find: (id: string) => Article | undefined;
  public static remove: (model: Article) => Article | undefined;
  public static save: (model: Article) => Article | undefined;
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
