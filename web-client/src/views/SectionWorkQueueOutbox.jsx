import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const SectionWorkQueueOutbox = connect(
  {
    documentHelper: state.documentHelper,
    sectionWorkQueue: state.formattedWorkQueue,
    workQueueHelper: state.workQueueHelper,
    workQueueSectionHelper: state.workQueueSectionHelper,
  },
  ({
    documentHelper,
    sectionWorkQueue,
    workQueueSectionHelper,
    workQueueHelper,
  }) => {
    return (
      <table
        className="usa-table work-queue subsection"
        id="section-work-queue"
        aria-describedby="tab-work-queue"
      >
        <thead>
          <tr>
            <th aria-label="Docket Number" colSpan="2">
              Docket
            </th>
            <th>Sent</th>
            <th>Document</th>
            {!workQueueHelper.hideFiledByColumn && <th>Filed By</th>}
            <th>Case Status</th>
            {workQueueHelper.showAssignedToColumn && (
              <th>{workQueueHelper.assigneeColumnTitle}</th>
            )}
            {workQueueHelper.showProcessedByColumn && <th>Processed By</th>}
            {!workQueueHelper.hideFromColumn && <th>From</th>}
            {!workQueueHelper.hideSectionColumn && <th>Section</th>}
          </tr>
        </thead>
        {sectionWorkQueue.map((item, idx) => (
          <tbody key={idx}>
            <tr>
              <td className="focus-toggle">
                <button
                  className="focus-button usa-button usa-button--unstyled"
                  aria-label="Expand message detail"
                  aria-expanded={item.isFocused}
                  aria-controls={`detail-${item.workItemId}`}
                />{' '}
              </td>
              <td className="message-queue-row">
                <span className="no-wrap">{item.docketNumberWithSuffix}</span>
              </td>
              <td className="message-queue-row">
                <span className="no-wrap">{item.sentDateFormatted}</span>
              </td>
              <td className="message-queue-row">
                <div className="message-document-title">
                  <a
                    onClick={e => {
                      e.stopPropagation();
                    }}
                    href={documentHelper({
                      docketNumber: item.docketNumber,
                      documentId: item.document.documentId,
                    })}
                    className="case-link"
                  >
                    {item.document.documentType}
                  </a>
                </div>
                {workQueueHelper.showMessageContent && (
                  <div
                    id={`detail-${item.workItemId}`}
                    className="message-document-detail"
                  >
                    {item.currentMessage.message}
                  </div>
                )}
              </td>
              {!workQueueHelper.hideFiledByColumn && (
                <td className="message-queue-row">{item.document.filedBy}</td>
              )}
              <td className="message-queue-row">{item.caseStatus}</td>
              {workQueueHelper.showAssignedToColumn && (
                <td className="message-queue-row">
                  {item.currentMessage.from}
                </td>
              )}
              {workQueueHelper.showProcessedByColumn && (
                <td className="message-queue-row">{item.completedBy}</td>
              )}
              {!workQueueHelper.hideFromColumn && (
                <td className="message-queue-row">{item.assigneeName}</td>
              )}
              {!workQueueHelper.hideSectionColumn && (
                <td className="message-queue-row">
                  {workQueueSectionHelper.sectionDisplay(item.section)}
                </td>
              )}
            </tr>
          </tbody>
        ))}
      </table>
    );
  },
);
