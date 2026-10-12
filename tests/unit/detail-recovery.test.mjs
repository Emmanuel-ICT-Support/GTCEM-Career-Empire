import {test,expect} from 'vitest';
import {canClearDetailWarning} from '../../playable-3d/startup-assets.mjs';
test('canonical arrival clears recovered surfaces before optional campus is loaded',()=>{expect(canClearDetailWarning({entryReady:true,campusReady:false,campusLoading:null,pending:0})).toBe(true);});
test('actual missing surface jobs remain retryable even when campus geometry is ready',()=>{expect(canClearDetailWarning({entryReady:true,campusReady:true,campusLoading:null,pending:1})).toBe(false);});
test('initial and active geometry loading retain their progress status',()=>{expect(canClearDetailWarning({entryReady:false,campusReady:false,campusLoading:null,pending:0})).toBe(false);expect(canClearDetailWarning({entryReady:true,campusReady:false,campusLoading:Promise.resolve(),pending:0})).toBe(false);expect(canClearDetailWarning({entryReady:true,campusReady:true,campusLoading:null,pending:0})).toBe(true);});
test('recovered textures cannot clear a failed full-campus geometry warning',()=>{expect(canClearDetailWarning({entryReady:true,campusReady:false,campusLoading:null,pending:0,campusFailed:true})).toBe(false);});
