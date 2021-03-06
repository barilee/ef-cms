const joi = require('joi');
const {
  JoiValidationConstants,
} = require('../../utilities/JoiValidationConstants');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const { createISODateString } = require('../utilities/DateHandler');

/**
 * @param {object} rawProps the raw document data
 * @constructor
 */
function Correspondence(rawProps) {
  this.archived = rawProps.archived;
  this.documentTitle = rawProps.documentTitle;
  this.documentId = rawProps.documentId;
  this.filedBy = rawProps.filedBy;
  this.userId = rawProps.userId;
  this.filingDate = rawProps.filingDate || createISODateString();
}

Correspondence.VALIDATION_RULES = {
  archived: joi
    .boolean()
    .optional()
    .description('A correspondence document that was archived.'),
  documentId: JoiValidationConstants.UUID.required(),
  documentTitle: joi.string().max(500).required(),
  filedBy: joi.string().max(500).allow('').optional(),
  filingDate: JoiValidationConstants.ISO_DATE.max('now')
    .required()
    .description('Date that this Document was filed.'),
  userId: JoiValidationConstants.UUID.required(),
};

joiValidationDecorator(Correspondence, Correspondence.VALIDATION_RULES, {});

module.exports = { Correspondence };
