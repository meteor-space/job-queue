
Space.Object.extend(Space.jobQueue, 'Logger', {

  dependencies: {
    log: 'log'
  },

  eventSubscriptions: function(){
    return [
      {
        'Space.jobQueue.JobServerStarted': function(){
          this.log.info("Job Server Started");
        }
      },
      {
        'Space.jobQueue.JobServerShutdown': function(){
          this.log.info("Job Server shutdown");
        }
      },
      {
        'Space.jobQueue.JobTakenByWorker': function(){
          this.log.info("Job taken by worker");
        }
      },
      {
        'Space.jobQueue.JobRemoved': function(){
          this.log.info("Job removed");
        }
      },
      {
        'Space.jobQueue.JobPaused': function(){
          this.log.info("Job paused");
        }
      },
      {
        'Space.jobQueue.JobResumed': function(){
          this.log.info("Job resumed");
        }
      },
      {
        'Space.jobQueue.JobReady': function(){
          this.log.info("Job ready");
        }
      },
      {
        'Space.jobQueue.JobCancelled': function(){
          this.log.warn("Job cancelled");
        }
      },
      {
        'Space.jobQueue.JobRestarted': function(){
          this.log.info("Job restarted");
        }
      },
      {
        'Space.jobQueue.JobAdded': function(event){
          this.log.info(event.type + " job added");
        }
      },
      {
        'Space.jobQueue.JobRerun': function(){
          this.log.info("Job rerun");
        }
      },
      {
        'Space.jobQueue.JobProgressed': function(){
          this.log.info("Job progressed");
        }
      },
      {
        'Space.jobQueue.JobLogAdded': function(){
          this.log.info("Job log added");
        }
      },
      {
        'Space.jobQueue.JobCompleted': function(){
          this.log.info("Job completed");
        }
      },
      {
        'Space.jobQueue.JobFailed': function(){
          this.log.warn("Job failed");
        }
      }
    ]
  }

});

Space.jobQueue.Logger.mixin(Space.messaging.EventSubscribing);
