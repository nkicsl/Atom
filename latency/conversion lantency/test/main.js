var PB = require('protobufjs');

PB.load("./policy.proto",function(err,root){
    if(err)
        throw err;
    var PolicyMessage = root.lookupType("policypackage.PolicyMessage");

    var payload = {Type:"LOOP",Condition:"1.1.1.1 SYN_RECV",Time:10,Action:"1.1.1.1,'BLOCKING'"};
    //var payload = {Type:"SEQU",condition1:"1.1.1.1 SYN_RECV",condition2:"2.2.2.2 SYN_RECV",condition3:"3.3.3.3 SYN_RECV",Time:10,Action:"1.1.1.1,'BLOCKING'"};
    //var payload = {Type:"SINGLE",Condition:"$SRC DEADLOCK",Time:1,Action:"1.1.1.1,'$SRC, 'OPENING'"};
    console.log(payload)
    var errMsg = PolicyMessage.verify(payload);
    if(errMsg)
        throw Error(errMsg);

    var message = PolicyMessage.create(payload);
    console.log(message);

    var buffer = PolicyMessage.encode(message).finish();
    console.log(buffer);

    var message = PolicyMessage.decode(buffer);
    console.log(message);
})