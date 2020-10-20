export default class Policy {
    data: string[] = [];

    // Accept a policy, e.g ["alice", "data1", "read"]
    constructor(policy: string[]) {
        this.data = Object.assign(this.data, policy);
    }

    getAnonymousString(idx: number = 0): string {
        const t = this.data[idx];
        this.data[idx] = '_';
        const ret = this.data.join(",");
        this.data[idx] = t;
        return ret;
    }
}