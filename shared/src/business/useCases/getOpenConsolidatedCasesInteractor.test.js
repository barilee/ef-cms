const {
  getOpenConsolidatedCasesInteractor,
} = require('./getOpenConsolidatedCasesInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');
const { CASE_STATUS_TYPES } = require('../entities/cases/CaseConstants');
const { MOCK_CASE } = require('../../test/mockCase');
const { MOCK_USERS } = require('../../test/mockUsers');
jest.mock('../entities/UserCase');
const { UserCase } = require('../entities/UserCase');

describe('getOpenConsolidatedCasesInteractor', () => {
  let mockFoundCasesList;

  beforeEach(() => {
    mockFoundCasesList = [MOCK_CASE];

    applicationContext
      .getPersistenceGateway()
      .getUserById.mockReturnValue(
        MOCK_USERS['d7d90c05-f6cd-442c-a168-202db587f16f'],
      );
    applicationContext.getCurrentUser.mockReturnValue(
      MOCK_USERS['d7d90c05-f6cd-442c-a168-202db587f16f'],
    );
    applicationContext
      .getPersistenceGateway()
      .getIndexedCasesForUser.mockImplementation(() => mockFoundCasesList);
    applicationContext
      .getUseCaseHelpers()
      .processUserAssociatedCases.mockReturnValue({
        casesAssociatedWithUserOrLeadCaseMap: {
          'c54ba5a9-b37b-479d-9201-067ec6e335bb': MOCK_CASE,
        },
        leadCaseIdsAssociatedWithUser: [MOCK_CASE.caseId],
        userAssociatedCaseIdsMap: {},
      });
    applicationContext
      .getUseCaseHelpers()
      .getConsolidatedCasesForLeadCase.mockReturnValue([]);
    UserCase.validateRawCollection.mockImplementation(foundCases => foundCases);
  });

  it('should retrieve the current user information', async () => {
    await getOpenConsolidatedCasesInteractor({
      applicationContext,
    });

    expect(applicationContext.getCurrentUser).toBeCalled();
  });

  it('should make a call to retrieve open cases by user', async () => {
    const openCaseStatuses = Object.values(CASE_STATUS_TYPES).filter(
      status => status !== CASE_STATUS_TYPES.closed,
    );

    await getOpenConsolidatedCasesInteractor({
      applicationContext,
    });

    expect(
      applicationContext.getPersistenceGateway().getIndexedCasesForUser,
    ).toHaveBeenCalledWith({
      applicationContext,
      statuses: openCaseStatuses,
      userId: 'd7d90c05-f6cd-442c-a168-202db587f16f',
    });
  });

  it('should validate the list of found open cases', async () => {
    await getOpenConsolidatedCasesInteractor({
      applicationContext,
    });

    expect(UserCase.validateRawCollection).toBeCalled();
  });

  it('should return an empty list when no open cases are found', async () => {
    mockFoundCasesList = [];

    const result = await getOpenConsolidatedCasesInteractor({
      applicationContext,
    });

    expect(result).toEqual([]);
  });

  it('should return a list of open cases', async () => {
    const result = await getOpenConsolidatedCasesInteractor({
      applicationContext,
    });

    expect(result).toMatchObject([
      {
        caseCaption: MOCK_CASE.caseCaption,
        caseId: MOCK_CASE.caseId,
        docketNumber: MOCK_CASE.docketNumber,
        docketNumberWithSuffix: MOCK_CASE.docketNumberWithSuffix,
      },
    ]);
  });
});
