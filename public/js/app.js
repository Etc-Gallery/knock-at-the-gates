DAB = {};
DAB.interludes = [];


DAB.App = function () {
  var windowResizeHandler = function (e) {
    $('.pane').height($(window).height() - 44);
  };

  var navButtonClickHandler = function (e) {
    $(this).toggleClass('active');
    $('ul.' + $(this).data('persist-dropdown')).toggleClass('active');
  }

  var overlayButtonClickHandler = function (e) {
    $('#' + $(this).data('overlay')).addClass('active');
    $('#overlay').addClass('active');
    //$('svg').each(function (i) {
    //  var defs = $(this).append("defs");
    //  var filter = defs.append("filter")
    //    .attr("id", "blur-" + i);
    //  filter.append("feGaussianBlur")
    //    .attr("in", "SourceGraphic")
    //    .attr("stdDeviation", 10);
    //  $('svg').attr('filter', 'url(#blur-' + i + ')');
    //});
    $('#main-content').addClass('blur');
  };

  var overlayXClickHandler = function (e) {
    $('.overlay').removeClass('active');
    $('#overlay').removeClass('active');
    $('#main-content').removeClass('blur');
    $('svg').each(function (i) {
      $('svg').attr('filter', '');
    });
  };

  this.on = function () {
    $('.pane').height($(window).height() - 44);
    //$('header#primary-header button').on('click', overlayButtonClickHandler);
    $('#overlay .x').on('click', overlayXClickHandler);
    $('header#primary-header button').on('click', navButtonClickHandler);
  };
};

$(document).ready(function () {
  DAB.app = new DAB.App();
  DAB.app.on();

  // TODO: make this happen on inview
  _.each(DAB.interludes, function (interlude) {
    interlude.on();
  });
});
