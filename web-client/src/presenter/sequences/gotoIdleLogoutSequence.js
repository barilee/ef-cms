import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearUserAction } from '../actions/clearUserAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';

export const gotoIdleLogoutSequence = [
  clearAlertsAction,
  clearModalAction,
  clearUserAction,
  setCurrentPageAction('IdleLogout'),
];
