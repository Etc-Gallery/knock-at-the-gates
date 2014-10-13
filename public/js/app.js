DAB = {};
DAB.interludes = [];


DAB.App = function () {


  // Only look through the DOM once.
  var $window = $(window)
  ,   $body = $('body')
  ,   $welcome = $('#welcome-panes')
  ,   $panes = $('.pane')
  ,   $interludes = $('.interlude')
  ,   $interactives = $('.interactive')
  ,   $overlaysWrapper = $('#overlays')
  ,   $overlays = $('.overlay')
  ,   $overlayOpeners = $('.overlay-opener')
  ,   $overlayX = $('#overlays .x')
  ,   $main = $('#main-content')
  ,   $gear = $('.gear')
  ,   $dropdown = $('.persist-dropdown')
  ,   $mainTitle = $('#main-content h1.project-title')
  ,   $header = $('#primary-header')
  ,   $fbButton = $('.facebook');



  // In case we need it.
  var sizes = {
    //width: $(window).width(),
    height: $window.height()
  }



  // The opening animation.
  // NB: Scroll events are a jQuery-free zone!
  // Scales for the opening animation.
  var gateLetterScale   = d3.scale.linear().domain([0, $mainTitle.height()]).range([0, 100])
  ,   opacityScale      = d3.scale.linear().domain([0, sizes.height * 2]).range([1, 0]);
  // Since the opening animation is a jQuery-free zone...
  var main = $main[0]
  ,   title = $mainTitle[0]
  ,   names = document.getElementById('names-wrapper');
  // Some variables to save.
  var st, amount, opacity;
  var animateOpeningWords = function (e) {
    st = main.scrollTop;
    if (st < sizes.height * 2) {
      amount = gateLetterScale(st);
      opacity = opacityScale(st);
      nameOpacity = Math.max(0, Math.min(2 * opacity, 1));
      names.style.opacity = nameOpacity;

      title.style.letterSpacing = amount + 'px';
      title.style.textShadow = '0px 0px ' + amount + 'px #8c7c80';
      title.style.lineHeight = (100 + amount) + '%';
      title.style.opacity = opacity;
    }
  };


  var sizeAndPositionElements = function (e) {
    sizes.height = $(window).height();
    $panes.height(sizes.height);
    $interludes.height(sizes.height);
    $interactives.height(sizes.height);
    $welcome.height($welcome.find('.pane').length * sizes.height);
  };



  var activateGearMenu = function (e) {
    $gear.addClass('active');
    $dropdown.addClass('active');
    e.stopPropagation();
    $body.on('click', deactivateGearMenu);
  };

  var deactivateGearMenu = function (e) {
    $gear.removeClass('active');
    $dropdown.removeClass('active');
    $body.off('click', deactivateGearMenu);
  }





  var openOverlay = function (e) {
    $('#' + $(this).data('overlay')).addClass('active');
    $overlaysWrapper.addClass('active');
    $main.addClass('blur');
    $header.addClass('blur');
  };



  var closeOverlay = function (e) {
    $overlaysWrapper.removeClass('active');
    $overlays.removeClass('active');
    $main.removeClass('blur');
    $header.removeClass('blur');
  };



  var activateInterlude = function (e) {
    $(this).toggleClass('active');
    $(this).off('click', activateInterlude);
    DAB.interludes[0].activate();
  };



  var deactivateInterlude = function (e) {
    e.stopPropagation();
    $(this).parent().toggleClass('active');
    $(this).parent().on('click', activateInterlude);
    DAB.interludes[0].deactivate();
  };



  var openShareDialog = function (e) {
    FB.ui({
      method: 'share',
      href: 'http://knock-at-the-gates.herokuapp.com',
    }, function(response){
      // Maybe add some success/thank you?
    });
  };



  this.on = function () {
    // Bind events.
    $gear.on('click', activateGearMenu);
    $overlayOpeners.on('click', openOverlay);
    $overlayX.on('click', closeOverlay);
    $main.on('scroll', _.throttle(animateOpeningWords, 60));
    $window.on('resize', sizeAndPositionElements);
    $interludes.on('click', activateInterlude);
    $interludes.children('.x').on('click', deactivateInterlude);
    $fbButton.on('click', openShareDialog)

    d3.json('/names.json', function (names) {
      var ul = d3.select('#names-wrapper')
      ul.selectAll('li.name')
        .data(names)
        .enter()
        .append('li').classed('name', true)
        .text(function (d) {
          return d.Name;
        });
    });

    // Position everything.
    $window.trigger('resize');


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
