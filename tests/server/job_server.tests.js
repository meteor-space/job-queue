
describe("Space.jobQueue", function () {

  describe("Initialization", function () {

    beforeEach(function(){
      // Reset published space modules
      Space.Module.published = {};
      this.injector = new Space.Injector();
      this.jobQueue = new Space.jobQueue();
      this.jobQueue.mongoInternals = MongoInternals;
      this.jobQueue.initialize({}, this.injector);
    });

    it("makes injector mappings", function () {
      expect(this.injector.get('JobCollection')).to.exist
      expect(this.injector.get('Job')).to.exist
      expect(this.injector.get('Space.jobQueue.Jobs')).to.exist
    });

    describe("Lifecycle", function () {

      it("Starts the jobServer when the module starts", function () {
        jobServerStarted = sinon.spy();
        this.injector.get('Space.jobQueue.Jobs').events.on('startJobServer', jobServerStarted);
        this.jobQueue.start();
        expect(jobServerStarted).to.have.been.calledOnce
      });

      it("Stops the jobServer when the module stops", function () {
        jobServerShutdown = sinon.spy();
        this.injector.get('Space.jobQueue.Jobs').events.on('shutdownJobServer', jobServerShutdown);
        this.jobQueue.start();
        this.jobQueue.stop();
        expect(jobServerShutdown).to.have.been.calledOnce
      });

    });

  });

});