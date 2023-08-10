import { Serializer, Relator } from '../../lib';
import { ModelB } from './model-b';

class ModelA {
  id: string;
  b?: ModelB;
}

namespace ModelA {
  export const SerializerA = new Serializer<ModelA>('a', {
    projection: {
      b: 0,
    },
  });

  // This version causes the error
  // export const AtoBRelator = new Relator<ModelA, ModelB>(
  //   async (objA) => objA.b,
  //   ModelB.SerializerB,
  //   { relatedName: 'b' }
  // );
  export const AtoBRelator = new Relator<ModelA, ModelB>(
    async (objA) => objA.b,
    () => ModelB.SerializerB,
    { relatedName: 'b' }
  );
  SerializerA.setRelators([AtoBRelator]);
}

export { ModelA };
