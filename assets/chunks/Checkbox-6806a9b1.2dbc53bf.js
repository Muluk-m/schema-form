import{f,g as a,d as c,C as h,m as n,j as k,k as b,l as v,i as g}from"../app.87f9ed5d.js";import{g as x}from"./widget-8eb6b43c.b301beeb.js";function r(e){return typeof e=="function"||Object.prototype.toString.call(e)==="[object Object]"&&!b(e)}const V={modelValue:v(),addon:{type:Object,default:()=>({})}},[l]=g("widget-checkbox");var C=f({name:l,props:V,emits:["update:modelValue"],setup:(e,{emit:u})=>{const d=a({get:()=>e.modelValue,set:o=>{u("update:modelValue",o)}}),p=a(()=>({...e.addon.props})),m=a(()=>{var t;var o;return x(e.addon.schema,(t=(o=e.addon.props)==null?void 0:o.options)!=null?t:[])});return()=>{let o;return c("div",{class:l},[c(h,n({modelValue:d.value,"onUpdate:modelValue":t=>d.value=t,direction:"horizontal"},p.value),r(o=m.value.map(({label:t,value:s,props:i})=>c(k,n({key:s,name:s},i),r(t)?t:{default:()=>[t]})))?o:{default:()=>[o]})])}}});export{C as default};