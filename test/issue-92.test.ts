import { PolymorphicSerializer, Serializer } from '../lib';
import Resource from '../lib/models/resource.model';

describe('Issue #92 - Polymorphic serializer ordering', () => {
  abstract class Model {
    public type: string;

    constructor(public id: string) {}
  }

  class Model1 extends Model {
    constructor(id: string) {
      super(id);
      this.type = 'type:Model1';
    }
  }

  class Model2 extends Model {
    constructor(id: string) {
      super(id);
      this.type = 'type:Model2';
    }
  }

  it('should maintain data input ordering', async () => {
    const model1A: Model1 = new Model1('1a');
    const model1B: Model1 = new Model1('1b');
    const model1C: Model1 = new Model1('1c');
    const model2A: Model2 = new Model2('2a');
    const model2B: Model2 = new Model2('2b');

    const Model1Serializer = new Serializer<Model1>('Model1');
    const Model2Serializer = new Serializer<Model2>('Model2');

    const PolySerializer = new PolymorphicSerializer<Model>('Model', 'type', {
      'type:Model1': Model1Serializer,
      'type:Model2': Model2Serializer,
    });

    const data = (await PolySerializer.serialize([
      model1A,
      model2A,
      model1C,
      model2B,
      model1B,
    ])) as {
      data: Resource<Model>;
    };

    expect(data.data).toBeInstanceOf(Array);
    expect(data.data).toHaveLength(5);

    expect(data.data[0].id).toEqual('1a');
    expect(data.data[0].type).toEqual('Model1');

    expect(data.data[1].id).toEqual('2a');
    expect(data.data[1].type).toEqual('Model2');

    expect(data.data[2].id).toEqual('1c');
    expect(data.data[2].type).toEqual('Model1');

    expect(data.data[3].id).toEqual('2b');
    expect(data.data[3].type).toEqual('Model2');

    expect(data.data[4].id).toEqual('1b');
    expect(data.data[4].type).toEqual('Model1');
  });
});
