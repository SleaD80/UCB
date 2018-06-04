var STATUS_OK = "OK";
var STATUS_WARNING = "WARNING";
var STATUS_ERROR = "ERROR";
var STYLE_OK = "field-ok";
var STYLE_WARNING = "field-warning";
var STYLE_ERROR = "field-error";

function setFieldStatus(field, status) {
    field.attr("pmtStatus", status);
    field.removeClass();
    if(status == STATUS_OK) {       
        field.addClass(STYLE_OK);
    } else if(status == STATUS_WARNING) {
        field.addClass(STYLE_WARNING);
    } else if(status == STATUS_ERROR) {
        field.addClass(STYLE_ERROR);
    }
}

function setFieldMessage(field, message) {
    var messageField = $("#" + field.attr("id") + "Message");
    // check message field for existence
    if(messageField.length) {
        // set text
        messageField.html(message);
        // set status style
        var status = field.attr("pmtStatus");
        messageField.removeClass();
        if (status == "ERROR") {
            messageField.addClass("errorMessage")
        } else if (status == "WARNING") {
            messageField.addClass("warningMessage")
        }
    }
}
