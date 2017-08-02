$(function () {
     getLists([
         {
            "endPoint": "categories",
            "key":"category",
            "keyUpperCase":"Category"
         },
         {
             "endPoint": "actors",
             "key":"actor",
             "keyUpperCase":"Actor"
         },
         {
             "endPoint": "languages",
             "key":"language",
             "keyUpperCase":"Language"
         }
     ]);

    var serializedData;
    var currPage = $('#currPage');
    var pages = $('.pages');
    var totalPages;

    $("#searchtForm").submit(function (e) {
        var form = this;
        var selectedActor = $('.selectActor option:selected').text();
        var selectCategory = $('.selectCategory option:selected').text();
        var selectLanguage = $('.selectLanguage option:selected').text();

        serializedData = $("#searchtForm").serialize();

        serializedData += selectedActor ?  '&actorName=' + selectedActor : "";
        serializedData += selectCategory ? '&categoryName=' +  selectCategory : "";
        serializedData += selectLanguage ? '&languageName=' + selectLanguage : "";

        $.ajax({
            type: "GET",
            url: "films/search",
            data: serializedData, // serializes the form's elements.
            success: function (data) {
                var maxRows = data.maxRowsInPage;
                data.totalCount = data.allRows[0]['FOUND_ROWS()'];
                totalPages = parseInt(data.totalCount / maxRows);

                initResultsBlock(totalPages);
                buildTable(data.rows);
                buildLog(data.log[0]);

                pages.each(function () {
                    $(this).text('1');
                });

                if (data.totalCount === 0) {
                    $('.noResaulContainer').removeClass('hidden');
                } else {
                    $('.resaulContainer').removeClass('hidden');
                }
            }
        });
        e.preventDefault();
    });

    $('.btn_prev').on('click', function (e) {
        var newPageNum = parseInt(currPage.text()) - 1;
        getRowsByPage(newPageNum, function (data) {
            $(".resultTable").empty();
            buildTable(data.rows);
            pages.each(function () {
                $(this).text(newPageNum);
            });
        });

        if (newPageNum === 1) {
            $(".btn_prev").addClass("inactiveLink");
        }

        $(".btn_next").removeClass("inactiveLink");

    });

    $('.btn_next').on('click', function (e) {
        var newPageNum = parseInt(currPage.text()) + 1;
        getRowsByPage(newPageNum, function (data) {
            $(".resultTable").empty();
            buildTable(data.rows);
            pages.each(function () {
                $(this).text(newPageNum);
            });
        });

        if (newPageNum === totalPages) {
            $(".btn_next").addClass("inactiveLink");
        }

        $(".btn_prev").removeClass("inactiveLink");
    });

    function getLists(optionList){
        optionList.forEach(function(option){
            $.ajax({
                type: "GET",
                url: "/" + option.endPoint,
                data: "",
                success: function (data) {
                    var selectCategory = $('.select' + option.keyUpperCase);
                    $.each(data, function (key, value) {
                        selectCategory.append($("<option></option>")
                            .attr("value", value[option.key + "_id"])
                            .text(value.name));
                    });
                }
            });
        })
    }

    function getRowsByPage(pageNum, callback) {
        $.ajax({
            type: "GET",
            url: "films/search",
            data: serializedData + "&page=" + pageNum, // serializes the form's elements.
            success: function (data) {
                callback(data)
            }
        });
    }

    function buildTable(rows) {
        rows.forEach(function (movie) {
            $(".resultTable").append(
                '<tr class="movie">' +
                "<td>" + movie.title + "</td>" +
                "<td>" + movie.description + "</td>" +
                "<td>" + movie.category + "</td>" +
                "<td>" + movie.release_year + "</td>" +
                "<td>" + movie.language + "</td>" +
                "<td>" + movie.length + "</td>" +
                "<td>" + movie.rating + "</td>" +
                "<td>" + movie.actors + "</td>" +
                "</tr>"
            );
        });
    }

    function initResultsBlock(numOfPages) {
        $(".resultTable").empty();
        $(".btn_next").removeClass("inactiveLink");
        $('.resaulContainer').addClass('hidden');
        $('.noResaulContainer').addClass('hidden');
        $(".btn_prev").addClass("inactiveLink");

        if (numOfPages < 2) {
            $(".btn_next").addClass("inactiveLink");
        }
    }

    function buildLog(log) {
        $(".logTable").append(
            '<tr class="movie">' +
            "<td>" + log.timestamp + "</td>" +
            "<td>" + log.search_types + "</td>" +
            "<td>" + log.search_values + "</td>" +
            "<td>" + log.result_count + "</td>"
        );
    }
});

