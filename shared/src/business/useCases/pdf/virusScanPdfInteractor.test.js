const fs = require('fs');
const path = require('path');
const sinon = require('sinon');
const { virusScanPdf } = require('./virusScanPdfInteractor');

const testAssetsPath = path.join(__dirname, '../../../../test-assets/');

function testAsset(name) {
  return fs.readFileSync(testAssetsPath + name);
}

describe('virusScanPdf', () => {
  it('detects a clean PDF', async () => {
    const cleanParams = {
      applicationContext: {
        environment: { documentsBucketName: 'documents' },
        getStorageClient: () => ({
          getObject: sinon.stub().returns({
            promise: async () => ({
              Body: testAsset('sample.pdf'),
            }),
          }),
          putObjectTagging: () => {},
        }),
        logger: {
          error: () => null,
          time: () => null,
          timeEnd: () => null,
        },
        runVirusScan: async () => true,
      },
      documentId: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
    };
    const result = await virusScanPdf(cleanParams);
    expect(result).toBe('clean');
  });

  it('detects an infected PDF', async () => {
    const infectedParams = {
      applicationContext: {
        environment: { documentsBucketName: 'documents' },
        getStorageClient: () => ({
          getObject: sinon.stub().returns({
            promise: async () => ({
              Body: testAsset('fake-virus.pdf'),
            }),
          }),
          putObjectTagging: () => {},
        }),
        logger: {
          error: () => null,
          time: () => null,
          timeEnd: () => null,
        },
        runVirusScan: async () => {
          throw new Error('');
        },
      },
      documentId: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
    };

    await expect(virusScanPdf(infectedParams)).rejects.toThrow();
  });
});