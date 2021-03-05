import { Serializer } from '../src';
import { User } from '../test/models';
import { getJSON } from '../test/utils/get-json';

const UserSerializer = new Serializer('users');

(async () => {
  const user = new User('sample_user_id');

  console.log('Output:', getJSON(await UserSerializer.serialize(user)));

  // Output: {
  //  jsonapi: { version: '1.0' },
  //  data: {
  //   type: 'users',
  //   id: 'sample_user_id',
  //   attributes: {
  //     createdAt: '2020-05-20T15:44:37.650Z',
  //     articles: [],
  //     comments: []
  //   }
  //  }
  // }
})();
