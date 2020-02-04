const joi = require('@hapi/joi');
const { joiValidationDecorator } = require('./JoiValidationDecorator');

/**
 * fake entity constructor
 *
 * @param {object} raw raw entity
 */
function MockEntity1(raw) {
  Object.assign(this, raw);
}

MockEntity1.validationName = 'MockEntity1';

MockEntity1.errorToMessageMap = {
  favoriteNumber: 'Tell me your favorite number.',
  name: 'Name is definitely a required field.',
};

joiValidationDecorator(
  MockEntity1,
  joi.object().keys({
    favoriteNumber: joi.number().required(),
    hasNickname: joi.boolean().required(),
    name: joi.string().required(),
  }),
  undefined,
  MockEntity1.errorToMessageMap,
);

const MockEntity2 = function(raw) {
  Object.assign(this, raw);
};

const MockEntity2Schema = joi.object().keys({
  arry1: joi
    .array()
    .items(joi.object().keys({ foo: joi.string().required() }))
    .required(),
  arry2: joi
    .array()
    .items(joi.string())
    .optional(),
  favoriteNumber: joi.number().required(),
  hasNickname: joi.boolean().required(),
  name: joi.string().required(),
  obj1: joi
    .object()
    .keys({ foo: joi.string().required() })
    .required(),
});

joiValidationDecorator(MockEntity2, MockEntity2Schema, undefined, {
  arry1: 'That is required',
  foo: 'lend me some sugar',
});

describe('Joi Validation Decorator', () => {
  describe('validation errors with arrays', () => {
    it('returns validation errors', () => {
      const mock1Properties = {
        favoriteNumber: 7,
        hasNickname: false,
        name: 'name',
      };
      const validNested = new MockEntity1(mock1Properties);
      const obj = new MockEntity2({
        arry1: [{ baz: validNested, foo: 'bar' }, {}],
        name: 'Name',
        optionalThing: validNested,
      });
      expect(obj.isValid()).toBe(false);
      const errors = obj.getFormattedValidationErrors();
      expect(Object.keys(errors).length).not.toBe(0);
      const rawEntity = validNested.toRawObject();
      expect(rawEntity).toEqual(mock1Properties);
    });

    it('returns default validation error for field without formatted string in errorToMessageMap', () => {
      const invalidEntity = new MockEntity1({
        favoriteNumber: 7,
        name: 'name',
      });
      expect(invalidEntity.isValid()).toBe(false);
      const errors = invalidEntity.getFormattedValidationErrors();
      const joiGeneratedMessageNotFromErrorToMessageMap = errors.hasNickname;
      expect(joiGeneratedMessageNotFromErrorToMessageMap).toBeDefined();
    });

    it('should correctly return strings as items in an array of strings', () => {
      const obj = new MockEntity2({
        arry1: [{ baz: 'foz', foo: 'bar' }],
        arry2: ['one', 'two'],
        favoriteNumber: 13,
        hasNickname: false,
        name: 'Name',
        obj1: { foo: 'bar' },
      });

      expect(obj.isValid()).toBe(true);
      const rawEntity = obj.toRawObject();
      expect(rawEntity.arry2[0]).toEqual('one');
      expect(rawEntity.arry2[1]).toEqual('two');
    });
  });

  it('should have access to the schema', () => {
    const obj = new MockEntity2({});
    expect(obj.getSchema()).toEqual(MockEntity2Schema);
  });
});
