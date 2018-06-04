var activities = [
    " ",
    "ЮЛ Юридическое лицо",
    "ФЛ Физическое лицо",
    "ИП Индивидуальный предприниматель",
    "КФХ Глава крестьянского (фермерского) хозяйства",
    "НОТАРИУС занимающийся частной практикой",
    "АДВОКАТ учредивший адвокатский кабинет" ];

var person = {
    _inn: "",
    _name: {
        _fio: "",
        _activity: "",
        print: function() { return this._fio + (this._activity.length>0?' ('+this._activity+')':'') },
        set: function(val) {
            var ind = val.indexOf('(');
            this._fio = ind>=0?val.substr(0,ind-1):val;
            this._activity = ind>=0?val.substring(ind+1,val.length-1):''
        }
    },
    _address: "",
    _doc: {
        _number: "",
        _date: "",
        print: function() { return this._number+' '+this._date },
        set: function(val) {
    //TODO strict date check needed
            this._number = val.length>11?val.substr(0,val.length-11):val;
            this._date = val.length>11?val.substr(val.length-10):'';
        }
    },
    print: function() {
        var s = "//" + this._inn + "//" + this._name.print() + "//" + this._address + "//" + this._doc.print() + "//";
        return  s.length > 11?s:'';
    },
    init: function(data) {
        //data sample: //123456789011//Сидоров В.В. (КФХ)//Москва, Гороховая, д.31-12//12345 16.02.2018//Поле свободного ввода
        data = "//123456789011//Сидоров В.В. (КФХ)//Москва, Гороховая, д.31-12//12345 16.02.2018//Поле свободного ввода";
        var props = Object.keys(person);
        data.substr(2).split('//',4).forEach(function(item, i) {
            typeof person[props[i]] === 'string'?person[props[i]]=item:person[props[i]].set(item);
        })}};

$(document).ready(function(){
    ECMA262();

    //region GetControls
        var $details = $("#payment_details");
        var $tpDetails = $("#tp_payment_details");
        var $tpINN = $("#tp_inn");
        var $tpName = $("#tp_name");
        var $tpActivity = $("#tp_activity_kind");
        var $tpAddr = $("#tp_address");
        var $tpDN = $("#tp_docnumber");
        var $tpDD = $("#tp_docdate");
        var $tpPanel = $('#tpPaymentPanel');
        var $tpCheckbox = $('#tpPaymentCheckbox');
        //endregion

    //region OverrideHandlers
        function saveTP() {
            var $details = $("#payment_details");
            $details.val(person.print() + $details.val());
        }
        /*
        var _saveDraftClick = saveDraftClick;
        saveDraftClick = function() {
            saveTP();
            _saveDraftClick();
        };

        var _printClick = printClick;
        printClick = function() {
            saveTP();
            _printClick();
        };

        var _onChangePaymentType = onChangePaymentType;
        onChangePaymentType = function(e) {
            $tpCheckbox.show();
            _onChangePaymentType(e);
        };
        */
        //endregion

    //region SetMasks
        $.mask.definitions['1'] = '[01]';
        $.mask.definitions['3'] = '[0123]';
        $tpDD.mask("39.19.2999");
        $tpINN.mask("99999?9999999",{placeholder: ""});
        //endregion

    //region SetListeners
        $tpINN.focusout(function(){ check(); person._inn=$tpINN.val(); $tpDetails.val(person.print()) });
        $tpName.focusout(function(){ check(); person._name._fio=$tpName.val(); $tpDetails.val(person.print()) });
        $tpActivity.focusout(function(){ 
            $tpActivity.val()=="ФЛ"?$tpAddr.show():$tpAddr.hide();
            check(); person._name._activity=$tpActivity.val(); $tpDetails.val(person.print()) });
        $tpAddr.focusout(function(){ check(); person._address = $tpAddr.val(); $tpDetails.val(person.print()) });
        $tpDN.focusout(function(){ person._doc._number=$tpDN.val(); $tpDetails.val(person.print()) });
        $tpDD.focusout(function(){ person._doc._date=$tpDD.val(); $tpDetails.val(person.print()) });
        $tpCheckbox.click(function(){ $tpPanel.is(':visible')===true?$tpPanel.hide():$tpPanel.show() });
        //endregion

    //region InitControls
        person.init($details.val());
        $tpDetails.val(person.print());
        $tpINN.val(person._inn);
        $tpName.val(person._name._fio);
        if ($tpActivity.val()=="ФЛ") {
            $tpAddr.val(person._address);
            $tpAddr.show();
        } else 
            $tpAddr.hide();
        $tpActivity.val(person._name._activity);
        fillSelectOptions($tpActivity, activities);
        $tpDN.val(person._doc._number);
        $tpDD.val(person._doc._date);

        //TODO $details.val() = NULL
        //$details.val($details.val().substr($tpDetails.val().length));
        person.print().length > 0?$tpPanel.show():$tpPanel.hide();
        $('#payment_type').val()=="regular_payment"?$tpCheckbox.hide():$tpCheckbox.show();
        //endregion

    //region Checks
        function renderField(control,err) {
            setFieldStatus(control, err);
            setFieldMessage(control, err.message);
        }

        function check() {
            renderField($tpINN,validateInn($tpINN.val()));
            renderField($tpINN,checkRules(innRules($tpActivity.val(),$tpINN.val())));
            renderField($tpName,checkRules(nameRules($tpActivity.val(),$tpName.val())));
            renderField($tpAddr,checkRules(addressRules($tpActivity.val(),$tpAddr.val())));
        }

        check();
        //endregion
    });