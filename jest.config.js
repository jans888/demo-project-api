/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  reporters: [
    'default',
    ['jest-html-reporters',
      {
        pageTitle: 'API Tests',
        filename: 'report.html',
        publicPath: 'reports',
        inlineSource: true,
        darkTheme: true,
        enableMergeData: true,
        includeConsoleLog: true,
        dataMergeLevel: 2
      }]
  ]
};