export class MessageBuffer {
    private delimiter: string;
    public content: string;

    constructor(delimiter: string) {
        this.delimiter = delimiter;
        this.content = "";
    }

	public isDone() {
        return this.content.length === 0 || 
            this.content.indexOf(this.delimiter) === -1;
    }

    public push(data: string) {
        this.content += data;
    }

    public getMessage() {
        const delimiterIndex = this.content.indexOf(this.delimiter);

        if (delimiterIndex !== -1) {
            let message = new String(this.content.slice(0, delimiterIndex)).toString();
            this.content = this.content.replace(message + this.delimiter, "");
            return message;
        }

        return null
    }

}

