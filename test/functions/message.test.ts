import { message } from "../../src/services/message";

test('正しいメッセージが返却される', () => {
    expect(message('hoge')).toEqual(`Hello, CDK! You've hit hoge`)
})