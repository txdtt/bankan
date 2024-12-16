(()=>{"use strict";let t=[];const e="http://localhost:3000";async function n(){const n=await async function(){const t=e.concat("/api/columns");try{const e=await fetch(t);if(!e.ok)throw new Error(`Response status: ${e.status}`);return await e.json()}catch(t){return t instanceof Error&&console.error(t.message),[]}}();t.length=0,t.push(...n)}const o="http://localhost:3000";async function c(t,e){const n=o.concat(`/api/columns/${t}/tasks/${e}`);try{const t=await fetch(n,{method:"DELETE",headers:{"Content-type":"application/json"}});if(!t.ok)throw new Error(`Error deleting the task: ${t.status}`)}catch(t){t instanceof Error&&console.log(t)}}async function s(t,e){const n=o.concat(`/api/columns/${t}/reorder`);try{const t=await fetch(n,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({tasks:e})});if(!t.ok)throw new Error(`Error updating task order: ${t.statusText}`)}catch(t){t instanceof Error&&console.error("updateTaskOrder: ",t)}}let a=null,i=null;function d(){document.querySelectorAll(".column").forEach((t=>{t.addEventListener("dragover",(t=>function(t){t.preventDefault(),t.dataTransfer&&(t.dataTransfer.dropEffect="move");const e=t.currentTarget,n=document.querySelector(".dragging");if(n){const o=function(t,e){const n=Array.prototype.slice.call(t.querySelectorAll(".task:not(.dragging)"));for(const t of n){const n=t.getBoundingClientRect();if(e-n.top-n.height/2<0)return t}return null}(e,t.clientY);o&&o!==i?o.insertAdjacentElement("beforebegin",n):o||e.lastElementChild===i||e.appendChild(n)}}(t))),t.addEventListener("dragenter",(t=>function(t){t.currentTarget.classList.add("over")}(t))),t.addEventListener("dragleave",(t=>function(t){t.currentTarget.classList.remove("over")}(t))),t.addEventListener("drop",(t=>function(t){var e;t.preventDefault();const n=null===(e=t.dataTransfer)||void 0===e?void 0:e.getData("text/plain");let o;n&&(o=document.getElementById(n));t.currentTarget.classList.remove("over")}(t)))}))}function r(e){if(e._id){const n=document.getElementById(e._id);if(!n)return;const o=n.closest(".column");o&&n.setAttribute("data-column-id",o.id),n.addEventListener("dragstart",(t=>async function(t,e){const n=t.currentTarget;t.dataTransfer&&(t.dataTransfer.effectAllowed="move",e._id&&t.dataTransfer.setData("taskId",e._id));const o=t.currentTarget.closest(".column");e._id&&(a=o.id,c(a,e._id)),n.classList.add("dragging"),i=document.createElement("div"),i.classList.add("placeholder"),i.style.height=`${n.offsetHeight}px`}(t,e))),n.addEventListener("dragend",(n=>async function(e,n){const o=document.querySelector(".dragging");if(o&&i){const c=e.currentTarget.closest(".column");if(c&&a){const e=c.id,i=t.findIndex((t=>t._id===c.id));if(n._id){const d=c.querySelectorAll(".task");let r=Array.from(d).indexOf(o);if(-1!==r)if(a===e){if(n._id){console.log("sourceColumnId === targetColumnId");const o=t[i].tasks.findIndex((t=>t._id===n._id));t[i].tasks.splice(o,1),t[i].tasks.splice(r,0,{title:n.title,description:n.description,_id:n._id}),await s(e,t[i].tasks)}}else console.log("sourceColumnId !== targetColumnId"),t[i].tasks.splice(r,0,{title:n.title,description:n.description,_id:n._id}),await s(e,t[i].tasks)}}i.replaceWith(o),o.classList.remove("dragging"),i=null}}(n,e)))}}function l(t){if(t._id){const e=document.getElementById(t._id);if(!e)return;const n=e.closest(".column");n&&e.setAttribute("data-column-id",n.id);const o=e.cloneNode(!0);e.replaceWith(o)}}function u(e){const n=document.createElement("div");n.classList.add("task","item"),n.setAttribute("draggable","true"),e._id&&(n.id=e._id);const s=document.createElement("div");s.classList.add("taskHeader");const a=document.createElement("div");a.classList.add("taskTitle"),a.textContent=e.title;const i=document.createElement("div");i.classList.add("menuDots"),i.innerHTML="⋮",i.setAttribute("draggable","false"),s.appendChild(a),s.appendChild(i);const d=document.createElement("div");return d.classList.add("taskDescription"),d.textContent=e.description,n.appendChild(s),n.appendChild(d),r(e),function(e,n,s,a){e.onclick=()=>{let i=e.querySelector(".menuDialog");if(i)i.style.display="block"===i.style.display?"none":"block";else{i=document.createElement("div"),i.classList.add("menuDialog");const e=document.createElement("h2");e.textContent="Column dialog",i.appendChild(e);const d=document.createElement("button");d.innerHTML="Edit title",i.appendChild(d),d.onclick=()=>{n.innerHTML="";const e=document.createElement("input");e.type="text",e.value=n.textContent||"",n.appendChild(e),e.focus();const c=async()=>{n.textContent=e.value,i.style.display="none";const c=a.parentElement;if(c){const n=c.id,s=t.findIndex((t=>t._id===n));if(-1!==s){const n=a.id;if(n){await async function(t,e,n){const c=o.concat(`/api/columns/${t}/tasks/${e}`);try{const t=await fetch(c,{method:"PATCH",headers:{"Content-type":"application/json"},body:JSON.stringify({title:n})});if(!t.ok)throw new Error(`Failed to update task title. Server responded with ${t.status}`)}catch(t){t instanceof Error&&console.error(t)}}(c.id,n,e.value);const a=t[s].tasks.findIndex((t=>t._id===n));l(t[s].tasks[a]),r(t[s].tasks[a])}}}},s=document.createElement("button");s.textContent="Save",i.appendChild(s),s.onclick=c,e.addEventListener("keypress",(t=>{"Enter"===t.key&&c()}))};const u=document.createElement("button");u.innerHTML="Edit desc",i.appendChild(u),u.onclick=()=>{s.innerHTML="";const e=document.createElement("input");e.type="text",e.value=s.textContent||"",s.appendChild(e),e.focus();const n=()=>{s.textContent=e.value,i.style.display="none";const n=a.parentElement;if(n){const c=n.id;!async function(t,e,n){const c=o.concat(`/api/columns/${t}/tasks/${e}`);try{const t=await fetch(c,{method:"PATCH",headers:{"Content-type":"application/json"},body:JSON.stringify({description:n})});if(!t.ok)throw new Error(`Failed to update task description. Server responded with ${t.status}`)}catch(t){t instanceof Error&&console.error(t)}}(n.id,a.id,e.value);const s=t.findIndex((t=>t._id===c));if(-1!==s){const e=a.id;if(e){const n=t[s].tasks.findIndex((t=>t._id===e));l(t[s].tasks[n]),r(t[s].tasks[n])}}}},c=document.createElement("button");c.textContent="Save",i.appendChild(c),c.onclick=n,e.addEventListener("keypress",(t=>{"Enter"===t.key&&n()}))};const p=document.createElement("button");p.innerHTML="Delete task",i.appendChild(p),p.onclick=async()=>{const e=a.parentElement;if(e){const n=e.id;if(-1!==t.findIndex((t=>t._id===n))){const t=a.id;if(t){c(e.id,t);const n=document.getElementById(t);n&&n.remove()}}}}}e.appendChild(i)}}(i,a,d,n),n}function p(n){const o=document.getElementById("itemContainer");if(!o)return void console.error("Item container not found");const c=document.createElement("div");c.classList.add("column");const s=n._id;s&&(c.id=s);const a=document.createElement("div");a.classList.add("columnTitle"),a.textContent=n.title;const i=document.createElement("div");i.classList.add("menuDots"),i.innerHTML="⋮",i.onclick=()=>{let o=i.querySelector(".menuDialog");if(o)o.style.display="block"===o.style.display?"none":"block";else{o=document.createElement("div"),o.classList.add("menuDialog");const c=document.createElement("h2");c.textContent="Column dialog",o.appendChild(c);const s=document.createElement("button");s.innerHTML="Edit",s.onclick=()=>{a.innerHTML="";const c=document.createElement("input");c.type="text",c.value=a.textContent||"",a.appendChild(c),c.focus();const s=document.createElement("button");s.textContent="Save",o.appendChild(s),s.onclick=()=>{a.textContent=c.value,o.style.display="none";const s=t.findIndex((t=>t._id===n._id));n._id&&async function(t,n){const o=e.concat(`/api/columns/${t}`);try{const t=await fetch(o,{method:"PATCH",headers:{"Content-type":"application/json"},body:JSON.stringify({title:n})});if(!t.ok)throw new Error(`Failed to add column. Server responded with ${t.status}`)}catch(t){t instanceof Error&&console.error(t)}}(n._id,c.value),-1!==s&&t.splice(s,1,Object.assign(Object.assign({},t[s]),{title:c.value}))},c.addEventListener("keypress",(e=>{if("Enter"===e.key){a.textContent=c.value,o.style.display="none";const e=t.findIndex((t=>t._id===n._id));-1!==e&&t.splice(e,1,Object.assign(Object.assign({},t[e]),{title:c.value}))}}))};const d=document.createElement("button");d.innerHTML="Delete",d.onclick=async()=>{if(t.findIndex((t=>t._id===n._id)),n._id){await async function(t){const n=e.concat(`/api/columns/${t}`);try{const t=await fetch(n,{method:"DELETE",headers:{"Content-type":"application/json"}});t.ok||console.error(`Error deleting column: ${t.status}`)}catch(t){t instanceof Error&&console.log(t)}}(n._id);const t=document.getElementById(n._id);t&&t.remove()}},o.appendChild(s),o.appendChild(d),i.appendChild(o),o.style.display="block",o.onclick=t=>{t.stopPropagation()}}};const r=document.createElement("div");r.classList.add("columnTitleContainer"),r.appendChild(a),r.appendChild(i),c.appendChild(r),n.tasks&&Array.isArray(n.tasks)&&n.tasks.forEach((t=>{const e=u(t);c.appendChild(e)})),o.appendChild(c),d()}function m(){const o=document.createElement("div");o.id="dialog",o.className="dialog";const c=document.createElement("div");c.className="dialog-content";const s=document.createElement("span");s.className="close",s.textContent="x",s.onclick=()=>{o.remove()};const a=document.createElement("h2");a.textContent="Add New Column";const i=document.createElement("label");i.setAttribute("for","columnTitle"),i.textContent="Title:";const d=document.createElement("input");d.type="text",d.placeholder="Enter column title";const r=document.createElement("button");r.textContent="Submit",r.onclick=()=>async function(o){const c=o.value;if(o&&c){const o={title:c,tasks:[]};await async function(t){const n=e.concat("/api/columns");try{const e=await fetch(n,{method:"POST",headers:{"Content-type":"application/json"},body:JSON.stringify(t)});if(!e.ok)throw new Error(`Server error: ${e.status}`)}catch(t){t instanceof Error&&console.error("Error posting column: ",t.message)}}(o),await n();const s=t.find((t=>t.title===c));if(!s)return console.log("Column does not exist: ",s),null;p(s)}else console.error("Title cannot be empty");o&&(o.value="");const s=document.getElementById("dialog");s?s.remove():console.error("Dialog not found!")}(d),c.appendChild(s),c.appendChild(a),c.appendChild(i),c.appendChild(d),c.appendChild(r),o.appendChild(c),document.body.appendChild(o),d.value="",o.style.display="block"}async function f(){const e=document.createElement("div");e.id="dialog",e.className="dialog";const o=document.createElement("div");o.className="dialog-content";const c=document.createElement("span");c.className="close",c.textContent="x",c.onclick=()=>{e.remove()};const s=document.createElement("h2");s.textContent="Add New Task";const a=document.createElement("label");a.setAttribute("for","taskTitle"),a.textContent="Title:";const i=document.createElement("input");i.type="text",i.id="taskTitle",i.placeholder="Enter task title";const l=document.createElement("label");l.setAttribute("for","taskDescription"),l.textContent="Description:";const p=document.createElement("input");p.type="text",p.id="taskDescription",p.placeholder="Enter task description";const m=document.createElement("div");m.textContent="Select Column:";const f=document.createElement("select");f.id="columnSelect",t&&Array.isArray(t)&&t.forEach((t=>{const e=document.createElement("option");t._id&&(e.value=t._id,e.textContent=t.title,f.appendChild(e))}));const h=document.createElement("button");h.textContent="Submit",h.onclick=()=>async function(e,o,c){const s=document.getElementById(e);if(!s)return console.error("columnElement is null:",s),null;try{const a=await(async(t,e,n)=>{try{console.log("columnId: ",t),console.log("title: ",e),console.log("description: ",n);const o=await fetch(`/api/columns/${t}/tasks`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({title:e,description:n})});if(!o.ok)throw new Error(`!response.ok: Failed to add task: ${o.statusText}`);return{success:!0,message:"Task added"}}catch(t){return console.error(t),{success:!1,message:"Failed to add task!"}}})(e,o,c);if(!a.success)return console.error("Error: response.success === false"),null;await n();const i=t.find((t=>t._id===e));if(!i)return console.error(`Column with ID ${e} not found`),null;const l=i.tasks.find((t=>t.title===o));if(!l)return console.error("Task not found!"),null;const p=u(l);s.appendChild(p),d(),r(l);const m=document.getElementById("dialog");return m?m.remove():console.error("Dialog not found!"),p}catch(t){return console.error("Error adding task:",t),null}}(f.value,i.value,p.value),o.appendChild(c),o.appendChild(s),o.appendChild(a),o.appendChild(i),o.appendChild(l),o.appendChild(p),o.appendChild(m),o.appendChild(f),o.appendChild(h),e.appendChild(o),document.body.appendChild(e),e.style.display="block"}window.onload=async()=>{await n(),d(),t&&Array.isArray(t)&&t.forEach((t=>{p(t),t.tasks.forEach((t=>r(t)))})),window.addColumn=m,window.addTask=f}})();
//# sourceMappingURL=main.bundle.js.map