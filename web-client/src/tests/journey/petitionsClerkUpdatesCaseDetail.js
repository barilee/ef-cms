import { runCompute } from 'cerebral/test';

import caseDetailHelper from '../../presenter/computeds/caseDetailHelper';

export default test => {
  return it('Petitions clerk updates case detail', async () => {
    await test.runSequence('updateCaseValueSequence', {
      key: 'caseType',
      value: '',
    });
    // caseType
    expect(test.getState('caseDetailErrors')).toEqual({
      caseType: 'Case Type is required.',
    });

    await test.runSequence('updateCaseValueSequence', {
      key: 'caseType',
      value: 'Other',
    });

    expect(test.getState('caseDetailErrors')).toEqual(null);

    //yearAmounts
    await test.runSequence('updateCaseValueSequence', {
      key: 'yearAmounts',
      value: [{ amount: '1,000', year: '1999' }],
    });

    expect(test.getState('caseDetailErrors')).toEqual(null);

    // // failure tests - TODO make work
    // await test.runSequence('updateCaseValueSequence', {
    //   key: 'yearAmounts',
    //   value: [{ amount: '000', year: '2100' }],
    // });
    // expect(test.getState('caseDetailErrors')).toEqual({
    //   yearAmounts: [
    //     {
    //       amount: 'Please enter a valid amount.',
    //       index: 0,
    //       year: 'That year is in the future. Please enter a valid year.',
    //     },
    //   ],
    // });

    // irsNoticeDate
    await test.runSequence('updateCaseValueSequence', {
      key: 'irsYear',
      value: '2018',
    });
    await test.runSequence('updateCaseValueSequence', {
      key: 'irsMonth',
      value: '12',
    });
    await test.runSequence('updateCaseValueSequence', {
      key: 'irsDay',
      value: '24',
    });

    expect(test.getState('caseDetailErrors')).toEqual(null);

    // payGovId and payGovDate
    await test.runSequence('updateCaseValueSequence', {
      key: 'payGovId',
      value: '123',
    });
    await test.runSequence('updateCaseValueSequence', {
      key: 'payGovYear',
      value: '2018',
    });
    await test.runSequence('updateCaseValueSequence', {
      key: 'payGovMonth',
      value: '12',
    });
    await test.runSequence('updateCaseValueSequence', {
      key: 'payGovDay',
      value: '24',
    });

    expect(test.getState('caseDetailErrors')).toEqual(null);

    //submit and route to case detail
    await test.runSequence('submitUpdateCaseSequence');
    test.setState('caseDetail', {});
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });
    expect(test.getState('caseDetail.payGovId')).toEqual('123');
    expect(test.getState('caseDetail.irsNoticeDate')).toEqual(
      '2018-12-24T00:00:00.000Z',
    );
    expect(test.getState('caseDetail.payGovDate')).toEqual(
      '2018-12-24T00:00:00.000Z',
    );
    expect(test.getState('caseDetail.caseType')).toEqual('Other');

    //
    const helper = runCompute(caseDetailHelper, {
      state: test.getState(),
    });
    expect(helper.showPaymentRecord).toEqual(true);

    //call updateCaseValueSequence

    //check for errors
    //check for success

    // test.setState('caseDetail', {});
    // await test.runSequence('gotoCaseDetailSequence', {
    //   docketNumber: test.docketNumber,
    // });
    // expect(test.getState('currentPage')).toEqual('CaseDetailInternal');
    // expect(test.getState('caseDetail.docketNumber')).toEqual(test.docketNumber);
    // expect(test.getState('caseDetail.status')).toEqual('new');
    // expect(test.getState('caseDetail.documents').length).toEqual(1);
    //
    // const helper = runCompute(caseDetailHelper, {
    //   state: test.getState(),
    // });
    // expect(helper.showDocumentStatus).toEqual(true);
    // expect(helper.showIrsServedDate).toEqual(false);
    // expect(helper.showPayGovIdInput).toEqual(false);
    // expect(helper.showPaymentOptions).toEqual(true);
    // expect(helper.showActionRequired).toEqual(true);
  });
};
