DAB = {};
DAB.interludes = [];


DAB.App = function () {


  // Only look through the DOM once.
  var $window = $(window)
  ,   $body = $('body')
  ,   $welcome = $('#welcome-panes')
  ,   $panes = $('.pane')
  ,   $interludes = $('.interlude')
  ,   $interludeXs = $('.interlude .x')
  ,   $interactives = $('.interactive')
  ,   $overlaysWrapper = $('#overlays')
  ,   $overlays = $('.overlay')
  ,   $overlayOpeners = $('.overlay-opener')
  ,   $overlayX = $('#overlays .x')
  ,   $main = $('#main-content')
  ,   $menus = $('.menu')
  ,   $dropdowns = $('.persist-dropdown')
  ,   $mainTitle = $('#main-content h1.project-title')
  ,   $header = $('#primary-header')
  ,   $fbButton = $('.facebook')
  ,   $primaryNav = $('#primary-nav');



  // In case we need it.
  var sizes = {
    height: $window.height(),
    width: $window.width()
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
    sizes.width = $(window).width();
    $panes.height(sizes.height);
    $interludes.height(sizes.height);
    $interactives.height(sizes.height);
    $welcome.height($welcome.find('.pane').length * sizes.height);
    $primaryNav.height(sizes.height);
    if (sizes.width > 640) {
      $main.off('scroll').on('scroll', _.throttle(animateOpeningWords, 60));
    } else {
      $('#names-wrapper').css('opacity', 0);
    }
  };


  var toggleMenu = function (e) {
    var $menu = $(this);
    $menu.toggleClass('active');
    var dropdownClass = $menu.data('persist-dropdown');
    var $dropdown = $('.' + dropdownClass);
    $dropdown.toggleClass('active');
    e.stopPropagation();
  };

  var closeMenus = function (e) {
    $menus.removeClass('active');
    $dropdowns.removeClass('active');
  };

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
    var id = $(this).attr('id');
    var el = $(this);
    el.toggleClass('active');
    el.off('click');
    _.each(DAB.interludes, function (interlude) {
      var slug = interlude.path.split('/')[1];
      if (slug !== id) {
        $('#' + slug).removeClass('active')
        $('#' + slug).off().on('click', activateInterlude);
        interlude.deactivate();
      } else {
        interlude.activate();
        navigate(interlude.path, interlude.title);
      }
    });
  };



  var deactivateInterlude = function (el) {
    el.toggleClass('active');
    el.on('click', activateInterlude);
    var interlude = _.findWhere(DAB.interludes, { path: '/' + el.attr('id') });
    interlude.deactivate();
    navigate('/', 'Knock at the Gates');
  };



  var openShareDialog = function (e) {
    FB.ui({
      method: 'share',
      href: window.location.href,
    }, function(response){
      // Maybe add some success/thank you?
    });
  };



  var navigate = function (path, title) {
    window.history.pushState({}, title, path);
  };



  this.on = function () {
    // Bind events.
    $menus.on('click', toggleMenu);
    $overlayOpeners.on('click', openOverlay);
    $overlayX.on('click', closeOverlay);
    $window.on('resize', sizeAndPositionElements);
    $interludes.on('click', activateInterlude);
    $interludeXs.on('click', function (e) {
      e.stopPropagation();
      deactivateInterlude($(this).parent());
    });
    $fbButton.on('click', openShareDialog)
    $body.on('click', closeMenus);

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
    var pathname = window.location.pathname;
    if (pathname.indexOf('/last-words') > -1 || pathname.indexOf('/a-narrow-practice') > -1 ) {
      $('#names-wrapper').css('opacity', 0);
    }

    $main.css('opacity', 1);
  };
};

$(document).ready(function () {
  DAB.app = new DAB.App();
  DAB.app.on();

  // TODO: make this happen on inview
  _.each(DAB.interludes, function (interlude) {
    interlude.on();
  });

  // Scroll to whatever interlude was requested.
  if (window.location.pathname != "/") {
    var interlude = _.findWhere(DAB.interludes, {
      path: window.location.pathname
    });

    if (interlude) {
      $('#main-content').scrollTop(interlude.el.offset().top);
    }
  }
});
