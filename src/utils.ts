export function checkEmailValid(email: string): boolean {
    const emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (email !== "" && email.match(emailFormat)) {
        return true;
    }

    return false;
}

export function checkPassword(password: string): boolean {
    // 8자 이상, 최소 하나 이상의 문자 + 숫자
    const passwordFormat = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (password !== "" && password.match(passwordFormat)) {
        return true;
    }

    return false;

    // 최소 8 자, 최소 하나의 문자 및 하나의 숫자 :
    // "^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$"

    // 최소 8 자, 최소 하나의 문자, 하나의 숫자 및 하나의 특수 문자 :
    // "^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$"

    // 최소 8 자, 대문자 하나 이상, 소문자 하나 및 숫자 하나 :
    // "^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$"

    // 최소 8 자, 대문자 하나 이상, 소문자 하나, 숫자 하나 및 특수 문자 하나 이상 :
    // "^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}"

    // 최소 8 자 및 최대 10 자, 대문자 하나 이상, 소문자 하나, 숫자 하나 및 특수 문자 하나 이상 :
    // "^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,10}"
}
