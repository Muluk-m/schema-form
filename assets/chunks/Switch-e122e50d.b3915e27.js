import{f as c,u as m,g as s,e as o,S as n,m as r,i}from"../app.ca53d168.js";const v={modelValue:{type:Boolean,default:!1}},[t]=i("widget-switch");var f=c({name:t,props:v,emits:["update:modelValue"],setup:(l,{emit:u})=>{const d=m(),a=s({get:()=>l.modelValue,set:e=>{u("update:modelValue",e)}}),p=s(()=>({...d.value.props}));return()=>o("div",{class:t},[o(n,r({modelValue:a.value,"onUpdate:modelValue":e=>a.value=e},p.value),null)])}});export{f as default};
