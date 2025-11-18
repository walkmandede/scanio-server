function superLog(body,title){
    console.log('-------');
    if(title)console.log(title??'TITLE');
    if(title)console.log('\n');
    console.log(body);
    console.log('-------');
}

export default superLog;