jQuery(document).ready(function ($) {
  var socket = io() // socket between front and back end of dashboard

  var guestInteractionData
  var timestamp

  socket.on('connect', function () {
    console.log('Connected!')
  })

  socket.on('guestInteractionUpdate', function (guestInteractionDataSocket) {
    guestInteractionData = guestInteractionDataSocket
    timestamp = new Date()
    $('.time').hide().text('Last updated: ' + timestamp).fadeIn('slow')
    if ($('#guestsconversions')) {
      d3.select('#guestsconversions').remove()
      d3.select('.tooltip').remove()
      d3.select('table').remove()
      guestInteractionGraphGenerate()
      guestSearchTermsGenerate ()
    } else {
      guestInteractionGraphGenerate()
      guestSearchTermsGenerate()
    }
  })

  function guestSearchTermsGenerate () {
    // process guest search terms
    var temp = ''

    guestInteractionData.forEach(function (value, index) {
      if (value.guestuserSearchterm === '') {
      } else {
        temp += value.guestuserSearchterm
      }
    })

    var allSearchTerms = temp.toLowerCase().replace(/[ ,]+/g, ',').split(',')
    var searchTermsCount = { }

    allSearchTerms.forEach(function (el) {
      searchTermsCount[el] = searchTermsCount[el] + 1 || 1
    })

    // console.log('counter contains ', searchTermsCount)

    var searchTermObj = []

    function Creator (search, count) {
      this.search = search
      this.count = count
    }

    for (var y in searchTermsCount) {
      var item = new Creator()
      item.search = y
      item.count = searchTermsCount[y]
      searchTermObj.push(item)
    }

    console.log('searchTermObj now contains ', searchTermObj)

    searchTermObj.forEach(function (d) {
      d.search = d.search
      d.count = d.count
    })

    // The table generation function
    function tabulate (searchTermObj, columns) {
    var table = d3.select('#guestSearchTerms').append('table')
            .attr('style', 'margin-left: 50px')
            .attr('style', 'margin-top: 50px')
    var thead = table.append('thead')
    var tbody = table.append('tbody')

    // append the header row
    thead.append('tr')
          .selectAll('th')
          .data(columns)
          .enter()
          .append('th')
              .text(function (column) { return column })

    // create a row for each object in the data
    var rows = tbody.selectAll('tr')
            .data(searchTermObj)
            .enter()
            .append('tr')

    // create a cell in each row for each column
    var cells = rows.selectAll('td')
            .data(function (row) {
              return columns.map(function (column) {
                return {column: column, value: row[column]}
              })
            })
            .enter()
            .append('td')
            .attr('style', 'font-family: Courier') // sets the font style
                .text(function (d) { return d.value })

      return table
    }

      // render the table
    var searchcount = tabulate(searchTermObj, ['search', 'count'])

    searchcount.selectAll('thead th')
            .text(function (column) {
              return column.charAt(0).toUpperCase() + column.substr(1)
            })

    searchcount.selectAll('tbody tr')
      .sort(function (a, b) {
        return d3.descending(a.count, b.count)
      })
  }

  function guestInteractionGraphGenerate () {

    var registrationStatus = []

    let resultTrue = {
      label: true,
      count: 0
    }
    let resultFalse = {
      label: false,
      count: 0
    }

    guestInteractionData.forEach(function (value, index) {
      if (value.guestuserRegistered) {
        resultTrue.count += 1
      } else {
        resultFalse.count += 1
      }
    })

    registrationStatus.push(resultTrue)
    registrationStatus.push(resultFalse)

    // console.log('processed registration status ', registrationStatus)

      // setting dimensions of pie chart & color scheme
    var margin = { top: 60, right: 20, bottom: 70, left: 40 }
    var width = (360 - margin.left - margin.right)
    var height = (360 - margin.top - margin.bottom)
    var radius = Math.min(width, height) / 2
    var color = d3.scale.category20b()
    var donutWidth = 40
    var legendRectSize = 18
    var legendSpacing = 4

    var guestssvg = d3.select('#conversionsGraph').append('svg')
            .attr('id', 'guestsconversions')
            .attr('height', (height + margin.top + margin.bottom) * 2)
            .attr('width', (width + margin.left + margin.right) * 2)
        .append('g')
            .attr('transform',
            'translate(' + margin.left * 3.5 + ',' + margin.top * 2.5 + ')')

    var arc = d3.svg.arc()
            .innerRadius(radius - donutWidth)
            .outerRadius(radius)

    var pie = d3.layout.pie()
            .value (function (d) { return d.count })
            .sort(null)

    var tooltip = d3.select('#conversionsGraph')
            .append('div')
            .attr('class', 'tooltip')

    tooltip.append('div')
            .attr('class', 'label')

    tooltip.append('div')
            .attr('class', 'count')

    tooltip.append('div')
            .attr('class', 'percent')

    var path = guestssvg.selectAll('path')
            .data(pie(registrationStatus))
            .enter()
            .append('path')
            .attr('d', arc)
            .attr('fill', function (d, i) {
              return color(d.data.label)
            })

    path.on('mouseover', function (d) {
      var total = d3.sum(registrationStatus.map(function (d) {
        return d.count
      }))
      var percent = Math.round(1000 * d.data.count / total) / 10

      tooltip.select('.label').html(d.data.label)
      tooltip.select('.count').html(d.data.count)
      tooltip.select('.percent').html(percent + '%')
      tooltip.style('display', 'block')
    })

      path.on('mouseout', function () {
        tooltip.style('display', 'none')
      })

      path.on('mousemove', function (d) {
        tooltip.style('top', (d3.event.layerY + 10) + 'px')
          .style('left', (d3.event.layerX + 10) + 'px')
      })

    var legend = guestssvg.selectAll('.legend')
            .data(color.domain())
            .enter()
            .append('g')
            .attr('class', 'legend')
            .attr('transform', function (d, i) {
              var height = legendRectSize + legendSpacing
              var offset = height * color.domain().length / 2
              var horz = -2 * legendRectSize
              var vert = i * height - offset
              return 'translate(' + horz + ',' + vert + ')'
            })

    legend.append('rect')
             .attr('width', legendRectSize)
             .attr('height', legendRectSize)
             .style('fill', color)
             .style('stroke', color)

    legend.append('text')
             .attr('x', legendRectSize + legendSpacing)
             .attr('y', legendRectSize - legendSpacing)
             .text(function (d) { return d })
  }
})

// socket.on('usersUpdate', function(usersDataSocket) {
//   usersData = usersDataSocket
//   if ($('#userposts')) {
//     d3.select('#userposts').remove()
//     d3.select('#usersPostsGraphTitle').remove()
//     usersPostsGraphGenerate()
//   } else {
//     usersPostsGraphGenerate()
//   }
//
//   if ($('#usercomments')) {
//     d3.select('#usercomments').remove()
//     d3.select('#userCommentsGraphTitle').remove()
//     commentGraphGenerate()
//   } else {
//     commentGraphGenerate()
//   }
// })

// socket.on('userInteractionUpdate', function(userInteractionDataSocket) {
//   userInteractionData = userInteractionDataSocket
//   // userInteractionDataReady()
// })
