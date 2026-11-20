export default abstract class Base {
  public static storage: any[];
  public static find: (id: string) => unknown;
  public static save: (model: any) => unknown;
  public static beforeFindHook?: Array<(id: string) => void>;
  public static beforeSaveHook?: Array<(model: Base) => void>;
  public static afterFindHook?: Array<(id: string) => void>;
  public static afterSaveHook?: Array<(model: Base) => void>;
  public readonly id: string;
  public readonly createdAt: Readonly<Date> = new Date();
  public constructor(id: string) {
    this.id = id;
  }
}
