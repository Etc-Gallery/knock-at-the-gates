DAB.interludes.push(new DAB.Interlude({

  el: $('#when-they-stopped'),
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

  build: function (data) {
    var topology = data.map;

    var that = this;

    that.createSharedElements();

    var defs = that.svg.append('defs');
    var filter = defs.append('filter').attr('id', 'when-they-stopped-blur');
    filter.append('feGaussianBlur').attr('in', 'SourceGraphic').attr('stdDeviation', 10);

    var c = d3.scale.ordinal()
      .domain([ 0,1,2,3,4 ])
      .range([ 'rgb(70,62,64)', 'rgb(68,70,79)', 'rgb(58,86,106)', 'rgb(37,117,159)', 'rgb(0,174,255)' ]);
    var cRed = d3.scale.ordinal()
      .domain([ 0,1,2,3,4 ])
      .range([ 'rgb(70,62,64)', 'rgb(79,70,68)', 'rgb(106,86,58)', 'rgb(159,117,37)', 'rgb(255,174,0)' ]);


    var createOverlay = function () {
      $('.when-they-stopped-overlay').remove();
      $('body').append(
        '<div class="when-they-stopped-overlay">' +
          '<h1>A few words about this map</h1>' +
        '</div>'
      );
      $('button.when-they-stopped-more-button').on('click', function (e) {

        $('#main-content, #primary-header').addClass('blur');
        $('.when-they-stopped-overlay').addClass('active');
        $('.when-they-stopped-overlay').on('click', function (e) {
          $(this).removeClass('active');
          $('#main-content, #primary-header').removeClass('blur');
        });
      })
    };
    createOverlay();

    var scale = d3.scale.ordinal()
      .domain([0, 10, 100, 1000])
      .range([ 'rgb(0,0,0)', 'rgb(50,50,50)', 'rgb(100,100,100)', 'rgb(255,255,255)' ]);
    var projection = d3.geo.albersUsa()
      .scale(that.el.width >= 768 ? that.el.width() + 300 : that.el.width() + 100)
      .translate([that.el.width() / 2, that.el.height() / 2]);
    var path = d3.geo.path()
      .projection(projection);

    that.svg.append('g').attr('class', 'states')
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
      .attr('stroke-width', 3)
      .attr('d', path)
      .classed('state', true);
    that.svg.select('g.states').attr('filter', 'url(#when-they-stopped-blur)');
  }

}));
