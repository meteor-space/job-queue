Package.describe({
  summary: 'Infrastructure for background, long running, or distributed work units. Optional and configurable logging, stats, and remote access.',
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
    'space:base@3.2.1',
    'space:messaging@2.1.0',
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
    'practicalmeteor:munit@2.1.5',
    'space:base@3.2.1',
    'space:messaging@2.1.0',
    'space:job-queue',
    'space:testing@2.0.1'
  ]);

  api.addFiles('tests/server/job-server.tests.js', 'server');

});
