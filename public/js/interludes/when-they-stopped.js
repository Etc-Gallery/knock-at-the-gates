DAB.Interlude.TimeMap = function(options) {
  this.base(this, 'constructor', options);
  this.currentYear = 1977;
  this.states = {};
}
util.inherits(DAB.Interlude.TimeMap, DAB.Interlude);


DAB.Interlude.TimeMap.prototype.render = function (data) {
  var topology = data.map;
  this.data = data.data;

  this.createSharedElements();

  var defs = this.svg.append('defs');
  var filter = defs.append('filter').attr('id', 'when-they-stopped-blur');
  filter.append('feGaussianBlur').attr('in', 'SourceGraphic').attr('stdDeviation', 10);

  var domain = [ 'death-sentence', 'execution', 'commutation', 'exoneration', 'last-exectuion' ];

  this.colorScale = d3.scale.ordinal()
    .domain(domain)
    .range([ 'rgb(70,62,64)', 'rgb(68,70,79)', 'rgb(58,86,106)', 'rgb(37,117,159)', 'rgb(0,174,255)' ]);
  this.durationScale = d3.scale.ordinal()
    .domain(domain)
    .range([ 500, 900, 1200, 1500, 2000 ]);
  var cRed = d3.scale.ordinal()
    .domain([ 0,1,2,3,4 ])
    .range([ 'rgb(70,62,64)', 'rgb(79,70,68)', 'rgb(106,86,58)', 'rgb(159,117,37)', 'rgb(255,174,0)' ]);

  this.createOverlay();

  var projection = d3.geo.albersUsa()
    .scale(this.el.width >= 768 ? this.el.width() + 300 : this.el.width() + 100)
    .translate([this.el.width() / 2, this.el.height() / 2]);
  var path = d3.geo.path()
    .projection(projection);

  this.svg.append('g').attr('class', 'states')
    .selectAll('path.state')
    .data(topojson.feature(topology, topology.objects.states).features)
    .enter()
    .append('path')
    .attr('id', function (d) {
      return 'state-code-' + d.properties.abbreviation;
    })
    .attr('stroke', function (d) {
      return 'rgb(100,100,100)';
    })
    .attr('stroke-width', 2)
    .attr('d', path)
    .classed('state', true)
    // Store the centroids.
    .each(_.bind(function(d) {
      this.states[d.properties.abbreviation] = {};
      this.states[d.properties.abbreviation].centroid = path.centroid(d);
      this.states[d.properties.abbreviation].bounds = path.bounds(d);
    }, this))
    ;
  this.svg.select('g.states').attr('filter', 'url(#when-they-stopped-blur)');
};


DAB.Interlude.TimeMap.prototype.createOverlay = function() {
  this.el.append(
    '<div class="when-they-stopped-buttons">' +
      '<button class="when-they-stopped-button when-they-stopped-play-button">Step through time</button>' +
      '<button class="when-they-stopped-button when-they-stopped-more-button">learn more about this map</button>' +
    '</div>');
  $('.when-they-stopped-overlay').remove();
  $('body').append(
    '<div class="when-they-stopped-overlay">' +
      '<h1>A few words about this map</h1>' +
    '</div>');
  $('button.when-they-stopped-more-button').on('click', function (e) {

    $('#main-content, #primary-header').addClass('blur');
    $('.when-they-stopped-overlay').addClass('active');
    $('.when-they-stopped-overlay').on('click', function (e) {
      $(this).removeClass('active');
      $('#main-content, #primary-header').removeClass('blur');
    });
  });
  $('button.when-they-stopped-play-button').on('click', _.bind(this.play, this));
};

// Milliseconds per year.
DAB.Interlude.TimeMap.SPEED = 3000;

DAB.Interlude.TimeMap.prototype.play = function() {
  console.log('play called');
  this.intervalId = setInterval(_.bind(this.animate, this), DAB.Interlude.TimeMap.SPEED);
};


DAB.Interlude.TimeMap.prototype.animate = function() {
  this.animateYear(this.currentYear);
  if (this.currentYear < 2014) {
    this.currentYear++;
    console.log(this.currentYear);
  } else {
    this.endAnimation();
  }

};


DAB.Interlude.TimeMap.prototype.animateYear = function(year) {
  var events = _.clone(this.data[year]);
  var millisecondsPerEvent = DAB.Interlude.TimeMap.SPEED / events.length;
  var startTime;
  var displayedIndex = 0;


  var animateFrame = _.bind(function(timestamp) {
    if (!startTime) {
      startTime = timestamp;
    }
    var timeSinceFirstFrame = timestamp - startTime;
    var numEventsToDisplay = timeSinceFirstFrame / millisecondsPerEvent;
    for (;displayedIndex < numEventsToDisplay && displayedIndex < events.length; displayedIndex++) {
      this.renderEvent(events[displayedIndex]);
    }
    if (displayedIndex < events.length) {
      this.currentAnimation = requestAnimationFrame(animateFrame);
    }
  }, this);
  this.currentAnimation = requestAnimationFrame(animateFrame);
};


DAB.Interlude.TimeMap.prototype.renderEvent = function(e) {
  if (!this.states[e.state.toUpperCase()]) {
    console.log("Can't place ", e);
    return;
  }

  var location = this.getLocationForState(e.state.toUpperCase());

  this.svg.append("circle")
      .attr('cx', function() {
        return location[0];
      })
      .attr('cy', function(d) {
        return location[1];
      })
      .attr('fill', this.colorScale(e.type))
      .attr('r', 0)
      .transition()
      .attr('r', 50)
      .style('opacity', 0)
      .duration(this.durationScale(e.type))
      .remove();
};


DAB.Interlude.TimeMap.prototype.getLocationForState = function(state) {
  var centroid = this.states[state].centroid;
  var boundingBox = this.states[state].bounds;
  pctFromCenter = 0.7;
  var xBounds = [
    boundingBox[0][0] - centroid[0],
    boundingBox[1][0] - centroid[0]
  ];
  var yBounds = [
    boundingBox[0][1] - centroid[1],
    boundingBox[1][1] - centroid[1]
  ];

  var perturbation = [
    (Math.random() * xBounds[1] + xBounds[0]) * pctFromCenter,
    (Math.random() * yBounds[1] + yBounds[0]) * pctFromCenter
  ];
  var location = [
    centroid[0] + perturbation[0],
    centroid[1] + perturbation[1]
  ];
  console.log(document.elementFromPoint(location[0], location[1]));

  return location;
};


DAB.Interlude.TimeMap.prototype.endAnimation = function() {
  if (this.intervalId) {
    clearInterval(this.intervalId);
    this.intervalId = null;
  }
  // Cancel animation frame?
};



DAB.interludes.push(new DAB.Interlude.TimeMap({
  wrapper: $('#when-they-stopped'),
  url: 'when-they-stopped.json',
  path: '/when-they-stopped',
  title: 'When They Stopped',
  subtitle: 'Charting death row populations since 1977',

  activate: function () {
    this.svg.selectAll('g').attr('filter', '');
  },

  deactivate: function () {
    this.svg.selectAll('g').attr('filter', '');
    this.svg.selectAll('g').attr('filter', 'url(#when-they-stopped-blur)');
  },

  build: DAB.Interlude.TimeMap.prototype.render
}));

