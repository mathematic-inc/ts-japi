import Article from './article.model';
import Comment from './comment.model';
import User from './user.model';
import ModelFactory from '../utils/model-factory';

ModelFactory.createModel(User);
ModelFactory.addArrayAttribute('comments', User, Comment);
ModelFactory.addArrayAttribute('articles', User, Article);

ModelFactory.createModel(Article);
ModelFactory.addSingleAttribute('author', 'articles', Article, User);
ModelFactory.addArrayAttribute('comments', Article, Comment);

ModelFactory.createModel(Comment);
ModelFactory.addSingleAttribute('author', 'comments', Comment, User);
ModelFactory.addSingleAttribute('article', 'comments', Comment, Article);

export { Article, Comment, User };
