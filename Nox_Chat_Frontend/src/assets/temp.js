
// let obj = {
//   name: { first: "Robert", middle: "", last: "Smith" },
//   age: 25,
//   DOB: "-",
//   hobbies: ["running", "coding", "-"],
//   education: { highschool: "N/A", college: "Yale" },
// };



// let count = 0;


// const removeKeys = (obj, count) => {
//     for(let key in obj){
//      if (obj[key] === "N/A" || obj[key] === "-" || !obj[key]) {
//        delete obj[key];
//        count++;
//      }
//     }
//     return obj;
// }



// for(let key in obj){
//         let pair = obj[key];
//         let type = typeof(pair)

//          if (Array.isArray(pair)) {
//            let newArr = [];
//            for (let i = 0; i < pair.length; i++) {
//              if (pair[i] === "N/A" || pair[i] === "-" || !pair[i]) {
//                count++;
//              } else {
//                newArr.push(pair[i]);
//              }
//            }
//            obj[key] = newArr;
//          }

// else if(type.toString() === "object") {
//     for(let data in pair){
//         if(pair[data] === "N/A" || pair[data] === "-" || !pair[data]){
//             delete pair[data];
//             count++;
//         }
//     }
//     obj[key] = pair;
// }


//  else{
//  if (obj[key] === "N/A" || obj[key] === "-" || !obj[key]) {
//    delete obj[key];
//    count++;
//  }
// }

// }

// const countObj = {
//   items_removed : count
// };

// console.log(countObj)

// const strObj = JSON.stringify(obj)

// console.log(strObj);


// let a = new Date().toISOString();
// let b = "2024-06-23T09:58:15.577Z";

// console.log(a>b)

// let a = [1,2,3];
// a= a.filter((i) => i != 2)
// console.log(a)

const a = [1,2,3];

a.splice(2,1);
console.log(a)
