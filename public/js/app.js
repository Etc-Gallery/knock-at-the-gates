DAB = {
  interludes: [],
  essays: []
};


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
  ,   $primaryNav = $('#primary-nav')
  ,   $interludeLinks = $('#primary-nav li')
  ,   $namesWrapper = $('#names-wrapper');



  // In case we need it.
  var sizes = {
    height: $window.height(),
    width: $window.width()
  }


  // Store the currently active interlude.
  var activeInterlude, activeEssay;

  // Store the desire to prevent scroll events.
  var preventScrollEvents;


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
    if (sizes.width > 640) {
      $main.off('scroll').on('scroll', _.throttle(animateOpeningWords, 60));
    } else {
      $('#names-wrapper').css('opacity', 0);
    }
    if (preventScrollEvents) {
      $main.off('scroll');
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

  var openShareDialog = function (e) {
    FB.ui({
      method: 'share',
      href: window.location.href,
    }, function(response){
      // Maybe add some success/thank you?
    });
  };


  var activateInterlude = function (e) {
    activeInterlude.wrapper.addClass('active');
    activeInterlude.activate();
  };

  var deactivateInterlude = function (e) {
    activeInterlude.wrapper.removeClass('active');
    activeInterlude.deactivate();
  };


  var createRoutes = function () {

    var routes = {};

    // The home route.
    routes['/'] = function () {
      _.each(DAB.interludes, function (interlude) { interlude.off(); });
      $welcome.removeClass('inactive');
      $namesWrapper.removeClass('inactive');
      preventScrollEvents = false;
      $window.trigger('resize');
      $main.css('opacity', 1);
      activeInterlude = undefined;
      $primaryNav.find('li').removeClass('inactive');
    };

    // The interludes routes.
    _.each(DAB.interludes, function (interlude) {
      routes[interlude.path] = function () {
        $main.css('opacity', 0);
        $main.scrollTop(0);
        $welcome.addClass('inactive');
        $namesWrapper.addClass('inactive');

        // Deactivate the active interlude, if it exists.
        if (activeInterlude) {
          deactivateInterlude();
          activeInterlude.off();
        }

        if (activeEssay) {
          activeEssay.off();
        }
        
        // Turn the interlude on and set it as active.
        interlude.on();
        activeInterlude = interlude;

        preventScrollEvents = true;
        $window.trigger('resize');
        $main.css('opacity', 1);
        $primaryNav.find('li').removeClass('inactive');
        $primaryNav.find('.' + interlude.title.toLowerCase().split(' ').join('-')).addClass('inactive');
      };
    });

    // The essay routes.
    _.each(DAB.essays, function (essay) {
      routes[essay.path] = function () {
        $main.css('opacity', 0);
        $main.scrollTop(0);
        $welcome.addClass('inactive');
        $namesWrapper.addClass('inactive');

        // Deactivate the active interlude, if it exists.
        if (activeInterlude) {
          deactivateInterlude();
          activeInterlude.off();
        }

        if (activeEssay) {
          activeEssay.off();
        }

        essay.on();
        activeEssay = essay;

        // Turn the essay on.
        preventScrollEvents = true;
        $window.trigger('resize');
        $main.css('opacity', 1);
        $primaryNav.find('li').removeClass('inactive');
        $primaryNav.find('.' + essay.title.toLowerCase().split(' ').join('-')).addClass('inactive');
      }
    });

    return routes;
  };
  


  this.on = function () {

    // Create the names.
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
    $interludeLinks.on('click', function (e) {
      DAB.history.navigate($(this).data('href'));
    });

    DAB.router = new DAB.Router({ routes: createRoutes() });
    DAB.history.start();

  };
};

$(document).ready(function () {
  DAB.app = new DAB.App();
  DAB.app.on();

  // TODO: handle navigation to initial app.
});
