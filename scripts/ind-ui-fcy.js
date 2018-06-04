var isCurrencyExtensionsVisible = false;

function updateCurrencyExtensions() {
    if (isCurrencyExtensionsVisible) {
        getRateInfo();
        if (getFieldStatus($('span#rate')) == STATUS_OK) {
            setFieldValue($('span#account_currency'), $('select#payer_account option:selected').attr("payer_acc_curr"));
            var opType = getFieldValue($('input#rate_optype'));
            var rate = getFieldValue($('span#rate'));
            var amount = getFieldValue($('input#amount')).replace('-','.');
            setFieldValue($('span#payeramt'), getSellAmount(opType,rate,amount));
        } else {
            isCurrencyExtensionsVisible = false;
            $('div#currencyExtentions').hide();
        }
    }
}

function showCurrencyExtensions() {
    var accountCurrency = $('select#payer_account option:selected').attr("payer_acc_curr");
    var paymentCurrency = $('select#pmt_curr').val();
    if (getFieldStatus($('input#amount')) == STATUS_ERROR || accountCurrency == paymentCurrency) {
        isCurrencyExtensionsVisible = false;
        $('div#currencyExtentions').hide();
        $('#payeramt').attr('pmtField', false);
    } else {
        isCurrencyExtensionsVisible = true;
        $('div#currencyExtentions').show();
        $('#payeramt').attr('pmtField', true);
    }
}

//noinspection JSUnusedGlobalSymbols
function validateBnfBankSwiftField() {
    if(!isFormFrozen()) {
        validateField($('div#form #bnf_bank_swift[pmtField="true"]'));
    }
}

//noinspection JSUnusedGlobalSymbols
function validateMdtBankSwiftField() {
    if(!isFormFrozen()) {
        validateField($('div#form #mdt_bank_swift[pmtField="true"]'));
    }
}

$(document).ready(function(){
    showCurrencyExtensions();
    setFieldValue($('span#account_currency'), $('select#payer_account option:selected').attr("payer_acc_curr"));

    $('select#payer_account').change(function() {
        setFieldStatus($('input#amount'), STATUS_OK);
        setFieldMessage($('input#amount'), '');
        setFieldValue($('select#pmt_curr'), $('select#payer_account option:selected').attr("payer_acc_curr"));
        setFieldValue($('span#rate'), '');
        setFieldValue($('span#payeramt'), '');
        showCurrencyExtensions();
        updateCurrencyExtensions();
    });

    $('select#pmt_curr').change(function() {
        setFieldStatus($('input#amount'), STATUS_OK);
        setFieldMessage($('input#amount'), '');
        showCurrencyExtensions();
        updateCurrencyExtensions();
    });

    $('input#amount').focusout(function() {
        showCurrencyExtensions();
        updateCurrencyExtensions();
    });
});