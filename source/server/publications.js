Space.messaging.Publication.extend(Space.jobQueue, 'Publications', {

  dependencies: {
    queue: 'Space.jobQueue.Jobs'
  },

  publications() {
    return [{
      'space-jobQueue-ready-jobs': (context, options = {}) => {
        check(options, Object);
        // Logged in users only -> later will be capability-based
        if(context.userId === undefined) {
          throw new Meteor.Error('Unauthorised Access');
        }
        let query = { status: 'ready' };
        if(options.type !== undefined) {
          query.type = options.type
        }
        return this.queue.find(query);
      }
    }];
  }

});
