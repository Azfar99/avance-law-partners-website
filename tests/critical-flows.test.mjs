import test from 'node:test';
import assert from 'node:assert/strict';
import {loadTS,memoryStorage} from './helpers/load.mjs';
const loadTypeScript=(file,env={})=>loadTS(new URL(file,import.meta.url),env);
const { validateEnquiry, normalizeEnquiry } = await loadTypeScript(
  "../src/lib/contactValidation.ts",
)
const valid = {
  name: "Example Client",
  email: "client@example.com",
  phone: "+880 1000000000",
  subject: "Corporate Law",
  message: "A short enquiry.",
}
test("enquiry accepts Bengali names and trimmed email addresses", () => {
  assert.deepEqual(
    validateEnquiry({ ...valid, name: "পরীক্ষা", email: " client@example.com " }),
    {},
  )
  assert.equal(
    normalizeEnquiry({ ...valid, email: " client@example.com " }).email,
    valid.email,
  )
})
test("enquiry catches blank fields, malformed email, header injection and overlong messages", () => {
  assert.deepEqual(
    Object.keys(
      validateEnquiry({
        name: " ",
        email: "invalid",
        phone: "1".repeat(61),
        subject: "Law\r\nBcc: x",
        message: "a".repeat(5001),
      }),
    ).sort(),
    ["email", "message", "name", "phone", "subject"],
  )
  assert.deepEqual(validateEnquiry({ ...valid, message: "a".repeat(5000) }), {})
})


const environment={VITE_SUPABASE_URL:'https://xweeslmfqpgnxfkgrbat.supabase.co',VITE_SUPABASE_PUBLISHABLE_KEY:'sb_publishable_offline_fixture_only',VITE_SITE_ORIGIN:'https://avancelawpartners.info'};
test('unconfigured writes and login fail closed; legacy sessions are ignored',async()=>{
 const store=memoryStorage();globalThis.localStorage=store;store.setItem('alp_auth_token','production-cache');store.setItem('alp_auth_user','{}');const original=globalThis.fetch;let calls=0;globalThis.fetch=async()=>{calls++;throw Error('No network expected')};
 try{const {supabase,getStoredSession}=await loadTypeScript('../src/lib/supabase.ts',{DEV:true});assert.equal(getStoredSession(),null);assert.ok((await supabase.auth.signInWithPassword({email:'audit@example.invalid',password:'test-only'})).error);assert.ok((await supabase.from('services').insert({title:'x'})).error);assert.ok((await supabase.from('services').update({title:'x'}).eq('id','a')).error);assert.ok((await supabase.from('services').delete().eq('id','a')).error);assert.equal(calls,0);}finally{globalThis.fetch=original}
});
test('fluent mutations keep record filters and report server rejection',async()=>{
 globalThis.localStorage=memoryStorage();const original=globalThis.fetch,requests=[];globalThis.fetch=async(url,options)=>{requests.push({url,options});return Response.json({message:'Permission denied'},{status:403})};
 try{const {supabase}=await loadTypeScript('../src/lib/supabase.ts',environment);const result=await supabase.from('lawyers').update({published:false}).eq('id','record one');assert.equal(result.error.message,'Permission denied');assert.equal(requests[0].options.method,'PATCH');assert.match(requests[0].url,/id=eq.record%20one/);assert.ok((await supabase.from('lawyers').update({published:false})).error);assert.ok((await supabase.from('lawyers').delete()).error);}finally{globalThis.fetch=original}
});
test('configured network failure never authenticates an administrator',async()=>{
 globalThis.localStorage=memoryStorage();const original=globalThis.fetch;globalThis.fetch=async()=>{throw Error('Offline')};try{const {supabase,verifyCurrentAdmin}=await loadTypeScript('../src/lib/supabase.ts',environment);assert.ok((await supabase.auth.signInWithPassword({email:'audit@example.invalid',password:'test-only'})).error);assert.equal(await verifyCurrentAdmin(),null);}finally{globalThis.fetch=original}
});
test('admin verification requires both valid Auth identity and server membership',async()=>{
 const store=memoryStorage();globalThis.localStorage=store;const original=globalThis.fetch;let member=false;globalThis.fetch=async url=>url.endsWith('/auth/v1/user')?Response.json({id:'test-user',email:'audit@example.invalid'}):Response.json(member);
 try{const {setStoredSession,verifyCurrentAdmin}=await loadTypeScript('../src/lib/supabase.ts',environment);setStoredSession('offline-user-token',{id:'test-user'});assert.equal(await verifyCurrentAdmin(),null);member=true;assert.equal((await verifyCurrentAdmin()).role,'admin');assert.ok([...store.data.keys()].every(key=>key.startsWith('alp_prod_xweeslmfqpgnxfkgrbat_')));}finally{globalThis.fetch=original}
});

test('public content reads ignore even an expired admin token',async () => {
  globalThis.localStorage = memoryStorage();
  const previous = globalThis.fetch;
  const sent = [];
  globalThis.fetch = async (_url, options) => {
    sent.push(options.headers);
    return Response.json([]);
  };
  try {
    const { supabase, setStoredSession } = await loadTypeScript('../src/lib/supabase.ts', environment);
    setStoredSession('expired-session-fixture', { id: 'test-user' });
    await supabase.from('lawyers', { useSession: false }).select().eq('published', true);
    await supabase.from('lawyers', { useSession: true }).select();
    assert.equal(sent[0].Authorization, undefined);
    assert.equal(sent[0].apikey, environment.VITE_SUPABASE_PUBLISHABLE_KEY);
    assert.equal(sent[1].Authorization, 'Bearer expired-session-fixture');
  } finally { globalThis.fetch = previous; }
});
