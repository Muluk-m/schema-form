import{g as f,h,i as s,f as r,l as k,m as n,C as b,n as g,p as x,k as V}from"../app.e24f9bd4.js";import{g as y}from"./widget-8eb6b43c.b301beeb.js";function u(t){return typeof t=="function"||Object.prototype.toString.call(t)==="[object Object]"&&!g(t)}const C={modelValue:x(),addon:{type:Object,default:()=>({})}},[l]=V("widget-checkbox");var P=f({name:l,props:C,emits:["update:modelValue"],setup:(t,{emit:d})=>{const a=h(),c=s({get:()=>t.modelValue,set:e=>{d("update:modelValue",e)}}),m=s(()=>({...a.value.props})),i=s(()=>{var o;var e;return y(a.value.schema,(o=(e=a.value.props)==null?void 0:e.options)!=null?o:[])});return()=>{let e;return r("div",{class:l},[r(k,n({modelValue:c.value,"onUpdate:modelValue":o=>c.value=o,direction:"horizontal"},m.value),u(e=i.value.map(({label:o,value:p,props:v})=>r(b,n({key:p,name:p},v),u(o)?o:{default:()=>[o]})))?e:{default:()=>[e]})])}}});export{P as default};