const {
  CaseExternalIncomplete,
} = require('../entities/cases/CaseExternalIncomplete');
const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { Case } = require('../entities/cases/Case');
const { DocketRecord } = require('../entities/DocketRecord');
const { Document } = require('../entities/Document');
const { INITIAL_DOCUMENT_TYPES } = require('../entities/EntityConstants');
const { PETITIONS_SECTION } = require('../entities/EntityConstants');
const { ROLES } = require('../entities/EntityConstants');
const { UnauthorizedError } = require('../../errors/errors');
const { UserCase } = require('../entities/UserCase');
const { WorkItem } = require('../entities/WorkItem');

const addPetitionDocumentToCase = ({
  applicationContext,
  caseToAdd,
  documentEntity,
  user,
}) => {
  const workItemEntity = new WorkItem(
    {
      assigneeId: null,
      assigneeName: null,
      associatedJudge: caseToAdd.associatedJudge,
      caseIsInProgress: caseToAdd.inProgress,
      caseStatus: caseToAdd.status,
      caseTitle: Case.getCaseTitle(Case.getCaseCaption(caseToAdd)),
      docketNumber: caseToAdd.docketNumber,
      docketNumberWithSuffix: caseToAdd.docketNumberWithSuffix,
      document: {
        ...documentEntity.toRawObject(),
        createdAt: documentEntity.createdAt,
      },
      isInitializeCase: true,
      section: PETITIONS_SECTION,
      sentBy: user.name,
      sentByUserId: user.userId,
    },
    { applicationContext },
  );

  documentEntity.setWorkItem(workItemEntity);
  caseToAdd.addDocument(documentEntity, { applicationContext });

  return workItemEntity;
};

/**
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.ownershipDisclosureFileId the id of the ownership disclosure file
 * @param {string} providers.petitionFileId the id of the petition file
 * @param {object} providers.petitionMetadata the petition metadata
 * @param {string} providers.stinFileId the id of the stin file
 * @returns {object} the created case
 */
exports.createCaseInteractor = async ({
  applicationContext,
  ownershipDisclosureFileId,
  petitionFileId,
  petitionMetadata,
  stinFileId,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.PETITION)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: authorizedUser.userId });

  const petitionEntity = new CaseExternalIncomplete(petitionMetadata, {
    applicationContext,
  }).validate();

  const docketNumber = await applicationContext.docketNumberGenerator.createDocketNumber(
    {
      applicationContext,
    },
  );

  let privatePractitioners = [];
  if (user.role === ROLES.privatePractitioner) {
    const practitionerUser = await applicationContext
      .getPersistenceGateway()
      .getUserById({
        applicationContext,
        userId: user.userId,
      });

    practitionerUser.representingPrimary = true;
    if (
      petitionMetadata.contactSecondary &&
      petitionMetadata.contactSecondary.name
    ) {
      practitionerUser.representingSecondary = true;
    }

    privatePractitioners = [practitionerUser];
  }

  let partySecondary = false;
  if (
    petitionMetadata.contactSecondary &&
    petitionMetadata.contactSecondary.name
  ) {
    partySecondary = true;
  }

  const caseToAdd = new Case(
    {
      docketNumber,
      isPaper: false,
      orderForFilingFee: true,
      ...petitionEntity.toRawObject(),
      privatePractitioners,
      userId: user.userId,
    },
    {
      applicationContext,
    },
  );

  caseToAdd.caseCaption = Case.getCaseCaption(caseToAdd);
  caseToAdd.initialCaption = caseToAdd.caseCaption;

  const petitionDocumentEntity = new Document(
    {
      documentId: petitionFileId,
      documentType: INITIAL_DOCUMENT_TYPES.petition.documentType,
      eventCode: INITIAL_DOCUMENT_TYPES.petition.eventCode,
      filingDate: caseToAdd.createdAt,
      isFileAttached: true,
      partyPrimary: true,
      partySecondary,
      privatePractitioners,
      userId: user.userId,
      ...caseToAdd.getCaseContacts({
        contactPrimary: true,
        contactSecondary: true,
      }),
    },
    { applicationContext },
  );

  const newWorkItem = addPetitionDocumentToCase({
    applicationContext,
    caseToAdd,
    documentEntity: petitionDocumentEntity,
    user,
  });

  caseToAdd.addDocketRecord(
    new DocketRecord(
      {
        description: `Request for Place of Trial at ${caseToAdd.preferredTrialCity}`,
        eventCode: INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.eventCode,
        filingDate: caseToAdd.createdAt,
      },
      { applicationContext },
    ),
  );

  const stinDocumentEntity = new Document(
    {
      documentId: stinFileId,
      documentType: INITIAL_DOCUMENT_TYPES.stin.documentType,
      eventCode: INITIAL_DOCUMENT_TYPES.stin.eventCode,
      filingDate: caseToAdd.createdAt,
      isFileAttached: true,
      partyPrimary: true,
      partySecondary,
      privatePractitioners,
      userId: user.userId,
      ...caseToAdd.getCaseContacts({
        contactPrimary: true,
        contactSecondary: true,
      }),
    },
    { applicationContext },
  );

  caseToAdd.addDocumentWithoutDocketRecord(stinDocumentEntity);

  if (ownershipDisclosureFileId) {
    const odsDocumentEntity = new Document(
      {
        documentId: ownershipDisclosureFileId,
        documentType: INITIAL_DOCUMENT_TYPES.ownershipDisclosure.documentType,
        eventCode: INITIAL_DOCUMENT_TYPES.ownershipDisclosure.eventCode,
        filingDate: caseToAdd.createdAt,
        isFileAttached: true,
        partyPrimary: true,
        partySecondary,
        privatePractitioners,
        userId: user.userId,
        ...caseToAdd.getCaseContacts({
          contactPrimary: true,
          contactSecondary: true,
        }),
      },
      { applicationContext },
    );

    caseToAdd.addDocument(odsDocumentEntity, {
      applicationContext,
    });
  }

  await applicationContext.getPersistenceGateway().createCase({
    applicationContext,
    caseToCreate: caseToAdd.validate().toRawObject(),
  });

  const userCaseEntity = new UserCase(caseToAdd);

  await applicationContext.getPersistenceGateway().associateUserWithCase({
    applicationContext,
    docketNumber: caseToAdd.docketNumber,
    userCase: userCaseEntity.validate().toRawObject(),
    userId: user.userId,
  });

  await applicationContext.getPersistenceGateway().saveWorkItemForNonPaper({
    applicationContext,
    workItem: newWorkItem.validate().toRawObject(),
  });

  return new Case(caseToAdd, { applicationContext }).toRawObject();
};
