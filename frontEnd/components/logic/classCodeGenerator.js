
export function makeClassCode(classrooms) {
    var result = []
    var characters = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789'
    var code_length = 6
    var alreadyExists = false
    
    for ( let i = 0; i < code_length;i++){
        result.push(characters.charAt(Math.floor(Math.random() * characters.length)));
    }
    for (let k = 0; k<=Object.keys(classrooms).length -1;k++)
    {
      if(classrooms[k].class_code==result)
      {
        alreadyExists = true
      }
    }

    if (alreadyExists == false){
        return result.join('')
    }
    else{
        makeClassCode(classrooms)
    }
}
