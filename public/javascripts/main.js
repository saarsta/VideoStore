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
        var params = ['title', 'description', 'category', 'actor', 'language'];
        var body = {};

        serializedData = $("#searchtForm").serialize();

        serializedData += $('.selectActor option:selected').text() ?  '&actorName=' + $('.selectActor option:selected').text() : "";
        serializedData += $('.selectCategory option:selected').text() ? '&categoryName=' +  $('.selectCategory option:selected').text() : "";
        serializedData += $('.selectLanguage option:selected').text() ? '&languageName=' + $('.selectLanguage option:selected').text() : "";

        params.forEach(function (param) {
            body[param] = $('[name="' + param + '"]', form).val();
        });

        $.ajax({
            type: "GET",
            url: "films/search",
            data: serializedData, // serializes the form's elements.
            success: function (data) {
                var maxRows = data.maxRowsInPage;
                body.totalCount = data.allRows[0]['FOUND_ROWS()'];
                totalPages = parseInt(body.totalCount / maxRows);

                initResultsBlock(totalPages);
                buildTable(data.rows);
                buildLog(data.log[0]);

                console.log(body.totalCount, "totalCount");

                pages.each(function () {
                    $(this).text('1');
                });

                if (body.totalCount === 0) {
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
                        console.log(value);
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
        $('.resaulContainer').addClass('hidden');
        $('.noResaulContainer').addClass('hidden');
        $(".btn_prev").addClass("inactiveLink");

        if (numOfPages < 2) {
            $(".btn_next").addClass("inactiveLink");
        }
    }

    function buildLog(log) {
        debugger
        $(".logTable").append(
            '<tr class="movie">' +
            "<td>" + log.timestamp + "</td>" +
            "<td>" + log.search_types + "</td>" +
            "<td>" + log.search_values + "</td>" +
            "<td>" + log.result_count + "</td>"
        );
    }
});

