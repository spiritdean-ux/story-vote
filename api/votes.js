import { list, put } from '@vercel/blob';
import crypto from 'node:crypto';

function cookies(req){return Object.fromEntries((req.headers.cookie||'').split(';').filter(Boolean).map(x=>{const i=x.indexOf('=');return [x.slice(0,i).trim(),decodeURIComponent(x.slice(i+1))]}));}
export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
  const choice=req.body?.choice;
  if(!['after-curtain','absent-prince'].includes(choice)) return res.status(400).json({error:'無效選項'});
  let id=cookies(req).device_id;
  if(!id){id=crypto.randomUUID();res.setHeader('Set-Cookie',`device_id=${encodeURIComponent(id)}; Path=/; Max-Age=31536000; SameSite=Lax; Secure; HttpOnly`);}
  const existing=await list({prefix:`votes/${id}-`,limit:10});
  if(existing.blobs.length) return res.status(409).json({error:'你已經投過票了'});
  await put(`votes/${id}-${choice}.json`,JSON.stringify({choice,at:new Date().toISOString()}),{access:'private',allowOverwrite:false,contentType:'application/json'});
  res.status(201).json({message:'投票成功，謝謝你！',choice});
}