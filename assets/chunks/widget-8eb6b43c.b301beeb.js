const m=(e,n)=>{let t=[];if(n&&n.length>0)t=n;else if(e.enum&&e.enum.length>0){const l=e.enumNames||e.enum;t=e.enum.map((u,g)=>({label:l[g],value:u,props:{}}))}return t};export{m as g};
