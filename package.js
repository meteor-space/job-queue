Package.describe({
  summary: 'Infrastructure for background, long running, or distributed work units',
  name: 'space:job-queue',
  version: '0.1.0',
  git: 'https://github.com/meteor-space/job-queue',
  documentation: 'README.md'
});

Package.onUse(function(api) {

  api.versionsFrom("METEOR@1.0");

  api.use([
    'mongo',
    'underscore',
    'space:base@3.2.1',
    'vsivsi:job-collection@1.2.3'
  ]);

  api.addFiles([
    'source/server/module.js',
    'source/server/job_server_logger.js',
  ],'server');

});

Package.onTest(function(api) {

  api.use([
    'mongo',
    'practicalmeteor:munit@2.1.5',
    'space:base@3.2.1',
    'space:job-queue'
  ]);

  api.addFiles('tests/server/job_server.tests.js', 'server');

});
