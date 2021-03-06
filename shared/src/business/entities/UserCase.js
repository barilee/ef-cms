const joi = require('joi');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const { Case } = require('./cases/Case');
const { createISODateString } = require('../utilities/DateHandler');

UserCase.validationName = 'UserCase';

/**
 * UserCase Entity
 * represents a user-to-case mapping record
 *
 * @param {object} rawUserCase the raw user-case data
 * @constructor
 */
function UserCase(rawUserCase) {
  this.entityName = 'UserCase';
  this.caseCaption = rawUserCase.caseCaption;
  this.createdAt = rawUserCase.createdAt || createISODateString();
  this.docketNumber = rawUserCase.docketNumber;
  this.docketNumberWithSuffix = rawUserCase.docketNumberWithSuffix;
  this.leadDocketNumber = rawUserCase.leadDocketNumber;
  this.status = rawUserCase.status;
}

joiValidationDecorator(
  UserCase,
  joi.object().keys({
    caseCaption: Case.VALIDATION_RULES.caseCaption,
    createdAt: Case.VALIDATION_RULES.createdAt,
    docketNumber: Case.VALIDATION_RULES.docketNumber,
    docketNumberWithSuffix: Case.VALIDATION_RULES.docketNumberWithSuffix,
    entityName: joi.string().valid('UserCase').required(),
    leadDocketNumber: Case.VALIDATION_RULES.leadDocketNumber,
    status: Case.VALIDATION_RULES.status,
  }),
  Case.VALIDATION_ERROR_MESSAGES,
);

exports.UserCase = UserCase;
