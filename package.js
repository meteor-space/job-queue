Package.describe({
  summary: 'Space job queue w/optional logging, published stats, and remote access. Is a vsivsi:job-collection',
  name: 'space:job-queue',
  version: '0.1.0',
  git: 'https://github.com/meteor-space/job-queue',
  documentation: 'README.md'
});

Package.onUse(function(api) {

  api.versionsFrom("METEOR@1.0");

  api.use([
    'mongo',
    'ecmascript',
    'underscore',
    'check',
    'space:base@4.1.0',
    'space:messaging@3.0.1',
    'vsivsi:job-collection@1.2.3'
  ]);

  api.addFiles([
    'source/server/module.js',
    'source/server/events.js',
    'source/server/job-server-controller.js',
    'source/server/event-publisher.js',
    'source/server/publications.js',
    'source/server/job-server-stats-controller.js',
    'source/server/logger.js'
  ],'server');

});

Package.onTest(function(api) {

  api.use([
    'mongo',
    'ecmascript',
    'check',
    'practicalmeteor:mocha@2.1.0',
    'space:base@4.1.0',
    'space:messaging@3.0.1',
    'space:job-queue',
    'space:testing@3.0.1'
  ]);

  api.addFiles([
    'tests/server/test-app.js',
    'tests/server/module.tests.js',
    'tests/server/job-server.tests.js'
    ], 'server');

});
