# Space Job Queue [![Circle CI](https://circleci.com/gh/meteor-space/job-queue.svg?style=svg)](https://circleci.com/gh/meteor-space/job-queue)

_A persistent Job Queue for your Space implementation. Uses the well maintained and tested [vsivsi:job-collection](https://github.com/vsivsi/meteor-job-collection) - A persistent and reactive job queue for Meteor, supporting distributed workers that can run anywhere._
___

Licensed under the MIT license | [Changelog](CHANGELOG.md) | [1.0 Milestone list](https://github.com/meteor-space/job-queue/milestones/1.0.0)

## Documentation
_Documentation in this package only relates to the Space implementation. See [job-collection documentation](https://github.com/vsivsi/meteor-job-collection/blob/master/README.md)
 for an overview of the underlying infrastructure._
 
 See [space:job-queue-ui](https://github.com/meteor-space/job-queue-ui) non-view UI elements.

### Queue
A single job-collection instance is configured and mapped to the injector
 as `'Space.jobQueue.Jobs'`
   
### Configuration and defaults
 ``` javascript
configuration: Space.getenv.multi({
 jobQueue: {
   log: {
     enabled: ['SPACE_JQ_LOG_ENABLED', false, 'bool'],
     mode: ['SPACE_JQ_LOG_MODE', 'normal', 'string']
    },
   promoteInterval: ['SPACE_JQ_PROMOTE_INTERVAL', 15000, 'int'],
   serverInstanceQty: ['SPACE_JQ_SERVER_INSTANCE_QTY', 1, 'int'],
   remoteAccess: {
     enabled: ['SPACE_JQ_REMOTE_ACCESS_ENABLED', true, 'bool'],
     publish: ['SPACE_JQ_REMOTE_ACCESS_PUBLISH', true, 'bool']
   },
   stats: {
     jobServer: {
       publish: ['SPACE_JQ_STATS_JOB_SERVER_PUBLISH', false, 'bool']
     },
     connectedWorkers: {
       publish: ['SPACE_JQ_STATS_CONNECTED_WORKERS_PUBLISH', false, 'bool']
     }
   }
 }
})

### Remote Worker Access
Documentation coming soon, but there is full support now and enabled by default

 ```
### Events
Job server events are [translated and published](source/server/event-publisher.js)
 on the server-side Space.messaging.EventBus module instance ready for
  deep integration with your Space implementation.
  
[Event Reference](source/server/events.js)
 
### Publications
 - `space-jobQueue-ready-jobs` - Use for observer-based remote workers
   - enabled using `remoteAccess.publish` configuration.
   - Optionally pass a `lastSessionId` property to reliably track connected workers.
   - In your remote worker the subscription's connectionId can be saved to disk 
   and passed back on reconnection to handle a few different disconnection/exit
    scenarios. This will be better documented when there's an example to reference.
 - `space-jobQueue-job-server-stats` - Exposes the jobServer running state and promoteInterval.
   - Useful for visualising the state in your UI, such as a green or red solid circle.
 - `space-jobQueue-connected-workers` - Exposes a collection of connected worker 
   connections across all instances.
   - Useful for showing a count in your UI 
 
### Logging
  - `normal` default, simple message
  - `full` contains the message and full event payload

## Installation
```
meteor add space:job-queue
```
Add `'Space.jobQueue'` to the `requiredModules` array on a server module or application.

## Tests
```
meteor test-packages ./
```