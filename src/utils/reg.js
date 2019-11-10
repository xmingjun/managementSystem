
/* 密码验证函数 */
export const regUtils = () => /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/ //密码至少包含 数字和英文，长度6-12


/* 手机号验证函数 */
export const regPhoneNum = () => /^1[3456789]\d{9}$/