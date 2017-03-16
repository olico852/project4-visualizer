jQuery(document).ready(function ($) {
var socket = io() // socket between front and back end of dashboard

var userInteractionData

socket.on('connect', function () {
  console.log('Connected!')
})

socket.on('userInteractionUpdate', function (userInteractionDataSocket) {
  userInteractionData = userInteractionDataSocket
  console.log('userinteraction data contains ', userInteractionData)
  var timestamp = new Date()
  $('.time').hide().text('Last updated: ' + timestamp).fadeIn('slow')
  if ($('table')) {
      d3.select('table').remove()
      userSearchTermsGenerate()
    } else {
      userSearchTermsGenerate()
    }
})

function userSearchTermsGenerate () {
  // process guest search terms
  var temp = ''

  userInteractionData.forEach(function (value, index) {
    if (value.userSearchterm === '') {
    } else {
      temp += value.userSearchterm
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
    var table = d3.select('#userSearchTerms').append('table')
            .attr('style', 'margin-left: 20px')
            .attr('style', 'margin-top: 50px')
    var thead = table.append('thead')
    var tbody = table.append('tbody')

    // append the header row
    thead.append('tr')
          .selectAll('th')
          .data(columns)
          .enter()
          .append('th')
              .text(function(column) { return column })

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



// function usersPostsGraphGenerate () {
//   // setting dimensions of canvas
//   var margin = { top: 20, right: 20, bottom: 70, left: 40 }
//   var width = (600 - margin.left - margin.right)
//   var height = (350 - margin.top - margin.bottom)
//
//   // setting the ranges
//   var x = d3.scale.ordinal().rangeRoundBands([0, width], 0.5)
//
//   var y = d3.scale.linear().range([height, 0])
//
//   // define the axis
//   var xAxis = d3.svg.axis()
//       .scale(x)
//       .orient('bottom')
//
//   var yAxis = d3.svg.axis()
//       .scale(y)
//       .orient('left')
//       .ticks(10)
//
//   var usersdatasvg = d3.select('#userPostsGraph').append('svg')
//           .attr('id', 'userposts')
//           .attr('height', height + margin.top + margin.bottom)
//           .attr('width', width + margin.left + margin.right)
//       .append('g')
//           .attr('transform',
//           'translate(' + margin.left + ',' + margin.top + ')')
//
//   usersData.forEach(function (d) {
//     d.name.firstname = d.name.firstname
//     d.posts.length = d.posts.length
//   })
//
//   // scaling range of data
//   x.domain(usersData.map(function (d) { return d.name.firstname }))
//   y.domain([0, d3.max(usersData, function (d) { return d.posts.length })])
//
//   // add axis
//   usersdatasvg.append('g')
//           .attr('class', 'x axis')
//           .attr('transform', 'translate(0,' + height + ')')
//           .call(xAxis)
//       .selectAll('text')
//           .style('text-anchor', 'end')
//           .attr('dx', '-.8em')
//           .attr('dy', '-.55em')
//           .attr('transform', 'rotate(-90)')
//
//   usersdatasvg.append('g')
//           .attr('class', 'y axis')
//           .call(yAxis)
//       .append('text')
//           .attr('transform', 'rotate(-90)')
//           .attr('y', 5)
//           .attr('dy', '.71em')
//           .style('text-anchor', 'end')
//           .text('Article Posting Frequency')
//
//   // add bars
//   usersdatasvg.selectAll('bar')
//       .data(usersData)
//     .enter().append('rect')
//       .attr('class', 'bar')
//       .attr('x', function (d) { return x(d.name.firstname) })
//       .attr('width', x.rangeBand())
//       .attr('y', function (d) { return y(d.posts.length) })
//       .attr('height', function (d) { return height - y(d.posts.length) })
//
//   // calc avg article posts/user
//   var count = 0
//   usersData.forEach(function (val) {
//     count += val.posts.length
//     return count
//   })
//
//   $('#userPostsGraph').prepend('<h3 id="usersPostsGraphTitle" class="title"> Posts/User: ' + count / usersData.length + '</h3>')
// }
//
// function commentGraphGenerate () {
//   // setting dimensions of canvas
//   var margin = { top: 20, right: 20, bottom: 70, left: 40 }
//   var width = (600 - margin.left - margin.right)
//   var height = (350 - margin.top - margin.bottom)
//
//   // setting the ranges
//   var x = d3.scale.ordinal().rangeRoundBands([0, width], 0.05)
//
//   var y = d3.scale.linear().range([height, 0])
//
//   // define the axis
//   var xAxis = d3.svg.axis()
//       .scale(x)
//       .orient('bottom')
//
//   var yAxis = d3.svg.axis()
//       .scale(y)
//       .orient('left')
//       .ticks(10)
//
//   var usersdatasvg = d3.select('#userCommentsGraph').append('svg')
//           .attr('id', 'usercomments')
//           .attr('height', height + margin.top + margin.bottom)
//           .attr('width', width + margin.left + margin.right)
//       .append('g')
//           .attr('transform',
//           'translate(' + margin.left + ',' + margin.top + ')')
//
//   usersData.forEach(function (d) {
//     d.name.firstname = d.name.firstname
//     d.comments.length = d.comments.length
//   })
//
//   // scaling range of data
//   x.domain(usersData.map(function (d) { return d.name.firstname }))
//   y.domain([0, d3.max(usersData, function (d) { return d.comments.length })])
//
//   // add axis
//   usersdatasvg.append('g')
//           .attr('class', 'x axis')
//           .attr('transform', 'translate(0,' + height + ')')
//           .call(xAxis)
//       .selectAll('text')
//           .style('text-anchor', 'end')
//           .attr('dx', '-.8em')
//           .attr('dy', '-.55em')
//           .attr('transform', 'rotate(-90)')
//
//   usersdatasvg.append('g')
//           .attr('class', 'y axis')
//           .call(yAxis)
//       .append('text')
//           .attr('transform', 'rotate(-90)')
//           .attr('y', 5)
//           .attr('dy', '.71em')
//           .style('text-anchor', 'end')
//           .text('Commenting Frequency')
//
//   // add bars
//   usersdatasvg.selectAll('bar')
//       .data(usersData)
//     .enter().append('rect')
//       .attr('class', 'bar')
//       .attr('x', function (d) { return x(d.name.firstname) })
//       .attr('width', x.rangeBand())
//       .attr('y', function (d) { return y(d.comments.length) })
//       .attr('height', function (d) { return height - y(d.comments.length) })
//
//   // calc rate of comment posts
//   var commentCount = 0
//
//   usersData.forEach(function (object) {
//     commentCount += object.comments.length
//     return commentCount
//   })
//
//   $('#userCommentsGraph').prepend('<h3 id="userCommentsGraphTitle" class="title"> Comments/User: ' + commentCount / usersData.length + '</h3>')
// }
})
