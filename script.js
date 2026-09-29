const defaultItems=[
 {id:1,type:"lost",name:"Black Wallet",category:"Accessories",location:"Main Library",date:"2026-09-25",color:"Black",desc:"Leather wallet with a small silver sticker.",icon:"👛"},
 {id:2,type:"found",name:"Wireless Earbuds",category:"Electronics",location:"Canteen",date:"2026-09-27",color:"White",desc:"White earbuds in a charging case.",icon:"🎧"},
 {id:3,type:"lost",name:"Scientific Calculator",category:"Stationery",location:"Block A Lab",date:"2026-09-24",color:"Black",desc:"Casio calculator with initials on the back.",icon:"🧮"},
 {id:4,type:"found",name:"Blue Water Bottle",category:"Other",location:"Sports Ground",date:"2026-09-28",color:"Blue",desc:"Blue bottle with a campus sticker.",icon:"🧴"},
 {id:5,type:"lost",name:"College ID Card",category:"Documents",location:"Main Gate",date:"2026-09-26",color:"White",desc:"Student ID card in a transparent holder.",icon:"🪪"},
 {id:6,type:"found",name:"Black Backpack",category:"Accessories",location:"Seminar Hall",date:"2026-09-29",color:"Black",desc:"Black backpack with two front pockets.",icon:"🎒"}
];
let items=JSON.parse(localStorage.getItem("slf_items")||"null")||defaultItems;
function save(){localStorage.setItem("slf_items",JSON.stringify(items));}
function renderItems(){
 const q=(document.getElementById("itemSearch")?.value||"").toLowerCase();
 const cat=document.getElementById("categoryFilter")?.value||"";
 const type=document.getElementById("typeFilter")?.value||"";
 const filtered=items.filter(x=>(!q||`${x.name} ${x.location} ${x.category} ${x.desc}`.toLowerCase().includes(q))&&(!cat||x.category===cat)&&(!type||x.type===type));
 document.getElementById("itemsGrid").innerHTML=filtered.length?filtered.map(card).join(""):`<div class="item-card"><div class="item-body"><h3>No matching items</h3><p>Try another keyword or filter.</p></div></div>`;
 document.getElementById("foundPreview").innerHTML=items.filter(x=>x.type==="found").slice(0,3).map(card).join("");
 updateStats();
}
function card(x){return `<article class="item-card"><div class="item-img">${x.icon||"📦"}</div><div class="item-body"><span class="tag">${x.type}</span><h3>${escapeHtml(x.name)}</h3><p>📍 ${escapeHtml(x.location)}</p><p>📅 ${x.date}</p><p>${escapeHtml(x.desc)}</p><div class="card-actions"><small>${escapeHtml(x.category)}</small><button onclick="viewItem(${x.id})">View details →</button></div></div></article>`}
function viewItem(id){const x=items.find(a=>a.id===id); if(!x)return; alert(`${x.name}\n\nStatus: ${x.type.toUpperCase()}\nCategory: ${x.category}\nLocation: ${x.location}\nDate: ${x.date}\nColor: ${x.color||"Not specified"}\n\n${x.desc}\n\nFor a real deployment, ownership claims should be verified by an administrator.`)}
function submitReport(e,type){
 e.preventDefault(); const f=new FormData(e.target); const name=f.get("name");
 const x={id:Date.now(),type,name,category:f.get("category"),location:f.get("location"),date:f.get("date"),color:f.get("color"),brand:f.get("brand"),desc:f.get("description"),icon:type==="lost"?"📦":"🔎"};
 items.unshift(x);save();e.target.reset();document.getElementById("myReports").textContent=Number(document.getElementById("myReports").textContent)+1;showToast(`Your ${type} report was submitted! Report ID: SLF-${String(x.id).slice(-6)}`);renderItems();location.hash=type==="lost"?"lost":"found";
}
function loginDemo(e){e.preventDefault();const n=document.getElementById("loginName").value||"Student";localStorage.setItem("slf_user",n);showToast(`Welcome, ${n}! Demo login successful.`);location.hash="dashboard";}
function searchItems(v){const el=document.getElementById("itemSearch");if(el){el.value=v;location.hash="lost";renderItems();}}
function toggleMenu(){const n=document.getElementById("nav");n.style.display=n.style.display==="flex"?"none":"flex";}
function showToast(msg){const t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>t.classList.remove("show"),3500);}
function updateStats(){const l=items.filter(x=>x.type==="lost").length,f=items.filter(x=>x.type==="found").length;document.getElementById("statLost").textContent=l;document.getElementById("statFound").textContent=f;}
function escapeHtml(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));}
document.addEventListener("DOMContentLoaded",()=>{renderItems();if(localStorage.getItem("slf_user"))document.getElementById("myReports").textContent=items.filter(x=>x.user).length||0;});
