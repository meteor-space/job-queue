
describe("Space.jobQueue", function () {

  MyApp = Space.Application.define('MyApp', {
    requiredModules: ['Space.jobQueue']
  });

  describe("Initialization", function () {

    beforeEach(function () {
      this.myApp = new MyApp()
    });

    afterEach(function () {
      this.myApp.reset();
    });

    it("makes injector mappings", function () {
      expect(this.myApp.injector.get('JobCollection')).to.exist
      expect(this.myApp.injector.get('Job')).to.exist
      expect(this.myApp.injector.get('Space.jobQueue.Jobs')).to.exist
    });

  });

  describe("Lifecycle", function (){

    beforeEach(function(){
      this.myApp = new MyApp()
    });

    afterEach(function(){
      this.myApp.reset();
    });

    it("Starts the jobServer when the module starts", function () {
      let jobServerStarted = sinon.spy();
      this.myApp.eventBus.subscribeTo('Space.jobQueue.JobServerStarted', jobServerStarted)
      console.log(this.myApp)
      this.myApp.start();
      expect(jobServerStarted).to.have.been.calledOnce
    });

    it("Stops the jobServer when the module stops", function () {
      let jobServerShutdown = sinon.spy();
      this.myApp.eventBus.subscribeTo('Space.jobQueue.JobServerShutdown', jobServerShutdown)
      this.myApp.start();
      this.myApp.stop();
      expect(jobServerShutdown).to.have.been.calledOnce
    });

  });

  describe("Job events", function (){

    beforeEach(function(){
      this.myApp = new MyApp()
      let injector = this.myApp.injector
      let job = injector.get('Job');
      let jobCollection = injector.get('Space.jobQueue.Jobs');
      this.myJob = new job(jobCollection, 'myJobType', {
        someProp: 'someValue'
      });
      this.eventBus = this.myApp.eventBus;
    });

    afterEach(function(){
      this.myApp.stop();
      this.myApp.reset();
    });

    it("reports when a job is added to the queue", function () {
      let jobAdded = sinon.spy();
      this.eventBus.subscribeTo('Space.jobQueue.JobAdded', jobAdded)
      this.myApp.start();
      this.myJob.save();
      expect(jobAdded).to.have.been.calledOnce
    });

  });

});