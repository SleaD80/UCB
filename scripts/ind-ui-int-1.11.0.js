var paymentToFormOriginal = paymentToForm;

function selectCurrentAccounts($tblPayer, $tblBnf) {
    var payerAccSelected = $('#payer_account_selected').val();
    var bnfAccSelected = $('#bnf_account_selected').val();

    if (payerAccSelected != undefined && payerAccSelected != '') {
        $tblPayer.find("tr:contains(" + payerAccSelected + ")").addClass('current');
    }
    if (bnfAccSelected != undefined && bnfAccSelected != '') {
        $tblBnf.find("tr:contains(" + bnfAccSelected + ")").addClass('current');
    }
}

paymentToForm = function paymentToFormINT(data) {
    paymentToFormOriginal(data);

    if (data.accounts != null) {
        var $tblPayer = $('table#payerAccountList');
        var balanceDisplayInlineStyle = isFormCanSeeBalance() ? "" : "style='display:none'";

        if ($('table#payerAccountList tr').length == 1 ) {
            $.each(data.accounts, function (index, account) {
                $trPayer = $('<tr>');
                if (account.currencyCode == 'RUR') {
                    $trPayer.attr('class', 'selectable');
                } else {
                    $trPayer.attr('class', 'unselectable');
                }
                $trPayer.attr('accSpecials', account.accountSpecial);
                $trPayer.append($('<td class=\'accType\'>').html(account.description),
                    $('<td class=\'accountPayer\'>').html(account.cbAccountNumber),
                    $('<td class=\'amount\' ' + balanceDisplayInlineStyle + '>').html(account.currentBalance),
                    $('<td class=\'accCurrency\'>').html(account.currencyCode));
                $tblPayer.append($trPayer);
            });
            $('#payer_table').val($tblPayer.html());
            $('#payer_account_selected').val($('#payer_account').val());
        }

        var $tblBnf = $('table#bnfAccountList');
        if ($('table#bnfAccountList tr').length == 1) {
            $.each(data.accounts, function (index, account) {
                $trBnf = $('<tr>');
                if (account.currencyCode == 'RUR') {
                    $trBnf.attr('class', 'selectable');
                } else {
                    $trBnf.attr('class', 'unselectable');
                }
                $trBnf.append($('<td class=\'accType\'>').html(account.description),
                    $('<td class=\'accountBnf\'>').html(account.cbAccountNumber),
                    $('<td class=\'amount\' ' + balanceDisplayInlineStyle + '>').html(account.currentBalance),
                    $('<td class=\'accCurrency\'>').html(account.currencyCode));
                $tblBnf.append($trBnf);
            });
            $('#bnf_table').val($tblBnf.html());
            $('#bnf_account_selected').val($('#bnf_account').val());
        }

        checkAvailableHeight();
    }
    selectCurrentAccounts($tblPayer, $tblBnf);
};

//noinspection JSUnusedGlobalSymbols
function getRateInfoData() {
    var fields = [];
    fields.push(createFieldElementFromForm($('div#form input#payer_acc_curr[pmtField="true"]')));
    fields.push(createFieldElementFromForm($('div#form input#bnf_acc_curr[pmtField="true"]')));

    return {
        "fields": fields,
        "action": "getRateInfo"
    };
}

function isKeyAllowed(event) {
    var key, keyChar;
    if(!event) event = window.event;
    /*  uncomment for FF
     если нажата одна из следующих клавиш: enter, tab, backspace, del, стрекла влево, стрелка вправо
     тогда на этом завершаем работу функции, т.к. эти клавиши нужны для нормальной работы с полями форм

     if (event.keyCode) key = event.keyCode;
     if(key==8 || key==13 || key==37 || key==39 || key==46 || key==9) return true;
     */
    if(event.which) key = event.which;
    keyChar=String.fromCharCode(key);
    // разрешены только цифры и один раз '.'
    // с 96 по 104 коды цифр Num клавиатуры
    return !(!/[0-9\.]/.test(keyChar) || ('.' == keyChar && event.currentTarget.value.indexOf(".") != -1))
        || (event.type == 'keyup' && key < 105 && key > 95);
}

function handleTableRowMouseOver() {
    if (!isFormFrozen()) $(this).addClass('highlight');
}

function handleTableRowMouseOut() {
    if (!isFormFrozen()) $(this).removeClass('highlight');
}

function handleTableRowClick() {
    if (!isFormFrozen()) {
        var table = $(this).closest('.acclist');
        table.find('.current').removeClass('current');
        $(this).addClass('current');
        var payerAccountList = $('#payerAccountList');
        var bnfAccountList = $('#bnfAccountList');
        var accountPayer = payerAccountList.find('.current .accountPayer').text();
        var accountBnf =  bnfAccountList.find('.current .accountBnf').text();
        var sameAccounts = ((accountPayer != '' || accountPayer != undefined) &&
            (accountBnf != '' || accountBnf != undefined)) &&
            accountPayer == accountBnf;

        if (sameAccounts != true) {
            $('#payer_account').val(accountPayer);
            $('#bnf_account').val(accountBnf);
            $('#payer_account_selected').val(accountPayer);
            $('#bnf_account_selected').val(accountBnf);

            var payerCurrency = payerAccountList.find('.current .accCurrency').text();
            var payerAccType = payerAccountList.find('.current .accType').text();
            var payerBal = payerAccountList.find('.current .amount').text();
            var payerAccSpecials = payerAccountList.find('.current').attr('accSpecials');

            var bnfCurrency = bnfAccountList.find('.current .accCurrency').text();
            var bnfAccType = bnfAccountList.find('.current .accType').text();
            var bnfBal = bnfAccountList.find('.current .amount').text();

            $('#payer_acc_bal').val(payerBal);
            $('#payer_acc_curr').val(payerCurrency);
            $('#payer_acc_type').val(payerAccType);
            $('#payer_acc_specials').val(payerAccSpecials);

            $('#bnf_acc_bal').val(bnfBal);
            $('#bnf_acc_curr').val(bnfCurrency);
            $('#bnf_acc_type').val(bnfAccType);

            $('#payer_currency_code').val(payerCurrency);
            $('#bnf_currency_code').val(bnfCurrency);

            $('#currency').text(payerCurrency);
            if ((payerCurrency !='' && bnfCurrency !='')) {
                if (payerCurrency == bnfCurrency) {
                    $('#amtblock1').show();
                    $('#amtblock2').hide();
                    $('#payeramt').attr('pmtField', false);
                    $('#bnfamt').attr('pmtField', false);
                    $('#amount').attr('pmtField', true);
                    $('#payeramtMessage').hide();
                    $('#bnfamtMessage').hide();
                    $('#amountMessage').show();
                    $('#amount').focus();
                } else {
                    $('#amtblock1').hide();
                    $('#amtblock2').show();
                    $('#payercur').text(payerCurrency);
                    $('#bnfcur').text(bnfCurrency);
                    getRateInfo();
                    $('#payeramt').attr('pmtField', true);
                    $('#bnfamt').attr('pmtField', true);
                    $('#amount').attr('pmtField', false);
                    $('#payeramtMessage').show();
                    $('#bnfamtMessage').show();
                    $('#amountMessage').hide();
                    $('#payeramt').focus();
                }
            }
        } else {
            if (table.attr('id') == "payerAccountList") {
                $('#payer_account').val("");
                $('#payer_account_selected').val("");
            } else {
                $('#bnf_account').val("");
                $('#bnf_account_selected').val("");
            }
            table.find('.current').removeClass('current');
        }
    }
}

if(!isClientEventHandlerRegistered("changePage")) {
    registerClientEventHandler(null, "changePage", onChangePage);
}

function onChangePage(page) {
    postServerEvent(null, null, getElementName(), "onComponentPage", getPageConstant(), page);
}

function showAmount() {
    var payerCurrency = $('#payerAccountList').find('.current .accCurrency').text();
    var bnfCurrency = $('#bnfAccountList').find('.current .accCurrency').text();
    if (payerCurrency != '' && bnfCurrency != '' && payerCurrency != bnfCurrency) {
        $('#amtblock1').hide();
        $('#amtblock2').show();
    }
}

function drawTable() {
    var payerTableHtml = $('#payer_table').val();
    var bnfTableHtml = $('#bnf_table').val();
    var status = $('#status').val();

    if (payerTableHtml != '' && bnfTableHtml != '') {    //return from print
        var $tblPayer = $('table#payerAccountList');
        $tblPayer.html(payerTableHtml);
        var $tblBnf = $('table#bnfAccountList');
        $tblBnf.html(bnfTableHtml);
        selectCurrentAccounts($tblPayer,$tblBnf);
    } else {
		var balanceDisplayInlineStyle = isFormCanSeeBalance() ? "" : "style='display:none'";
        var payerAccount = $('#payer_account').val();
        var bnfAccount = $('#bnf_account').val();
        if (payerAccount != '' && bnfAccount != '') { //existing form : 2 accounts in each table : payer and bnf  //
            $tblPayer = $('table#payerAccountList');
            $tblBnf = $('table#bnfAccountList');

            //class accountPayer = for the left table
            //class accountBnf - for the right table
            $trPayer = $('<tr>');
            $trPayer.attr('class', 'selectable');
            $trPayer.append($('<td class=\'accType\'>').html($('#payer_acc_type').val()),
                $('<td class=\'accountPayer\'>').html(payerAccount),
                $('<td class=\'amount\' ' + balanceDisplayInlineStyle + '>').html($('#payer_acc_bal').val()),
                $('<td class=\'accCurrency\'>').html($('#payer_acc_curr').val()));

            $trBnf = $('<tr>');
            $trBnf.attr('class', 'selectable');
            $trBnf.append($('<td class=\'accType\'>').html($('#bnf_acc_type').val()),
                $('<td class=\'accountPayer\'>').html(bnfAccount),
                $('<td class=\'amount\' ' + balanceDisplayInlineStyle + '>').html($('#bnf_acc_bal').val()),
                $('<td class=\'accCurrency\'>').html($('#bnf_acc_curr').val()));

            $trPayer2 = $('<tr>');
            $trPayer2.attr('class', 'selectable');
            $trPayer2.append($('<td class=\'accType\'>').html($('#payer_acc_type').val()),
                $('<td class=\'accountBnf\'>').html(payerAccount),
                $('<td class=\'amount\' ' + balanceDisplayInlineStyle + '>').html($('#payer_acc_bal').val()),
                $('<td class=\'accCurrency\'>').html($('#payer_acc_curr').val()));

            $trBnf2 = $('<tr>');
            $trBnf2.attr('class', 'selectable');
            $trBnf2.append($('<td class=\'accType\'>').html($('#bnf_acc_type').val()),
                $('<td class=\'accountBnf\'>').html(bnfAccount),
                $('<td class=\'amount\' ' + balanceDisplayInlineStyle + '>').html($('#bnf_acc_bal').val()),
                $('<td class=\'accCurrency\'>').html($('#bnf_acc_curr').val()));

            $tblPayer.append($trPayer);
            $tblPayer.append($trBnf);
            $('#payer_table').val($tblPayer.html());//hidden field

            $tblBnf.append($trPayer2);
            $tblBnf.append($trBnf2);
            $('#bnf_table').val($tblBnf.html());	//hidden field

            $tblPayer.find("tr:eq(1)").addClass('current');//selection
            $tblBnf.find("tr:eq(2)").addClass('current');//selection

            $('#payer_account_selected').val(payerAccount); //hidden field
            $('#bnf_account_selected').val(bnfAccount); //hidden field
        }
    }
    showAmount();
}

function checkAvailableHeight(){
    var container = document.getElementById("accblock");
    container.style.height = (container.clientHeight < 300)? "auto" : "300px";
}

function refreshPayerInfo() {
    if (!isFormFrozen())
        try {
            $('table#payerAccountList').find("tr:gt(0)").remove();
            $('table#bnfAccountList').find("tr:gt(0)").remove();
            getClientInfo();
            $('.selectable').mouseover(handleTableRowMouseOver);
            $('.selectable').mouseout(handleTableRowMouseOut);
            $('.selectable').click(handleTableRowClick);
        } catch (e) {// IE6 error
        }
}

$(document).ready(function() {
    var paymentJSON = $('div#form input[name="'+getFormFieldsElementName()+'"]').val();
    var payment = $.evalJSON(paymentJSON);
    paymentToFormOriginal(payment);
    getClientInfo();
    drawTable();

    // set event handlers
    $('.selectable').mouseover(handleTableRowMouseOver);
    $('.selectable').mouseout(handleTableRowMouseOut);
    $('.selectable').click(handleTableRowClick);

    $("#payeramt").keypress(isKeyAllowed);
    $("#payeramt").keyup(function(event) {
        if (isKeyAllowed(event)) {
            var opType = getFieldValue($('input#rate_optype'));
            var pAmount = getFieldValue($('input#payeramt')).replace('-','.');
            var rate = getFieldValue($('span#rate'));
            if (getFieldStatus($('span#rate')) == STATUS_OK)
                setFieldValue($('input#bnfamt'), getBuyAmount(opType,rate,pAmount))
        }
    });
    $("#payeramt").focusout(function() {
        var opType = getFieldValue($('input#rate_optype'));
        var pAmount = getFieldValue($('input#payeramt')).replace('-','.');
        var rate = getFieldValue($('span#rate'));
        if (getFieldStatus($('span#rate')) == STATUS_OK)
            setFieldValue($('input#bnfamt'), getBuyAmount(opType,rate,pAmount))
    });

    $("#bnfamt").keypress(isKeyAllowed);
    $("#bnfamt").keyup(function(event){
        if (isKeyAllowed(event)) {
            var opType = getFieldValue($('input#rate_optype'));
            var bAmount = getFieldValue($('input#bnfamt')).replace('-','.');
            var rate = getFieldValue($('span#rate'));
            if (getFieldStatus($('span#rate')) == STATUS_OK)
                setFieldValue($('input#payeramt'), getSellAmount(opType,rate,bAmount))
        }
    });
    $("#bnfamt").focusout(function(){
        if (isKeyAllowed(event)) {
            var opType = getFieldValue($('input#rate_optype'));
            var bAmount = getFieldValue($('input#bnfamt')).replace('-','.');
            var rate = getFieldValue($('span#rate'));
            if (getFieldStatus($('span#rate')) == STATUS_OK)
                setFieldValue($('input#payeramt'), getSellAmount(opType,rate,bAmount))
        }
    });

    $("#payer_refresh").click(refreshPayerInfo);

    $("#amount").keyup(function(event){
        if(event.keyCode == 13){
            $("#printButton").focus();
        }
    });

    $("#printButton").click(function() {
        // обновление БИКов при печати по последним выбранным счетам
        var payerBankBicField = $('#payer_bank_bic');
        setFieldValue(payerBankBicField, "");
        setFieldStatus(payerBankBicField, STATUS_OK);
        setFieldMessage(payerBankBicField, "");
        var bnfBankBicField = $('#bnf_bank_bic');
        setFieldValue(bnfBankBicField, "");
        setFieldStatus(bnfBankBicField, STATUS_OK);
        setFieldMessage(bnfBankBicField, "");

        try{
            validatePayment();
        } catch (e) {
            //IE 6 the 'length' error - does not affect the functionality
        }
        if(haveNotOkFields()) {
            return;
        }

        getClientBankInfo();

        // ручная проверка заполненности БИК банков, так как постоянно висящая в случае pmtvalidation некрасива
        if(getFieldValue(payerBankBicField).length == 0) {
            setFieldStatus(payerBankBicField, STATUS_ERROR);
            setFieldMessage(payerBankBicField, "Ошибка получения БИК по счету списания! Попробуйте еще раз.");
            return;
        }
        if(getFieldValue(bnfBankBicField).length == 0) {
            setFieldStatus(bnfBankBicField, STATUS_ERROR);
            setFieldMessage(bnfBankBicField, "Ошибка получения БИК по счету зачисления! Попробуйте еще раз.");
            return;
        }

        // set dmf:hidden name="formFields" with fields in JSON
        $('#draft_saved').val("false");
        var payment = formToPayment();
        var paymentJSON = $.toJSON(payment);
        $('div#form input[name="'+getFormFieldsElementName()+'"]').val(paymentJSON);

        // post print event to component class
        safeCall(postServerEvent2,getFormElementName(),null,null,getElementName(),"print");
        setElementInvisible($('#saveDraftMessage'));
    });

    $("#signButton").click(function() {
        // post sign event to component class
        safeCall(postServerEvent2,getFormElementName(),null,null,getElementName(),"sign");
    });

    $("#editButton").click(function() {
        unfreezeForm();
        setFormEditable(false);
        setFormCansign(false);
        refreshPayerInfo();
    });

    if($('#draft_saved').val() != "true") {
        setElementInvisible($('#saveDraftMessage'));
    }

    $("#saveDraftButton").click(function() {
        getClientBankInfo();
        $('#draft_saved').val("true");
        var payment = formToPayment();
        var paymentJSON = $.toJSON(payment);
        $('div#form input[name="'+getFormFieldsElementName()+'"]').val(paymentJSON);
        // post print event to component class
        safeCall(postServerEvent2,getFormElementName(),null,null,getElementName(),"saveDraft");
        setElementVisible($('#saveDraftMessage'));
    });
});