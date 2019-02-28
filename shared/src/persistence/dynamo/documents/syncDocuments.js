const {
  createMappingRecord,
} = require('../../dynamo/helpers/createMappingRecord');

exports.syncDocuments = async ({
  applicationContext,
  caseToSave,
  currentCaseState,
}) => {
  for (let document of caseToSave.documents || []) {
    const existing = ((currentCaseState || {}).documents || []).find(
      i => i.documentId === document.documentId,
    );
    if (!existing) {
      await createMappingRecord({
        applicationContext,
        pkId: document.documentId,
        skId: caseToSave.caseId,
        type: 'case',
      });
    }
  }
};