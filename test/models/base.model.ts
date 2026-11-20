export default abstract class Base {
  public static storage: any[];
  public static find: (id: string) => unknown;
  public static save: (model: any) => unknown;
  public static beforeFindHook?: Array<(id: string) => void>;
  public static beforeSaveHook?: Array<(model: Base) => void>;
  public static afterFindHook?: Array<(id: string) => void>;
  public static afterSaveHook?: Array<(model: Base) => void>;
  public id: string;
  public createdAt = new Date();
  public constructor(...args: any[]) {
    this.id = args.shift();
  }
}
