import { list } from '@vercel/blob';
export default async function handler(req,res){
  if(req.method!=='GET') return res.status(405).json({error:'Method not allowed'});
  let cursor, a=0, b=0;
  do{
    const r=await list({prefix:'votes/',limit:1000,cursor});
    for(const x of r.blobs){
      if(x.pathname.endsWith('-after-curtain.json')) a++;
      else if(x.pathname.endsWith('-absent-prince.json')) b++;
    }
    cursor=r.cursor;
  }while(cursor);
  const total=a+b;
  const pct=n=>total?Math.round(n/total*1000)/10:0;
  res.status(200).json({total,stories:[
    {choice:'after-curtain',title:'《落幕之後》',votes:a,percentage:pct(a)},
    {choice:'absent-prince',title:'《太子爺不在的城市》',votes:b,percentage:pct(b)}
  ]});
}