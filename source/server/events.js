Space.messaging.define(Space.messaging.Event, 'Space.jobQueue', {

  JobServerStarted: {
    collection: String
  },
  JobServerShutdown: {
    collection: String
  },
  JobServerPromoteIntervalSet: {
    collection: String,
    interval: Number
  },
  JobAdded: {
    collection: String,
    type: String
  },
  JobRequestedByWorker: {
    collection: String,
    jobTypesRequested: Array,
    connection: Match.OneOf(Object, undefined)
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