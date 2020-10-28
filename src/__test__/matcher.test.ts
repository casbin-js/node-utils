import Matcher from "../matcher";

test("matcher", () => {
    const m1 = new Matcher("m = r.sub == p.sub && r.obj == p.obj && r.act == p.act");
    expect(m1.getExprs()).toEqual(["r.sub == p.sub", "r.obj == p.obj", "r.act == p.act"]);

    const m2 = new Matcher("m = g(r.sub, p.sub) && r.obj == p.obj && r.act == p.act");
    expect(m2.getExprs()).toEqual(["g(r.sub, p.sub)", "r.obj == p.obj", "r.act == p.act"]);

    const m3 = new Matcher("m = a && b && c && d");
    m3.ban(1);
    expect(m3.getReservedMatcherStr().trim()).toEqual("m = a && c && d");
    m3.ban(3);
    expect(m3.getReservedMatcherStr().trim()).toEqual("m = a && c");

    const m4 = new Matcher("m = a && b || c && d || e");
    m4.ban(1);
    expect(m4.getReservedMatcherStr().trim()).toEqual("m = a || c && d || e");
    m4.ban(2);
    expect(m4.getReservedMatcherStr().trim()).toEqual("m = a || d || e");
    m4.ban(4);
    expect(m4.getReservedMatcherStr().trim()).toEqual("m = a || d");

    const m5 = new Matcher("m = a || b || c && d && e");
    m5.ban(1);
    expect(m5.getReservedMatcherStr().trim()).toEqual("m = a || c && d && e");
    m5.ban(3);
    expect(m5.getReservedMatcherStr().trim()).toEqual("m = a || c && e");
    m5.ban(0);
    expect(m5.getReservedMatcherStr().trim()).toEqual("m = c && e");
    m5.ban(4);
    expect(m5.getReservedMatcherStr().trim()).toEqual("m = c");

    const m6 = new Matcher("m = a || b || c");
    m6.ban(0);
    expect(m6.getReservedMatcherStr().trim()).toEqual("m = b || c");
    m6.ban(1);
    expect(m6.getReservedMatcherStr().trim()).toEqual("m = c");
});
