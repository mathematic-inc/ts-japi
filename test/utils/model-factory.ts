import { camelCase, capitalize } from 'lodash';
import Base from '../models/base.model';
import { findAllExisting } from './find-all-existing';
import { pushIfNotExists } from './push-if-not-exists';

const ModelFactory = {
  addArrayAttribute<T extends typeof Base, U extends typeof Base>(
    name: string,
    target: T,
    source: U
  ) {
    const getterName = `get${capitalize(camelCase(name))}`;
    target.afterRemoveHook = target.afterRemoveHook ?? [];
    target.beforeSaveHook = target.beforeSaveHook ?? [];
    if (!target.prototype) {
      target.prototype = {} as any;
    }
    (target.prototype as any)[getterName] = function <Target>(this: Target) {
      return findAllExisting((this as any)[name], (id: string) => source.find(id));
    };
    target.afterRemoveHook.push(<Target, Source extends Base>(model: Target) => {
      (model as any)[getterName]().map((m: Source) => source.remove(m));
    });
    target.beforeSaveHook.push(<Target>(model: Target) => {
      findAllExisting((model as any)[name], (id: string) => source.find(id));
    });
  },
  addSingleAttribute<T extends typeof Base, U extends typeof Base>(
    name: string,
    othername: string,
    target: T,
    source: U
  ) {
    const getterName = `get${capitalize(camelCase(name))}`;
    target.beforeSaveHook = target.beforeSaveHook ?? [];
    if (!target.prototype) {
      target.prototype = {} as any;
    }
    (target.prototype as any)[getterName] = function <Target>(this: Target) {
      return source.find((this as any)[name]);
    };
    target.beforeSaveHook.push(<Target extends Base>(model: Target) => {
      const sourceModel = (model as any)[getterName]();
      if (!sourceModel) throw new Error(`no ${name}`);
      pushIfNotExists(sourceModel[othername], model.id, (id) => id === model.id);
    });
  },
  createModel<T extends typeof Base>(model: T) {
    model.storage = [];
    model.find = function (this: T, id: string) {
      if (this.beforeFindHook) this.beforeFindHook.forEach((hook) => hook(id));
      const result = this.storage.find((u) => u.id === id);
      if (this.afterFindHook) this.afterFindHook.forEach((hook) => hook(id));
      return result;
    };
    model.remove = function <U extends Base>(this: T, obj: U) {
      if (this.beforeRemoveHook) this.beforeRemoveHook.forEach((hook) => hook(obj));
      let idx = this.storage.findIndex((u) => u.id === obj.id);
      if (typeof idx === 'number') {
        delete this.storage[idx];
      }
      if (this.afterRemoveHook) this.afterRemoveHook.forEach((hook) => hook(obj));
      return obj;
    };
    model.save = function <U extends Base>(this: T, model: U) {
      if (this.beforeSaveHook) this.beforeSaveHook.forEach((hook) => hook(model));
      pushIfNotExists(this.storage, model, (m) => m.id === model.id);
      if (this.afterSaveHook) this.afterSaveHook.forEach((hook) => hook(model));
      return model;
    };
  },
};

export default ModelFactory;
