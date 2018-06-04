function fillSelectOptions(select, cache) {
    var __MAX_LEN__ = 100
    select.empty();
    if (cache != null) {
        $.each(cache, function(index, value) {
            try {
                select.append($("<option/>")
                    .attr("value", value.length > 2 ? (value.indexOf(' ') > 0 ? value.substring(0, value.indexOf(' ')) : value.substring(0,2)) : value)
                    .attr("title", value)
                    .text(value.length == 0 || value.length <= __MAX_LEN__ ? value : value.substring(0,__MAX_LEN__)+' ...')
                );
            } catch (e) {}
        });
    }
}