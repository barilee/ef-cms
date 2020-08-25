const { get } = require('../requests');

/**
 * getCompletedMessagesForUserInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.userId the user id
 * @returns {Promise<*>} the promise of the api call
 */
exports.getCompletedMessagesForUserInteractor = ({
  applicationContext,
  userId,
}) => {
  return get({
    applicationContext,
    endpoint: `/messages/completed/${userId}`,
  });
};
