DAB.interludes.push(new DAB.Interlude({

  el: $('#a-narrow-practice'),
  url: 'a-narrow-practice.json',
  path: '/a-narrow-practice',
  title: 'A Narrow Practice',
  subtitle: 'Mapping executions since 1977',

  activate: function () {
    this.svg.selectAll('g').attr('filter', '');
  },

  deactivate: function () {
    this.svg.selectAll('g').attr('filter', '');
    this.svg.selectAll('g').attr('filter', 'url(#a-narrow-practice-blur)');
  },

  build: function (topology) {

    var that = this;

    var topTenActive;

    that.createSharedElements();

    var defs = that.svg.append('defs');
    var filter = defs.append('filter').attr('id', 'a-narrow-practice-blur');
    filter.append('feGaussianBlur').attr('in', 'SourceGraphic').attr('stdDeviation', 10);

    var c = d3.scale.ordinal()
      .domain([ 0,1,2,3,4 ])
      .range([ 'rgb(70,62,64)', 'rgb(68,70,79)', 'rgb(58,86,106)', 'rgb(37,117,159)', 'rgb(0,174,255)' ]);
    var cRed = d3.scale.ordinal()
      .domain([ 0,1,2,3,4 ])
      .range([ 'rgb(70,62,64)', 'rgb(79,70,68)', 'rgb(106,86,58)', 'rgb(159,117,37)', 'rgb(255,174,0)' ]);

    var range = function (input) {
      if (!input || input === "false" || input === 0) {
        return 0;
      } else if (input <= 1) {
        return 1;
      } else if (input <= 10) {
        return 2;
      } else if (input <= 50) {
        return 3;
      } else {
        return 4;
      }      
    };


    // the legend (the man, the myth...)
    var createLegend = function () {
      that.el.append(
        '<table class="legend">' +
          '<tr>' +
            '<td class="colorblock"></td>' +
            '<td>0 executions</td>' +
          '</tr>' +
          '<tr>' +
            '<td class="colorblock"></td>' +
            '<td>1 execution</td>' +
          '</tr>' +
          '<tr>' +
            '<td class="colorblock"></td>' +
            '<td>2 to 10 executions</td>' +
          '</tr>' +
          '<tr>' +
            '<td class="colorblock"></td>' +
            '<td>11 to 49 executions</td>' +
          '</tr>' +
          '<tr>' +
            '<td class="colorblock"></td>' +
            '<td>50 or more executions</td>' +
          '</tr>' +
        '</table>'
      );
      var table = that.el.find('table.legend');
      for (var i = 0; i < table.find('td.colorblock').length; i++) {
        table.find('td.colorblock').eq(i).css('background-color', c(i));
      }
    };
    createLegend();

    var createOverlayAndToggle = function () {
      that.el.append(
        '<div class="a-narrow-practice-buttons">' +
          '<button class="a-narrow-practice-button top-ten-button">toggle top ten counties</button>' +
          '<button class="a-narrow-practice-button a-narrow-practice-more-button">learn more about this map</button>' +
        '</div>'
      );
      $('button.top-ten-button').on('click', function (e) {
        topTenActive = topTenActive ? false : true;
        that.svg.selectAll('path.top-ten').style('fill', function (d) {
          return topTenActive ? cRed(range(d.properties.count)) : c(range(d.properties.count));        
        });
      });
      $('.a-narrow-practice-overlay').remove();
      $('body').append(
        '<div class="a-narrow-practice-overlay">' +
          '<h1>A few words about this map</h1>' +
          '<p>The top ten counties are in three states, with six of the ten in Texas. Though Texas has delivered more death sentences than any other state, Florida and California are not far behind. As of October 1, 2014, California has the largest death row population of any state; however, California has only executed 13 people since the ban was lifted.</p>' +
          '<p>The top 10 counties and their most populous city are Harris (Houston, TX), Dallas (Dallas, TX), Oklahoma (Oklahoma City, OK), Tarrant (Fort Worth, TX), Bexar (San Antonio, TX), Montgomery (Conroe, TX), Tulsa (Tulsa, OK), Jefferson (Beaumont, TX), Saint Louis (Florissant, MO), Saint Louis City (Saint Louis, MO).</p>' +
          '<p>This map does not include federal or military executions.</p>' +
        '</div>'
      );
      $('button.a-narrow-practice-more-button').on('click', function (e) {

        $('#main-content, #primary-header').addClass('blur');
        $('.a-narrow-practice-overlay').addClass('active');
        $('.a-narrow-practice-overlay').on('click', function (e) {
          $(this).removeClass('active');
          $('#main-content, #primary-header').removeClass('blur');
        });        
      })
    };
    createOverlayAndToggle();

    var scale = d3.scale.ordinal()
      .domain([0, 10, 100, 1000])
      .range([ 'rgb(0,0,0)', 'rgb(50,50,50)', 'rgb(100,100,100)', 'rgb(255,255,255)' ]);
    var projection = d3.geo.albersUsa()
      .scale(that.el.width >= 768 ? that.el.width() + 300 : that.el.width() + 100)
      .translate([that.el.width() / 2, that.el.height() / 2]);
    var path = d3.geo.path()
      .projection(projection);

    that.svg.append('g').attr('class', 'counties')
      .selectAll("path.county")
      .data(topojson.feature(topology, topology.objects.counties).features)
      .enter()
      .append("path")
      .attr('id', function (d) {
        return "fips-" + d.id;
      })
      .attr("d", path)
      .attr('class', function (d) {
        if (d.properties.count !== "false" && d.properties.count > 0) {
          var classString = 'executioner';
          if (d.properties.topTen === 'true') {
            classString += ' top-ten';
          }
          if (d.properties.topOnePercent === 'true') {
            classString += ' top-one-percent';
          }
          if (d.properties.topTenPercent === 'true') {
            classString += ' top-ten-percent';
          }
          return classString;
        }
      })
      .classed("county", true)
      .style('fill', function (d) {
        /*if (d.properties.topTen === 'true') {
          return cRed(range(d.properties.count));
        } else {*/
          return c(range(d.properties.count));      
        //}
      });
    that.svg.append('g').attr('class', 'states')
      .selectAll('path.state')
      .data(topojson.feature(topology, topology.objects.states).features)
      .enter()
      .append('path')
      .attr('d', path)
      .attr('id', function (d) {
        return 'fips-' + d.id;
      })
      .classed('state', true);
    that.svg.select('g.states').attr('filter', 'url(#a-narrow-practice-blur)');
    that.svg.select('g.counties').attr('filter', 'url(#a-narrow-practice-blur)');
    $('.executioner')
      .css('cursor', 'pointer')
      .on('mouseover', function (e) {
        var d = d3.select(this).datum();
        if (d.properties.count !== "false" && d.properties.count > 0) {
          var name  = d.properties.county
          ,   count = d.properties.count
          ,   state = d.properties.state;
          if (that.el.find('.inspector').length === 0) {
            that.el.append(
              '<ul class="inspector">' +
                  '<li>' + name + '</li>' +
                  '<li>' + count + ' executions</li>' +
              '</ul>'
            );
          } else {
            var inspector = that.el.find('.inspector');
          }
          var inspector = that.el.find('.inspector');
          inspector.css({
            'top': e.clientY - that.el.offset().top - 100,
            'left': e.clientX - that.el.offset().left - (inspector.width() / 2)
          })
        }
      })
      .on('mouseout', function (e) {
        that.el.find('.inspector').remove();
      })

  }

}))