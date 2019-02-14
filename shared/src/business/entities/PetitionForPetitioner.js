const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const joi = require('joi-browser');

function PetitionForPetitioner(rawPetition) {
  Object.assign(this, rawPetition);
}

PetitionForPetitioner.errorToMessageMap = {
  name: 'Name is a required field',
};

joiValidationDecorator(
  PetitionForPetitioner,
  joi.object().keys({
    contactPrimary: joi
      .object()
      .keys({
        name: joi.string().required(),
        address1: joi.string().required(),
        city: joi.string().required(),
        state: joi.string().required(),
        zip: joi.string().required(),
        country: joi.string().required(),
        phone: joi.string().required(),
        email: joi.string().required(),
      })
      .required(),
  }),
  undefined,
  PetitionForPetitioner.errorToMessageMap,
);

module.exports = PetitionForPetitioner;
