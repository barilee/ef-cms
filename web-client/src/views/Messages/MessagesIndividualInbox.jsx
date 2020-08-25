import { Button } from '../../ustc-ui/Button/Button';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const MessagesIndividualInbox = connect(
  { formattedMessages: state.formattedMessages.messages },
  function MessagesIndividualInbox({ formattedMessages }) {
    return (
      <>
        <table className="usa-table work-queue subsection">
          <thead>
            <tr>
              <th aria-label="Docket Number" className="small" colSpan="2">
                Docket No.
              </th>
              <th className="small">Received</th>
              <th>Message</th>
              <th>Case Title</th>
              <th>Case Status</th>
              <th>From</th>
              <th className="small">Section</th>
            </tr>
          </thead>
          {formattedMessages.map((message, idx) => {
            return (
              <tbody key={idx}>
                <tr key={idx}>
                  <td aria-hidden="true" className="focus-toggle" />
                  <td className="message-queue-row small">
                    {message.docketNumberWithSuffix}
                  </td>
                  <td className="message-queue-row small">
                    <span className="no-wrap">
                      {message.createdAtFormatted}
                    </span>
                  </td>
                  <td className="message-queue-row message-queue-document message-subject">
                    <div className="message-document-title">
                      <Button
                        link
                        className="padding-0"
                        href={`/messages/${message.docketNumber}/message-detail/${message.parentMessageId}`}
                      >
                        {message.subject}
                      </Button>
                    </div>

                    <div className="message-document-detail">
                      {message.message}
                    </div>
                  </td>
                  <td className="message-queue-row">{message.caseTitle}</td>
                  <td className="message-queue-row">{message.caseStatus}</td>
                  <td className="message-queue-row from">{message.from}</td>
                  <td className="message-queue-row small">
                    {message.fromSection}
                  </td>
                </tr>
              </tbody>
            );
          })}
        </table>
        {formattedMessages.length === 0 && <div>There are no messages.</div>}
      </>
    );
  },
);
