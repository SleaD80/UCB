var EXTRA_HOTKEY_ENABLE=true;
var EXTRA_HOTKEY_CODE=13; //Enter
var LEAVE_CONTROL_HANDLER_ENABLE=true;

function isMonetaryControl() {
    var mcValue = getFieldValue($('div#form #monetary_control[pmtField="true"]'));
    return mcValue.toLowerCase() == 'true';
}

function getBuyAmount(opType, rate, sAmount) {
    var bAmount = "";
    //переменная == undefined даст true если переменная undefined или null
    if(opType != undefined && rate != undefined && sAmount != undefined) {
        if (opType == 'SELL_RATE')
            bAmount = (sAmount/rate).toFixed(2);
        if (opType == 'BUY_RATE')
            bAmount = (sAmount*rate).toFixed(2);
    }
    return bAmount;
}

function getSellAmount(opType, rate, bAmount) {
    var sAmount = "";
    //переменная == undefined даст true если переменная undefined или null
    if(opType != undefined && rate != undefined && sAmount != undefined) {
        if (opType == 'SELL_RATE')
            sAmount = (bAmount*rate).toFixed(2);
        if (opType == 'BUY_RATE')
            sAmount = (bAmount/rate).toFixed(2);
    }
    return sAmount;
}

$(document).ready(function() {
    //класс для календарика
    //$("#doc_date" ).datepicker({dateFormat: 'dd.mm.yyyy'});
    //$('#doc_date').datepicker($.datepicker.regional['ru']);

    //Обход формы нестандартным хоткеем
    if(EXTRA_HOTKEY_ENABLE) {
        var elements = $('input[order],select[order],textarea[order],button[order]');
        elements.sort(function(a,b) {
            // convert to integers from strings
            a = parseInt($(a).attr("order"), 10);
            b = parseInt($(b).attr("order"), 10);
            // compare
            if(a > b) {
                return 1;
            } else if(a < b) {
                return -1;
            } else {
                return 0;
            }
        });
        elements.keydown(function(e) {
            if (e.keyCode == EXTRA_HOTKEY_CODE && $(this).attr("pmtStay") != "true" && !e.ctrlKey) {
                e.preventDefault();
                var i = elements.index(this);
                var nextElement;
                var isNextElementVisible;
                do {
                    i = (i == elements.length - 1) ? 0 : i + 1;
                    nextElement = elements.get(i);
                    isNextElementVisible = $("#"+nextElement.id+":visible")[0] != undefined;
                } while (nextElement.disabled || !isNextElementVisible)

                if(!isMonetaryControl()) {
                    while($(nextElement).attr("monetary") == "true" || nextElement.disabled) {
                        i = (i > elements.length - 1) ? 0 : i + 1;
                        nextElement = elements.get(i);
                    }
                }
                if(!isTaxPayment()) {
                    while($(nextElement).attr("tax") == "true" || nextElement.disabled) {
                        i = (i > elements.length - 1) ? 0 : i + 1;
                        nextElement = elements.get(i);
                    }
                }
                nextElement.focus();
            }
        });
        if(LEAVE_CONTROL_HANDLER_ENABLE) {
            elements.focusout(function() {handleLeaveControl($(this));});
        }
    }
});

function handleLeaveControl(control) {
    var oldPaymentType = $('div#form #payment_type').val();

    if(control.attr("pmtField") == "true") validateField(control);
    if(control.attr("actField") == "true") doActionForField(control);

    var newPaymentType = $('div#form #payment_type').val();

    // в процессе валидации и действий проверки могли сменить тип платежа
    if(newPaymentType != oldPaymentType) {
        setPaymentType(newPaymentType);
        doActionForField($('#payment_type'));
        validateField($('#payment_type'));
    }
}