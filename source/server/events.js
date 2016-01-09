Space.messaging.define(Space.messaging.Event, 'Space.jobQueue', {

  JobServerStarted: {
    collection: String
  },
  JobServerShutdown: {
    collection: String
  },
  JobAdded: {
    collection: String,
    type: String
  },
  JobRequestedByWorker: {
    collection: String,
    jobTypesRequested: Array,
    connection: Object
  },
  JobRemoved: {
    collection: String
  },
  JobPaused: {
    collection: String
  },
  JobResumed: {
    collection: String
  },
  JobReady: {
    collection: String
  },
  JobCancelled: {
    collection: String
  },
  JobRestarted: {
    collection: String
  },
  JobRerun: {
    collection: String
  },
  JobProgressed: {
    collection: String
  },
  JobLogAdded: {
    collection: String
  },
  JobCompleted: {
    collection: String
  },
  JobFailed: {
    collection: String
  }

});