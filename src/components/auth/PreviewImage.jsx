import React, { useState } from 'react'
const PreviewImage=({file})=>{
    const [preview,setPreview]=useState(null);
    const reader=new FileReader();
    reader.readAsDataURL(file);
    reader.onload=()=>{
        setPreview(reader.result);
    };
    return (
    <>
        <img src={preview} alt="avatar" />
    </>
  )
}
export default PreviewImage