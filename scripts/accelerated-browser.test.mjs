import {test} from 'node:test';
import assert from 'node:assert/strict';
import {requireMetal} from './verify-accelerated-browser.mjs';
test('Metal evidence labels virtual hardware and leaves school qualification outstanding',()=>{
 const virtual=requireMetal('ANGLE (Apple, ANGLE Metal Renderer: Apple Paravirtual device, Unspecified Version)','darwin');
 assert.equal(virtual.classification,'virtual-apple-metal-reported');
 assert.equal(virtual.physicalDeviceQualification,false);
 assert.equal(virtual.schoolDeviceQualification,'outstanding');
 assert.equal(requireMetal('ANGLE (Apple, ANGLE Metal Renderer: Apple M3, Unspecified Version)','darwin').classification,'apple-metal-reported');
});
test('software, unknown and wrong-platform renderers cannot pass accelerated qualification',()=>{
 for(const renderer of ['ANGLE (Google, SwiftShader)','llvmpipe','Apple GPU','ANGLE Metal Renderer: Apple SwiftShader'])assert.throws(()=>requireMetal(renderer,'darwin'));
 assert.throws(()=>requireMetal('ANGLE Metal Renderer: Apple Paravirtual device','linux'));
});
