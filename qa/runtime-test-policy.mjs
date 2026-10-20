import {renderQuality} from '../playable-3d/render-quality.mjs';

export function classifyBackend(name=''){
 if(renderQuality(name,'auto',1).software||/software renderer|lavapipe|swrast/i.test(name))return 'software-compatibility';
 if(/Apple|Intel|NVIDIA|GeForce|Radeon|\bAMD\b|Adreno|Mali|PowerVR/i.test(name))return 'gpu-performance';
 return 'unverified';
}
export function runtimeObservation({renderer,handoverMs=null,navigationToReadyMs=null,expectedLane='auto',performanceRequired=true}){
 const lane=classifyBackend(renderer),backendMatches=expectedLane==='auto'||lane===expectedLane;
 const measured=Number.isFinite(handoverMs)&&handoverMs>=0;
 const evaluated=backendMatches&&lane==='gpu-performance'&&performanceRequired&&measured;
 return {renderer,lane,expectedLane,backendMatches,handoverMs,navigationToReadyMs,performanceRequired,
  gpuPerformance:{targetMs:8000,evaluated,result:!backendMatches?'backend-mismatch':evaluated?(handoverMs<8000?'passed':'failed'):lane==='software-compatibility'?'not-applicable':!performanceRequired?'not-requested':!measured?'not-measured':'unverified',scope:'verified accelerated graphics'},
  softwareWaitingTimeAcceptance:{targetMs:null,status:'not-assessed; no numerical acceptance deadline approved'},
  softwareStartupFixed:false,schoolDeviceValidation:'outstanding'};
}
