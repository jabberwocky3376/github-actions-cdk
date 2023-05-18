export class CustomException extends Error {
    status: number
    /**
     * コンストラクタ
     * @param parameterName パラメータ名
     * @param message メッセージ
     */
    constructor(status: number, message?: string) {
        super(message);
        this.status = status;
    }
}