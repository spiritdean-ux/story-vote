import { list } from '@vercel/blob';
import crypto from 'node:crypto';

function cookies(req){return Object.fromEntries((req.headers.cookie||'').split(';').filter(Boolean).map(x=>{const i=x.indexOf('=');return [x.slice(0,i).trim(),decodeURIComponent(x.slice(i+1))]}));}
export default async function handler(req,res){
  if(req.method!=='GET') return res.status(405).json({error:'Method not allowed'});
  let id=cookies(req).device_id;
  if(!id){id=crypto.randomUUID();res.setHeader('Set-Cookie',`device_id=${encodeURIComponent(id)}; Path=/; Max-Age=31536000; SameSite=Lax; Secure; HttpOnly`);}
  const {blobs}=await list({prefix:`votes/${id}-`,limit:10});
  const b=blobs[0];
  let choice=null;
  if(b){choice=b.pathname.includes('-after-curtain.json')?'after-curtain':'absent-prince';}
  res.status(200).json({hasVoted:!!b,choice});
}