const joi = require('@hapi/joi');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const { CHAMBERS_SECTIONS, SECTIONS } = require('./WorkQueue');
const { createISODateString } = require('../utilities/DateHandler');
const { getTimestampSchema } = require('../../utilities/dateSchema');
const joiStrictTimestamp = getTimestampSchema();
const { DOCKET_NUMBER_MATCHER } = require('./EntityConstants');

/**
 * constructor
 *
 * @param {object} rawMessage the raw message data
 * @constructor
 */
function CaseMessage(rawMessage, { applicationContext }) {
  if (!applicationContext) {
    throw new TypeError('applicationContext must be defined');
  }

  this.caseId = rawMessage.caseId;
  this.caseStatus = rawMessage.caseStatus;
  this.createdAt = rawMessage.createdAt || createISODateString();
  this.docketNumber = rawMessage.docketNumber;
  this.docketNumberWithSuffix = rawMessage.docketNumberWithSuffix;
  this.entityName = 'CaseMessage';
  this.from = rawMessage.from;
  this.fromSection = rawMessage.fromSection;
  this.fromUserId = rawMessage.fromUserId;
  this.message = rawMessage.message;
  this.messageId = rawMessage.messageId || applicationContext.getUniqueId();
  this.subject = rawMessage.subject;
  this.to = rawMessage.to;
  this.toSection = rawMessage.toSection;
  this.toUserId = rawMessage.toUserId;
}

CaseMessage.validationName = 'CaseMessage';

CaseMessage.VALIDATION_ERROR_MESSAGES = {
  message: 'Enter a message',
  subject: 'Enter a subject line',
  toSection: 'Select a section',
  toUserId: 'Select a recipient',
};

CaseMessage.VALIDATION_RULES = {
  caseId: joi
    .string()
    .uuid({
      version: ['uuidv4'],
    })
    .required()
    .description('ID of the case the message is attached to.'),
  caseStatus: joi
    .string()
    .optional()
    .description('The status of the associated case.'),
  createdAt: joiStrictTimestamp
    .required()
    .description('When the message was created.'),
  docketNumber: joi.string().regex(DOCKET_NUMBER_MATCHER).required(),
  docketNumberWithSuffix: joi
    .string()
    .allow(null)
    .optional()
    .description('The docket number and suffix for the associated case.'),
  entityName: joi.string().valid('CaseMessage').required(),
  from: joi
    .string()
    .max(100)
    .required()
    .description('The name of the user who sent the message.'),
  fromSection: joi
    .string()
    .valid(...SECTIONS, ...CHAMBERS_SECTIONS)
    .required()
    .description('The section of the user who sent the message.'),
  fromUserId: joi
    .string()
    .uuid({
      version: ['uuidv4'],
    })
    .required()
    .description('The ID of the user who sent the message.'),
  message: joi.string().max(500).required().description('The message text.'),
  messageId: joi
    .string()
    .uuid({
      version: ['uuidv4'],
    })
    .required()
    .description(
      'A unique ID generated by the system to represent the message.',
    ),
  subject: joi
    .string()
    .max(250)
    .required()
    .description('The subject line of the message.'),
  to: joi
    .string()
    .max(100)
    .required()
    .allow(null)
    .description('The name of the user who is the recipient of the message.'),
  toSection: joi
    .string()
    .valid(...SECTIONS, ...CHAMBERS_SECTIONS)
    .required()
    .description(
      'The section of the user who is the recipient of the message.',
    ),
  toUserId: joi
    .string()
    .uuid({
      version: ['uuidv4'],
    })
    .required()
    .allow(null)
    .description('The ID of the user who is the recipient of the message.'),
};

joiValidationDecorator(
  CaseMessage,
  joi.object().keys(CaseMessage.VALIDATION_RULES),
  CaseMessage.VALIDATION_ERROR_MESSAGES,
);

module.exports = { CaseMessage };
