/**
 * @README
 * @param {string} methodDparam1 参数1
 * @param {number} methodDparam2 参数2
 * @return {string} methodD 返回值
 * @example methodD('hello', 123) // 'hello'
 */
const methodD = (methodDparam1, methodDparam2) => { };


/**
 * @README
 * @param {string} methodEparam1 参数1
 * @param {number} methodEparam2 参数2
 * @return {string} methodE 返回值
 * @example methodE('hello', 123) // 'hello'
 */
function methodE(methodEparam1, methodEparam2) { }

/**
 * @README
 * @param {string} methodFparam1 参数1
 * @param {number} methodFparam2 参数2
 * @return {string} methodF 返回值
 * @example methodF('hello', 123) // 'hello'
 */
async function methodF(methodFparam1, methodFparam2) { }

export { methodE as default, methodD, methodF };
