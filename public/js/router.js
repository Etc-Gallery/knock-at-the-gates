DAB.Router = function (options) {

  var routes = options.routes;

  var check = function () {
    var currentRoute = window.location.pathname;
    if (currentRoute) {
      console.log(window.location.pathname);
      console.log(routes);
      routes[currentRoute]();
    } else {
      throw new Error('No route with that name.');
    }
  };

  $(window).on('dab-navigate', check);

};

DAB.history = {
  trigger: function () {
    $(window).trigger('dab-navigate');
  },
  navigate: function (path) {
    window.history.pushState({path: true}, '', path);
    this.trigger();
  },
  start: function () {
    this.trigger();
    window.addEventListener('popstate', this.trigger, false);
  }
};