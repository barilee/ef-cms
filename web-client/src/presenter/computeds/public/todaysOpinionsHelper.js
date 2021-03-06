import { Document } from '../../../../../shared/src/business/entities/Document';
import { state } from 'cerebral';

export const todaysOpinionsHelper = (get, applicationContext) => {
  const todaysOpinions = get(state.todaysOpinions);

  const currentDate = applicationContext.getUtilities().createISODateString();
  const formattedCurrentDate = applicationContext
    .getUtilities()
    .formatDateString(currentDate, 'MMMM D, YYYY');

  const formattedOpinions = todaysOpinions.map(opinion => ({
    ...opinion,
    formattedDocumentType: Document.getFormattedType(opinion.documentType),
    formattedFilingDate: applicationContext
      .getUtilities()
      .formatDateString(opinion.filingDate, 'MMDDYY'),
    formattedJudgeName: applicationContext
      .getUtilities()
      .getJudgeLastName(opinion.judge),
  }));

  return { formattedCurrentDate, formattedOpinions };
};
