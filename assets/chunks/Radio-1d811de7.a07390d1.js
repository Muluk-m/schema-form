import{g as f,h as g,i as s,f as r,R as V,m as p,v as h,n as j,j as y,k as O}from"../app.e24f9bd4.js";import{g as P}from"./widget-8eb6b43c.b301beeb.js";function u(a){return typeof a=="function"||Object.prototype.toString.call(a)==="[object Object]"&&!j(a)}const R={modelValue:y("")},[i]=O("widget-radio");var N=f({name:i,props:R,emits:["update:modelValue"],setup:(a,{emit:l})=>{const t=g(),d=s({get:()=>a.modelValue,set:e=>{l("update:modelValue",e)}}),m=s(()=>({...t.value.props})),c=s(()=>{var o;var e;return P(t.value.schema,(o=(e=t.value.props)==null?void 0:e.options)!=null?o:[])});return()=>{let e;return r("div",{class:i},[r(V,p({modelValue:d.value,"onUpdate:modelValue":o=>d.value=o,direction:"horizontal"},m.value),u(e=c.value.map(({label:o,value:n,props:v})=>r(h,p({key:n,name:n},v),u(o)?o:{default:()=>[o]})))?e:{default:()=>[e]})])}}});export{N as default};