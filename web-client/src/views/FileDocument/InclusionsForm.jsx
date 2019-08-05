import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Text } from '../../ustc-ui/Text/Text';
import { connect } from '@cerebral/react';
import { props, sequences, state } from 'cerebral';
import React from 'react';

export const InclusionsForm = connect(
  {
    data: state[props.bind],
    fileDocumentHelper: state.fileDocumentHelper,
    openCleanModalSequence: sequences.openCleanModalSequence,
    type: props.type,
    updateFileDocumentWizardFormValueSequence:
      sequences.updateFileDocumentWizardFormValueSequence,
    validateExternalDocumentInformationSequence:
      sequences.validateExternalDocumentInformationSequence,
    validationBind: props.validationBind,
    validationData: state[props.validationBind],
  },
  ({
    data,
    fileDocumentHelper,
    openCleanModalSequence,
    type,
    updateFileDocumentWizardFormValueSequence,
    validateExternalDocumentInformationSequence,
    validationBind,
    validationData,
  }) => {
    return (
      <>
        <div
          className={`usa-form-group ${
            !fileDocumentHelper[type].showObjection &&
            !data.certificateOfService
              ? 'margin-bottom-0'
              : ''
          }`}
        >
          <fieldset className="usa-fieldset margin-bottom-0">
            <legend id={`${type}-extra-items-legend`}>
              Select Extra Items Included With Document
              <button
                className="usa-button usa-button--unstyled margin-top-2 margin-bottom-105 ustc-button--unstyled-with-left-icon"
                onClick={() =>
                  openCleanModalSequence({
                    value: 'WhatCanIIncludeModalOverlay',
                  })
                }
              >
                <div className="grid-row">
                  <div className="grid-col-1">
                    <FontAwesomeIcon
                      className="margin-right-05"
                      icon="question-circle"
                      size="1x"
                    />
                  </div>
                  <div className="grid-col-11">
                    What can I include with my document?
                  </div>
                </div>
              </button>
            </legend>
            <div className="usa-checkbox">
              <input
                checked={data.attachments || false}
                className="usa-checkbox__input"
                id={`${type}-attachments`}
                name={`${
                  type === 'primaryDocument'
                    ? 'attachments'
                    : `${type}.attachments`
                }`}
                type="checkbox"
                onChange={e => {
                  updateFileDocumentWizardFormValueSequence({
                    key: e.target.name,
                    value: e.target.checked,
                  });
                  validateExternalDocumentInformationSequence();
                }}
              />
              <label
                className="usa-checkbox__label"
                htmlFor={`${type}-attachments`}
              >
                Attachment(s)
              </label>
            </div>

            <div className="usa-checkbox">
              <input
                checked={data.certificateOfService || false}
                className="usa-checkbox__input"
                id={`${type}-certificateOfService`}
                name={`${
                  type === 'primaryDocument'
                    ? 'certificateOfService'
                    : `${type}.certificateOfService`
                }`}
                type="checkbox"
                onChange={e => {
                  updateFileDocumentWizardFormValueSequence({
                    key: e.target.name,
                    value: e.target.checked,
                  });
                  validateExternalDocumentInformationSequence();
                }}
              />
              <label
                className="usa-checkbox__label"
                htmlFor={`${type}-certificateOfService`}
                id={`${type}-certificateOfService-label`}
              >
                Certificate Of Service
              </label>
            </div>
          </fieldset>
        </div>
        {data.certificateOfService && (
          <div
            className={`usa-form-group ${
              validationData && validationData.certificateOfServiceDate
                ? 'usa-form-group--error'
                : ''
            } ${
              !fileDocumentHelper[type].showObjection ? 'margin-bottom-0' : ''
            }`}
          >
            <fieldset className="service-date usa-fieldset margin-bottom-0">
              <legend className="usa-legend" id={`${type}-service-date-legend`}>
                Service Date
              </legend>
              <div className="usa-memorable-date">
                <div className="usa-form-group usa-form-group--month">
                  <label
                    aria-hidden="true"
                    className="usa-label"
                    htmlFor={`${type}-service-date-month`}
                  >
                    MM
                  </label>
                  <input
                    aria-describedby={`${type}-service-date-legend`}
                    aria-label="month, two digits"
                    className="usa-input usa-input-inline"
                    id={`${type}-service-date-month`}
                    max="12"
                    min="1"
                    name={`${
                      type === 'primaryDocument'
                        ? 'certificateOfServiceMonth'
                        : `${type}.certificateOfServiceMonth`
                    }`}
                    type="number"
                    value={data.certificateOfServiceMonth || ''}
                    onBlur={() => {
                      validateExternalDocumentInformationSequence();
                    }}
                    onChange={e => {
                      updateFileDocumentWizardFormValueSequence({
                        key: e.target.name,
                        value: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className="usa-form-group usa-form-group--day">
                  <label
                    aria-hidden="true"
                    className="usa-label"
                    htmlFor={`${type}-service-date-day`}
                  >
                    DD
                  </label>
                  <input
                    aria-describedby={`${type}-service-date-legend`}
                    aria-label="day, two digits"
                    className="usa-input usa-input-inline"
                    id={`${type}-service-date-day`}
                    max="31"
                    min="1"
                    name={`${
                      type === 'primaryDocument'
                        ? 'certificateOfServiceDay'
                        : `${type}.certificateOfServiceDay`
                    }`}
                    type="number"
                    value={data.certificateOfServiceDay || ''}
                    onBlur={() => {
                      validateExternalDocumentInformationSequence();
                    }}
                    onChange={e => {
                      updateFileDocumentWizardFormValueSequence({
                        key: e.target.name,
                        value: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className="usa-form-group usa-form-group--year">
                  <label
                    aria-hidden="true"
                    className="usa-label"
                    htmlFor={`${type}-service-date-year`}
                  >
                    YYYY
                  </label>
                  <input
                    aria-describedby={`${type}-service-date-legend`}
                    aria-label="year, four digits"
                    className="usa-input usa-input-inline"
                    id={`${type}-service-date-year`}
                    max="2100"
                    min="1900"
                    name={`${
                      type === 'primaryDocument'
                        ? 'certificateOfServiceYear'
                        : `${type}.certificateOfServiceYear`
                    }`}
                    type="number"
                    value={data.certificateOfServiceYear || ''}
                    onBlur={() => {
                      validateExternalDocumentInformationSequence();
                    }}
                    onChange={e => {
                      updateFileDocumentWizardFormValueSequence({
                        key: e.target.name,
                        value: e.target.value,
                      });
                    }}
                  />
                </div>
              </div>
            </fieldset>
            <Text
              bind={`${validationBind}.certificateOfServiceDate`}
              className="usa-error-message"
            />
          </div>
        )}
      </>
    );
  },
);