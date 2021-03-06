import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { validatePetitionDetailsAction } from './validatePetitionDetailsAction';

describe('validatePetitionDetailsAction', () => {
  let successStub;
  let errorStub;
  let PAYMENT_STATUS;

  beforeAll(() => {
    successStub = jest.fn();
    errorStub = jest.fn();

    ({ PAYMENT_STATUS } = applicationContext.getConstants());

    presenter.providers.applicationContext = applicationContext;
    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };

    applicationContext
      .getUseCases()
      .validateCaseDetailInteractor.mockReturnValue(null);
  });

  it('should call the success path when no errors are found for a paid case', async () => {
    await runAction(validatePetitionDetailsAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: MOCK_CASE,
        form: {
          paymentDateDay: '01',
          paymentDateMonth: '01',
          paymentDateYear: '2001',
          petitionPaymentMethod: 'check',
          petitionPaymentStatus: PAYMENT_STATUS.PAID,
        },
      },
    });
    expect(
      applicationContext.getUseCases().validateCaseDetailInteractor.mock
        .calls[0][0].caseDetail,
    ).toMatchObject({
      petitionPaymentDate: '2001-01-01T05:00:00.000Z',
      petitionPaymentMethod: 'check',
      petitionPaymentStatus: PAYMENT_STATUS.PAID,
    });
    expect(successStub).toHaveBeenCalled();
  });

  it('should call the success path when no errors are found for an unpaid case', async () => {
    await runAction(validatePetitionDetailsAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: MOCK_CASE,
        form: {
          petitionPaymentStatus: PAYMENT_STATUS.UNPAID,
        },
      },
    });
    expect(
      applicationContext.getUseCases().validateCaseDetailInteractor.mock
        .calls[0][0].caseDetail,
    ).toMatchObject({
      petitionPaymentStatus: PAYMENT_STATUS.UNPAID,
    });
    expect(successStub).toHaveBeenCalled();
  });

  it('should call the success path when no errors are found for a waived case', async () => {
    await runAction(validatePetitionDetailsAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: MOCK_CASE,
        form: {
          paymentDateWaivedDay: '01',
          paymentDateWaivedMonth: '01',
          paymentDateWaivedYear: '2001',
          petitionPaymentStatus: PAYMENT_STATUS.WAIVED,
        },
      },
    });
    expect(
      applicationContext.getUseCases().validateCaseDetailInteractor.mock
        .calls[0][0].caseDetail,
    ).toMatchObject({
      petitionPaymentStatus: PAYMENT_STATUS.WAIVED,
      petitionPaymentWaivedDate: '2001-01-01T05:00:00.000Z',
    });
    expect(successStub).toHaveBeenCalled();
  });

  it('should call the success path when no errors are found for a case with an IRS notice date', async () => {
    await runAction(validatePetitionDetailsAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: MOCK_CASE,
        form: {
          irsDay: '01',
          irsMonth: '01',
          irsYear: '2001',
        },
      },
    });
    expect(
      applicationContext.getUseCases().validateCaseDetailInteractor.mock
        .calls[0][0].caseDetail,
    ).toMatchObject({
      irsNoticeDate: '2001-01-01T05:00:00.000Z',
    });
    expect(successStub).toHaveBeenCalled();
  });

  it('should send preferredTrialCity to the use case as null if it is not on the form', async () => {
    await runAction(validatePetitionDetailsAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: MOCK_CASE,
        form: {},
      },
    });
    expect(
      applicationContext.getUseCases().validateCaseDetailInteractor.mock
        .calls[0][0].caseDetail,
    ).toMatchObject({
      preferredTrialCity: null,
    });
    expect(successStub).toHaveBeenCalled();
  });

  it('should send preferredTrialCity to the use case if it is on the form', async () => {
    await runAction(validatePetitionDetailsAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: MOCK_CASE,
        form: { preferredTrialCity: 'Fresno, California' },
      },
    });
    expect(
      applicationContext.getUseCases().validateCaseDetailInteractor.mock
        .calls[0][0].caseDetail,
    ).toMatchObject({
      preferredTrialCity: 'Fresno, California',
    });
    expect(successStub).toHaveBeenCalled();
  });

  it('should call the error path when errors are found', async () => {
    applicationContext
      .getUseCases()
      .validateCaseDetailInteractor.mockReturnValue('error');

    await runAction(validatePetitionDetailsAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: MOCK_CASE,
        form: {
          petitionPaymentMethod: 'check',
          petitionPaymentStatus: PAYMENT_STATUS.PAID,
        },
      },
    });
    expect(errorStub).toHaveBeenCalled();
  });
});
