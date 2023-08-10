import { Relator, Serializer } from '../../lib';
import { ModelA } from './model-a';

class ModelB {
  id: string;
  a?: ModelA;
}

namespace ModelB {
  export const SerializerB = new Serializer<ModelB>('b', {
    projection: {
      a: 0,
    },
  });

  // This version causes the error
  // export const BtoARelator = new Relator<ModelB, ModelA>(
  //   async (objB) => objB.a,
  //   ModelA.SerializerA,
  //   { relatedName: 'a' }
  // );
  export const BtoARelator = new Relator<ModelB, ModelA>(
    async (objB) => objB.a,
    () => ModelA.SerializerA,
    { relatedName: 'a' }
  );

  SerializerB.setRelators([BtoARelator]);
}

export { ModelB };
