import { Button } from '../../ustc-ui/Button/Button';
import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { Icon } from '../../ustc-ui/Icon/Icon';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const OpinionSearchResults = connect(
  {
    advancedOpinionSearchHelper: state.advancedOpinionSearchHelper,
    baseUrl: state.baseUrl,
    pageSize: state.constants.CASE_SEARCH_PAGE_SIZE,
    showMoreResultsSequence: sequences.showMoreResultsSequence,
    token: state.token,
  },
  function OpinionSearchResults({
    advancedOpinionSearchHelper,
    baseUrl,
    pageSize,
    showMoreResultsSequence,
    token,
  }) {
    return (
      <>
        {advancedOpinionSearchHelper.showSearchResults && (
          <>
            <h1 className="margin-top-4">
              ({advancedOpinionSearchHelper.searchResultsCount}) Results
            </h1>

            <table className="usa-table search-results responsive-table row-border-only">
              <thead>
                <tr>
                  <th aria-hidden="true" className="small-column"></th>
                  <th aria-hidden="true" className="small-column"></th>
                  <th>Docket number</th>
                  <th>Case title</th>
                  <th>Opinion type</th>
                  <th>Pages</th>
                  <th>Date</th>
                  <th>Judge</th>
                </tr>
              </thead>
              <tbody>
                {advancedOpinionSearchHelper.formattedSearchResults.map(
                  (result, idx) => (
                    <tr className="search-result" key={idx}>
                      <td aria-hidden="true" className="small-column">
                        {idx + 1}
                      </td>
                      <td aria-hidden="true" className="small-column">
                        {result.isSealed && (
                          <Icon
                            aria-label="sealed"
                            className="iconSealed"
                            icon={['fa', 'lock']}
                            size="1x"
                          />
                        )}
                      </td>
                      <td>
                        <CaseLink formattedCase={result} />
                      </td>
                      <td>{result.caseTitle}</td>
                      <td>
                        <a
                          href={
                            advancedOpinionSearchHelper.isPublic
                              ? `${baseUrl}/public-api/${result.caseId}/${result.documentId}/public-document-download-url`
                              : `${baseUrl}/case-documents/${result.caseId}/${result.documentId}/document-download-url?token=${token}`
                          }
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          {result.documentTitle}
                        </a>
                      </td>
                      <td>{result.numberOfPages}</td>
                      <td>{result.formattedFiledDate}</td>
                      <td>{result.formattedJudgeName}</td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </>
        )}
        {advancedOpinionSearchHelper.showLoadMore && (
          <Button
            secondary
            aria-label={`load ${pageSize} more results`}
            onClick={() => showMoreResultsSequence()}
          >
            Load {pageSize} More
          </Button>
        )}
        {advancedOpinionSearchHelper.showNoMatches && (
          <div id="no-search-results">
            <h1 className="margin-top-4">No Matches Found</h1>
            <p>Check your search terms and try again.</p>
          </div>
        )}
      </>
    );
  },
);
