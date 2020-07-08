const joi = require('@hapi/joi');
const {
  calculateISODate,
  createISODateString,
  formatDateString,
  FORMATS,
} = require('../../utilities/DateHandler');
const {
  CORRECTED_TRANSCRIPT_DOCUMENT_TYPE,
  VALIDATION_ERROR_MESSAGES,
} = require('./CourtIssuedDocumentConstants');
const {
  JoiValidationConstants,
} = require('../../../utilities/JoiValidationConstants');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const { replaceBracketed } = require('../../utilities/replaceBracketed');

const yesterdayMoment = calculateISODate({ howMuch: -1, unit: 'days' });
const yesterdayFormatted = formatDateString(
  createISODateString(yesterdayMoment),
  FORMATS.MMDDYYYY,
);

/**
 *
 * @param {object} rawProps the raw document data
 * @constructor
 */
function CourtIssuedDocumentTypeE(rawProps) {
  this.attachments = rawProps.attachments;
  this.date = rawProps.date;
  this.documentTitle = rawProps.documentTitle;
  this.documentType = rawProps.documentType;
}

CourtIssuedDocumentTypeE.prototype.getDocumentTitle = function () {
  return replaceBracketed(
    this.documentTitle,
    formatDateString(this.date, 'MM-DD-YYYY'),
  );
};

CourtIssuedDocumentTypeE.schema = {
  attachments: joi.boolean().required(),
  date: joi.when('documentType', {
    is: CORRECTED_TRANSCRIPT_DOCUMENT_TYPE,
    otherwise: JoiValidationConstants.ISO_DATE.min(
      yesterdayFormatted,
    ).required(),
    then: JoiValidationConstants.ISO_DATE.max('now').required(),
  }),
  documentTitle: joi.string().optional(),
  documentType: joi.string().required(),
};

joiValidationDecorator(
  CourtIssuedDocumentTypeE,
  CourtIssuedDocumentTypeE.schema,
  VALIDATION_ERROR_MESSAGES,
);

module.exports = { CourtIssuedDocumentTypeE };
