export {}
import { getInfo } from "@el3um4s/svelte-get-component-info";
function get() {
    const info = getInfo("./Component.svelte");
    return info;
}

function test(){
 //get the data from the get function and display it
    const info= get();
    const prop = info.props[0].name;
    for(var i=0;i<info.props.length;i++){
        if(info.props[i].type == undefined){
            console.log(`it is better to have a type for the variable: ${info.props[i].name}`);
        }
        if(info.props[i].defaultValue == undefined){
            console.log(`it is better to have a default value for variable: ${info.props[i].name}`);
        }
}
}
test()