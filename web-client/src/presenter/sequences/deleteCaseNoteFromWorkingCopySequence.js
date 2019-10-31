import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { deleteCaseNoteAction } from '../actions/TrialSession/deleteCaseNoteAction';
import { getTrialSessionWorkingCopyAction } from '../actions/TrialSession/getTrialSessionWorkingCopyAction';
import { setTrialSessionWorkingCopyAction } from '../actions/TrialSession/setTrialSessionWorkingCopyAction';
import { updateCalendaredCaseNoteAction } from '../actions/TrialSessionWorkingCopy/updateCalendaredCaseNoteAction';
import { updateDeleteCaseNotePropsFromModalStateAction } from '../actions/TrialSessionWorkingCopy/updateDeleteCaseNotePropsFromModalStateAction';

export const deleteCaseNoteFromWorkingCopySequence = [
  updateDeleteCaseNotePropsFromModalStateAction,
  deleteCaseNoteAction,
  getTrialSessionWorkingCopyAction,
  setTrialSessionWorkingCopyAction,
  updateCalendaredCaseNoteAction,
  clearModalAction,
  clearModalStateAction,
];