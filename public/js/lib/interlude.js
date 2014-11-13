DAB.Interlude = function (options) {

  var that = this;

  // get all the data out of the options object
  // and throw all necessary errors.
  if (_.isUndefined(options) || typeof options !== 'object') {
    throw new Error('You must pass in an options object to DAB.Interlude');
  }

  if (_.isUndefined(options.el)) {
    throw new Error('You must provide an el to latch on to.');
  }
  else {
    this.wrapper = options.el;
    this.wrapper.append('<div class="interactive"></div>');
    this.el = this.wrapper.find('.interactive');
  }

  if (_.isUndefined(options.url)) {
    throw new Error('You must provide a url');
  }
  else {
    this.url = options.url;
  }

  if (_.isUndefined(options.title)) {
    throw new Error('Interludes need titles.');
  }
  else {
    this.title = options.title;
  }

  this.path = options.path;
  if (_.isUndefined(this.path)) {
    throw new Error('Interludes need paths.');
  }

  this.subtitle = _.isUndefined(options.subtitle) ? "" : options.subtitle;

  if (_.isUndefined(options.build) || typeof options.build !== 'function') {
    this.build = function () {};
  }
  else {
    this.build = options.build;
  }

  if (_.isUndefined(options.activate) || _.isUndefined(options.deactivate)) {
    throw new Error('Interludes must be able to be activated and deactivated');
  }
  else {
    this.activate = options.activate;
    this.deactivate = options.deactivate;
  }




  this.createSharedElements = function () {
    that.svg = d3.select(that.el[0]).append('svg')
      .attr('width', that.el.width())
      .attr('height', that.el.height());
  };

  this.requestData = function () {
    d3.json(this.url, function (data) {
      that.build(data);
    });
  };

  this.on = function () {
    that.requestData();
    that.wrapper.show();
  };

  this.off = function () {
    that.wrapper.hide();
    that.wrapper.find('.interactive').empty();
  }
};
