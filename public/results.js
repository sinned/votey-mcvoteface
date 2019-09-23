$(document).ready(function() {
  console.log("ready");
  $.ajax({
    url: "/api/getResults",
    type: "GET",
    dataType: "json",
    success: function(data, textStatus, jqXHR) {
      // since we are using jQuery, you don't need to parse response
      drawTable(data);
    }
  });

  function drawTable(data) {
    console.log("drawTable", data);
    for (var i = 0; i < data.voteImages.length; i++) {
      drawRow(data.voteImages[i], i);
    }
  }

  function drawRow(rowData, i) {
    var row = $("<tr />");
    $("#imagesDataTable").append(row); //this will append tr element to table... keep its reference for a while since we will add cels into it
    row.append($("<td>" + i + "</td>"));
    row.append($("<td>" + rowData.name + "</td>"));
    let votes = rowData.votes ? rowData.votes : 0;
    row.append(
      $(
        "<td><img class='img-thumbnail' src='" + rowData.image_url + "' /></td>"
      )
    );
    row.append($("<td>" + votes + "</td>"));
  }
});
