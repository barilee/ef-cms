const joi = require('@hapi/joi');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const { CASE_SEARCH_MIN_YEAR } = require('../EntityConstants');

CaseSearch.validationName = 'CaseSearch';

/**
 * Case Search entity
 *
 * @param {object} rawProps the raw case search data
 * @constructor
 */
function CaseSearch(rawProps) {
  this.petitionerName = rawProps.petitionerName;
  this.yearFiledMin = rawProps.yearFiledMin || CASE_SEARCH_MIN_YEAR;
  this.yearFiledMax = rawProps.yearFiledMax || undefined;
  this.petitionerState = rawProps.petitionerState || undefined;
  this.countryType = rawProps.countryType || undefined;
}

CaseSearch.VALIDATION_ERROR_MESSAGES = {
  petitionerName: 'Enter a name',
  yearFiledMax: [
    {
      contains: 'must be larger',
      message: 'Enter an ending year which occurs after start year',
    },
    'Enter a valid ending year',
  ],
  yearFiledMin: 'Enter a valid start year',
};

CaseSearch.schema = joi.object().keys({
  countryType: joi.string().max(500).optional(), // TODO: enum
  petitionerName: joi.string().max(500).required(),
  petitionerState: joi.string().max(500).optional(), // TODO: enum
  yearFiledMax: joi
    .number()
    .integer()
    .min(joi.ref('yearFiledMin'))
    .max(new Date().getFullYear())
    .when('yearFiledMin', {
      is: joi.number(),
      otherwise: joi.number().min(1900),
      then: joi.number().min(joi.ref('yearFiledMin')),
    }),
  yearFiledMin: joi.number().integer().min(1900).max(new Date().getFullYear()),
});

joiValidationDecorator(
  CaseSearch,
  CaseSearch.schema,
  CaseSearch.VALIDATION_ERROR_MESSAGES,
);

module.exports = { CaseSearch };
