function include(values, value) { return values.indexOf(value) > -1 }
function exclude(values, value) { return values.indexOf(value) == -1 }
function unmatch(reg, value) { return value.search(reg) != 0 }
function alwaysTrue() { return true }
function checkRules(rules) {
    var error = {};
    rules.some(function(rule) {
        var result = rule[0].every(function (condition) {
            return condition.f.apply(this, condition.p);
        });
        if (result) {
            error.status=rule[1];
            error.message=rule[2];
        }
        return result
    });
    return error;
}

//region Rules
function innRules(act,inn) {
    return [
        [[{f:include,p:["ЮЛ",act]},{f:exclude,p:['_5_10_','_'+inn.length+'_']}], STATUS_ERROR, "ИНН для ЮЛ должен быть 5 или 10 цифр"],
        [[{f:include,p:["ФЛ",act]},{f:exclude,p:['_12_','_'+inn.length+'_']}], STATUS_ERROR, "ИНН для ФЛ должен быть 12 цифр"],
        [[{f:include,p:["ИП,нотариус,адвокат,КФХ",act]},{f:exclude,p:[[12],inn.length]}], STATUS_ERROR, "ИНН для ИП должен быть 12 цифр"],
        [[{f:alwaysTrue,p:null}], STATUS_WARNING, "ИНН должен быть указан того, за кого платят"]
    ];
}

function nameRules(act,name) {
    return [
        [[{f:include,p:["ЮЛ",act]},{f:unmatch,p:[/(ООО|ЗАО|ПАО)\s([\wа-яё]+)/gi,name]}], STATUS_ERROR, "Укажите форму собственности и хотя бы одно слово"],
        [[{f:include,p:["ИП,нотариус,адвокат,КФХ",act]},{f:unmatch,p:[/(ИП|КХ|АК)\s([\wа-яё]+)/gi,name]}], STATUS_ERROR, "Укажите форму ИП и хотя бы одно слово"],
        [[{f:include,p:["ФЛ",act]},{f:exclude,p:[[2],name.split(' ',2).length]} ], STATUS_ERROR, "Укажите хотя бы два слова"],
        [[{f:alwaysTrue,p:null}], STATUS_OK, ""]
    ];
}

function addressRules(act,addr) {
    return [
        [[{f:include,p:["ФЛ",act]},{f:unmatch,p:[/(ООО|ЗАО|ПАО)\s([\wа-яё]+)/gi,addr]}], STATUS_ERROR, "Поле адрес должно содержать не менее 15 символов и по крайней мере 1 символ из них должен быть цифрой"],
        [[{f:alwaysTrue,p:null}], STATUS_OK, ""]
    ];
}
//endregion
