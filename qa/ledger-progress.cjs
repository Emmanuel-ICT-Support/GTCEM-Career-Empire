const fs=require('node:fs');
class LedgerProgress{
 onBegin(config,suite){this.total=suite.allTests().length;this.completed=0;this.active=null;this.events=process.env.CE_LEDGER_EVENTS;if(this.events)fs.writeFileSync(this.events,'');this.timer=setInterval(()=>console.log('LEDGER_HEARTBEAT',JSON.stringify({completed:this.completed,total:this.total,active:this.active})),30000);this.timer.unref();}
 record(event){console.log('LEDGER_CASE',JSON.stringify(event));if(this.events)fs.appendFileSync(this.events,JSON.stringify(event)+'\n');}
 onTestBegin(test){this.active={title:test.titlePath().join(' > '),since:Date.now()};this.record({type:'start',...this.active});}
 onTestEnd(test,result){this.completed++;this.record({type:'end',title:test.titlePath().join(' > '),status:result.status,durationMs:result.duration,completed:this.completed,total:this.total,errors:result.errors});this.active=null;}
 onStdOut(chunk){process.stdout.write(chunk);}
 onStdErr(chunk){process.stderr.write(chunk);}
 onEnd(result){clearInterval(this.timer);this.record({type:'terminal',status:result.status,completed:this.completed,total:this.total});}
}
module.exports=LedgerProgress;
