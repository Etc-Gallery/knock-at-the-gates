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

  var gateLetterScale = d3.scale.linear().domain([0, $('#main-content h1.project-title').height()]).range([0, 100]);
  var opacityScale = d3.scale.linear().domain([0, $(window).height() * 2]).range([1, 0]);
  var mainContent = $('#main-content')[0];
  var projectTitle = $('#main-content').find('.project-title')[0];
  var st, amount, width;
  var makeGate = function () {
    st = mainContent.scrollTop;
    amount = gateLetterScale(st);
    opacity = opacityScale(st);
    projectTitle.style.letterSpacing = amount + 'px';
    projectTitle.style.textShadow = '0px 0px ' + amount + 'px #8c7c80';
    projectTitle.style.lineHeight = (100 + amount) + '%';
    projectTitle.style.opacity = opacity;
  };

  this.on = function () {
    $('.pane').height($(window).height() - 44);
    //$('header#primary-header button').on('click', overlayButtonClickHandler);
    $('#overlay .x').on('click', overlayXClickHandler);
    $('header#primary-header button').on('click', navButtonClickHandler);
    $('#main-content').on('scroll', _.throttle(makeGate, 50));
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
