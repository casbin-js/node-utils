export default class Policy {
    data!: string[];
    constructor(policy: string[]) {
        this.data = Object.assign(this.data, policy)
    }

    getAnonymizedPolicyString(idx: number = 0) {
        const t = this.data[idx+1];
        const ret = this.data.join(",");
        this.data[idx+1] = t;
        return ret;
    }
}