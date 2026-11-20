import { camelCase, capitalize } from "lodash";

import type Base from "../models/base.model";
import { findAllExisting } from "./find-all-existing";
import { pushIfNotExists } from "./push-if-not-exists";

const ModelFactory = {
  addArrayAttribute(name: string, target: typeof Base, source: typeof Base) {
    const getterName = `get${capitalize(camelCase(name))}`;
    target.beforeSaveHook = target.beforeSaveHook ?? [];
    (target.prototype as any)[getterName] = function (this: unknown) {
      return findAllExisting((this as any)[name], (id: string) => source.find(id));
    };
    target.beforeSaveHook.push((model) => {
      findAllExisting((model as any)[name], (id: string) => source.find(id));
    });
  },
  addSingleAttribute(name: string, othername: string, target: typeof Base, source: typeof Base) {
    const getterName = `get${capitalize(camelCase(name))}`;
    target.beforeSaveHook = target.beforeSaveHook ?? [];
    (target.prototype as any)[getterName] = function (this: unknown) {
      return source.find((this as any)[name]);
    };
    target.beforeSaveHook.push((model) => {
      const sourceModel = (model as any)[getterName]();
      if (sourceModel === undefined) {
        throw new Error(`no ${name}`);
      }
      pushIfNotExists(sourceModel[othername], model.id, (id) => id === model.id);
    });
  },
  createModel(model: typeof Base) {
    model.storage = [];
    model.find = function (this: typeof Base, id: string) {
      if (this.beforeFindHook) {
        for (const hook of this.beforeFindHook) {
          hook(id);
        }
      }
      const result = this.storage.find((u) => u.id === id);
      if (this.afterFindHook) {
        for (const hook of this.afterFindHook) {
          hook(id);
        }
      }
      return result;
    };
    model.save = function (this: typeof Base, model: Base) {
      if (this.beforeSaveHook) {
        for (const hook of this.beforeSaveHook) {
          hook(model);
        }
      }
      pushIfNotExists(this.storage, model, (m) => m.id === model.id);
      if (this.afterSaveHook) {
        for (const hook of this.afterSaveHook) {
          hook(model);
        }
      }
      return model;
    };
  },
};

export default ModelFactory;
