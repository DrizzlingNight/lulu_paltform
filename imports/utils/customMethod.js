// sleep funciton like python、c++...
export async function sleep(ms = 0) {
  return new Promise(r => setTimeout(r, ms))
}

async function sleepFuncitonExample() {
  console.log("Before: " + (new Date()).toString());
  await sleep(3000);
  console.log("After: " + (new Date()).toString());
}

// sleepFuncitonExample()

// remove an specify item from an Aarry
/**
 * removeItem 參數
 * @param {Array} list  要移除元素的陣列
 * @param {any} item  要移除的元素
**/
export function removeItem(list, item) {
  const output = [...list] // Call by Reference的關係，先Copy一份原陣列
  const index = output.indexOf(item)
  if (index > -1) {
    output.splice(index, 1)
    return output
  }
  return output // 如果找不到該元素則直接回傳原本的List
}

function removeItemFunctionExample() {
  let months = ['Jan', 'March', 'April', 'June'];
  months = removeItem(months, 'April')
  console.log(months)
  // expected output: Array(3) [ "Jan", "March", "June" ]
}

// removeItemFunctionExample()
