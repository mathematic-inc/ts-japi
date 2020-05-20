import { ErrorSerializer } from "../src";
import { getJSON } from "../test/utils/get-json";

const PrimitiveErrorSerializer = new ErrorSerializer();

(async () => {
 const error = new Error("badness");

 console.log("Output:", getJSON(PrimitiveErrorSerializer.serialize(error)));

 // Output: {
 //  errors: [ { code: 'Error', detail: 'badness' } ],
 //  jsonapi: { version: '1.0' }
 // }
})();
