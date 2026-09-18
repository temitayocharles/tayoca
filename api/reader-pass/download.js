import fs from "node:fs/promises";
import path from "node:path";
import {json,readJson,readSession,entitlement,rateLimit,audit} from "./_lib/reader-pass.js";

const RESOURCES={
 "ai-automation-career-playbook":{"edition":"1.0","file":"ai-automation-career-playbook-v1.0.zip","name":"AI_Automation_Career_Playbook_v1.0.zip"},
 "ai-wrote-the-script":{"edition":"1.0","file":"ai-wrote-the-script-v1.0.zip","name":"AI-Wrote-the-Script_Can-You-Defend-It_v1.0_Digital-Bundle.zip"},
 "cloud-cost-kubernetes-finops":{"edition":"1.0","file":"cloud-cost-kubernetes-finops-v1.0.zip","name":"Cloud_Cost_Optimization_Kubernetes_FinOps_Playbook_v1.0.zip"},
 "devops-incident-runbook":{"edition":"1.0","file":"devops-incident-runbook-v1.0.zip","name":"DevOps_Incident_Runbook_Template_v1.0.zip"},
 "gitops-field-guide":{"edition":"1.0","file":"gitops-field-guide-v1.0.zip","name":"GitOps_Field_Guide_v1.0.zip"},
 "kubernetes-production-readiness":{"edition":"1.0","file":"kubernetes-production-readiness-v1.0.zip","name":"Kubernetes_Production_Readiness_Checklist_v1.0.zip"},
 "n8n-mcp-kubernetes-teaching-pack":{"edition":"1.0","file":"n8n-mcp-kubernetes-teaching-pack-v1.0.zip","name":"n8n_MCP_Kubernetes_Teaching_Pack_v1.0.zip"}
};
export default async function handler(req,res){
 if(req.method!=="POST")return json(res,405,{error:"method_not_allowed"});
 try{
  const raw=(req.headers.cookie||"").match(/(?:^|; )tayoca_reader=([^;]+)/)?.[1];if(!raw)return json(res,401,{error:"unauthorized"});
  const s=await readSession(raw),body=await readJson(req);
  if(body.product!==s.product||body.edition!==s.edition)return json(res,403,{error:"scope_mismatch"});
  if(!await entitlement(s.sub,s.product,s.edition))return json(res,403,{error:"not_entitled"});
  if(!await rateLimit("dl:"+s.sub,20,3600))return json(res,429,{error:"rate_limited"});
  const item=RESOURCES[s.product];if(!item||item.edition!==s.edition)return json(res,503,{error:"resource_not_staged"});
  const file=await fs.readFile(path.join(process.cwd(),"private-reader-assets",item.file));
  await audit(s.sub,s.product,"download_issued",req,s.device);
  res.statusCode=200;res.setHeader("content-type","application/zip");res.setHeader("content-length",String(file.length));res.setHeader("content-disposition",`attachment; filename="${item.name}"`);res.setHeader("cache-control","private, no-store, max-age=0");res.setHeader("x-content-type-options","nosniff");res.end(file);
 }catch(e){return json(res,401,{error:"unauthorized"});}
}