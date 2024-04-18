import { PolymorphicSerializer, Serializer } from '../lib';
import Resource from '../lib/models/resource.model';

describe('Issue #80 - Polymorphic serializer', () => {
  abstract class Model {
    public type: string;

    constructor(public id: string) {}
  }

  class Model1 extends Model {
    constructor(id: string, public model1: string) {
      super(id);
      this.type = 'type:Model1';
    }
  }

  class Model2 extends Model {
    constructor(id: string, public model2: string) {
      super(id);
      this.type = 'type:Model2';
    }
  }

  class Model3 extends Model {
    constructor(id: string, public model2: string) {
      super(id);
      this.type = 'type:Model3';
    }
  }

  it('should work polymorphicly', async () => {
    const model1: Model1 = new Model1('1', 'model1');
    const model2: Model2 = new Model2('2', 'model2');
    const model3: Model3 = new Model3('3', 'model3');

    const Model1Serializer = new Serializer<Model1>('Model1');
    const Model2Serializer = new Serializer<Model2>('Model2');

    const PolySerializer = new PolymorphicSerializer<Model>('Model', 'type', {
      'type:Model1': Model1Serializer,
      'type:Model2': Model2Serializer,
    });

    const data = (await PolySerializer.serialize([model1, model2, model3])) as {
      data: Resource<Model>;
    };

    expect(data.data).toBeInstanceOf(Array);
    expect(data.data).toHaveLength(3);
    expect(data.data[0].id).toEqual('1');
    expect(data.data[0].type).toEqual('Model1');
    expect(data.data[1].id).toEqual('2');
    expect(data.data[1].type).toEqual('Model2');
    expect(data.data[2].id).toEqual('3');
    expect(data.data[2].type).toEqual('Model');
  });

  it('should serialize array as array', async () => {
    const model1: Model1 = new Model1('1', 'model1');

    const Model1Serializer = new Serializer<Model1>('Model1');
    const Model2Serializer = new Serializer<Model2>('Model2');

    const PolySerializer = new PolymorphicSerializer<Model>('Model', 'type', {
      'type:Model1': Model1Serializer,
      'type:Model2': Model2Serializer,
    });

    const data = (await PolySerializer.serialize([model1])) as {
      data: Resource<Model>;
    };

    expect(data.data).toBeInstanceOf(Array);
    expect(data.data).toHaveLength(1);
    expect(data.data[0].id).toEqual('1');
    expect(data.data[0].type).toEqual('Model1');
  });

  it('should correctly handle empty input', async () => {
    const Model1Serializer = new Serializer<Model1>('Model1');
    const Model2Serializer = new Serializer<Model2>('Model2');

    const PolySerializer = new PolymorphicSerializer<Model>('Model', 'type', {
      'type:Model1': Model1Serializer,
      'type:Model2': Model2Serializer,
    });

    const data = (await PolySerializer.serialize([])) as {
      data: Resource<Model>;
    };

    expect(data.data).toBeInstanceOf(Array);
    expect(data.data).toHaveLength(0);
  });

  it('should correctly handle non-array input', async () => {
    const model1: Model1 = new Model1('1', 'model1');

    const Model1Serializer = new Serializer<Model1>('Model1');
    const Model2Serializer = new Serializer<Model2>('Model2');

    const PolySerializer = new PolymorphicSerializer<Model>('Model', 'type', {
      'type:Model1': Model1Serializer,
      'type:Model2': Model2Serializer,
    });

    const data = (await PolySerializer.serialize(model1)) as {
      data: Resource<Model>;
    };

    expect(data.data).toBeInstanceOf(Resource);
    expect(data.data.id).toEqual('1');
    expect(data.data.type).toEqual('Model1');
  });
});
