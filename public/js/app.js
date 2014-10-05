DAB = {};
DAB.interludes = [];


DAB.App = function () {
  var windowResizeHandler = function (e) {
    $('.pane').height($(window).height() - 44);
  };

  var overlayButtonClickHandler = function (e) {
    $('#' + $(this).data('overlay')).addClass('active');
    $('#overlay').addClass('active');
    $('svg').each(function (i) {
      var defs = $(this).append("defs");
      var filter = defs.append("filter")
        .attr("id", "blur-" + i);
      filter.append("feGaussianBlur")
        .attr("in", "SourceGraphic")
        .attr("stdDeviation", 10);
      $('svg').attr('filter', 'url(#blur-' + i + ')');
    });
    $('#stream').addClass('blur');
  };

  var overlayXClickHandler = function (e) {
    $('.overlay').removeClass('active');
    $('#overlay').removeClass('active');
    $('#stream').removeClass('blur');
    $('svg').each(function (i) {
      $('svg').attr('filter', '');
    });
  };

  this.on = function () {
    $('.pane').height($(window).height() - 44);
    $('header#primary-header button').on('click', overlayButtonClickHandler);
    $('#overlay .x').on('click', overlayXClickHandler);
  };
};

$(document).ready(function () {
  DAB.app = new DAB.App();
});
