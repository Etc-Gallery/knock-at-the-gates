DAB.Essay = function (options) {



  var that = this;



  this.wrapper = options.el;
  this.path = options.path;
  this.title = options.title;



  this.on = function () {
    that.wrapper.show();
  };



  this.off = function () {
    that.wrapper.hide();
  };



};