export default abstract class Base {
 public static storage: any[];
 public static find: (id: string) => unknown;
 public static remove: (model: any) => unknown;
 public static save: (model: any) => unknown;
 public static beforeFindHook?: Array<(id: string) => void>;
 public static beforeSaveHook?: Array<<T extends Base>(model: T) => void>;
 public static beforeRemoveHook?: Array<<T extends Base>(model: T) => void>;
 public static afterFindHook?: Array<(id: string) => void>;
 public static afterSaveHook?: Array<<T extends Base>(model: T) => void>;
 public static afterRemoveHook?: Array<<T extends Base>(model: T) => void>;
 public id: string;
 public createdAt = new Date();
 public constructor(...args: any[]) {
  this.id = args.shift();
 }
}
